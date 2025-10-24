# Database Schema for Ampli

Based on industry-standard streaming platform architecture. Designed for PostgreSQL.

## Table of Contents

1. [Core Tables](#core-tables)
2. [Junction Tables](#junction-tables)
3. [Playlist Tables](#playlist-tables)
4. [User Interaction Tables](#user-interaction-tables)
5. [Social Features](#social-features)
6. [Authentication Tables](#authentication-tables)
7. [Views](#views)
8. [Functions & Triggers](#functions--triggers)
9. [Migration Notes](#migration-notes)

---

## Core Tables

### Users Table

Stores user account information and profile data.

```sql
CREATE TABLE Users (
    UserID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Verified BOOLEAN DEFAULT FALSE,
    AvatarURL TEXT,
    AvatarPublicID TEXT,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON Users(Email);
```

### Artists Table

Stores information about content creators/artists.

```sql
CREATE TABLE Artists (
    ArtistID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Name TEXT NOT NULL,
    Bio TEXT,
    Country VARCHAR(100),
    Genre VARCHAR(100),
    AvatarURL TEXT,
    AvatarPublicID TEXT,
    Verified BOOLEAN DEFAULT FALSE,
    UserID UUID REFERENCES Users(UserID) ON DELETE SET NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigram index for artist name search with typo tolerance
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_artists_name_trgm ON Artists USING gin (Name gin_trgm_ops);
CREATE INDEX idx_artists_user ON Artists(UserID);
```

**Key Features:**
- Trigram index enables fuzzy search with typo tolerance
- Optional link to User account (artists can exist without user accounts)
- Verified flag for verified artist badges

### Songs Table

Stores song metadata and file references.

```sql
CREATE TABLE Songs (
    SongID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Title TEXT NOT NULL,
    About TEXT,
    Duration INTEGER, -- in seconds
    Category VARCHAR(50) DEFAULT 'Others',
    FileURL TEXT NOT NULL,
    FilePublicID TEXT NOT NULL,
    PosterURL TEXT,
    PosterPublicID TEXT,
    OwnerID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    PlayCount BIGINT DEFAULT 0,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigram index for song title search
CREATE INDEX idx_songs_title_trgm ON Songs USING gin (Title gin_trgm_ops);
CREATE INDEX idx_songs_owner ON Songs(OwnerID);
CREATE INDEX idx_songs_category ON Songs(Category);
CREATE INDEX idx_songs_created_at ON Songs(CreatedAt DESC);
```

**Key Features:**
- Fuzzy search on titles
- PlayCount for popularity tracking
- File references for Cloudinary/S3 storage
- OwnerID references the user who uploaded (different from artist)

---

## Junction Tables

### ArtistSongs Table

Junction table for many-to-many relationship between Artists and Songs. Enables multiple artists per song and multiple songs per artist.

```sql
CREATE TABLE ArtistSongs (
    ArtistID UUID NOT NULL REFERENCES Artists(ArtistID) ON DELETE CASCADE,
    SongID UUID NOT NULL REFERENCES Songs(SongID) ON DELETE CASCADE,
    Role VARCHAR(50), -- e.g., 'Primary', 'Featured', 'Composer', 'Producer'
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (ArtistID, SongID)
);

CREATE INDEX idx_artist_songs_artist ON ArtistSongs(ArtistID);
CREATE INDEX idx_artist_songs_song ON ArtistSongs(SongID);
```

**Use Cases:**
- Song by multiple artists (collaborations)
- Featured artists
- Different roles (composer, producer, etc.)

---

## Playlist Tables

### Playlists Table

Stores user-created playlists.

```sql
CREATE TABLE Playlists (
    PlaylistID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Title VARCHAR(255) NOT NULL,
    Visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'private'
    OwnerID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_playlists_owner ON Playlists(OwnerID);
CREATE INDEX idx_playlists_visibility ON Playlists(Visibility);
```

### PlaylistItems Table

Stores songs inside playlists with their position.

```sql
CREATE TABLE PlaylistItems (
    PlaylistItemID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    PlaylistID UUID NOT NULL REFERENCES Playlists(PlaylistID) ON DELETE CASCADE,
    SongID UUID NOT NULL REFERENCES Songs(SongID) ON DELETE CASCADE,
    Position INTEGER NOT NULL,
    AddedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(PlaylistID, Position),
    UNIQUE(PlaylistID, SongID)
);

CREATE INDEX idx_playlist_items_playlist ON PlaylistItems(PlaylistID, Position);
CREATE INDEX idx_playlist_items_song ON PlaylistItems(SongID);
```

**Key Features:**
- Position tracking for song order
- Prevents duplicate songs in same playlist
- Optimized for "get all songs in playlist" queries

### AutoGeneratedPlaylists Table

System-generated playlists (e.g., "Trending", "New Releases").

```sql
CREATE TABLE AutoGeneratedPlaylists (
    PlaylistID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Title VARCHAR(255) NOT NULL,
    Category VARCHAR(50),
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UpdatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### AutoGeneratedPlaylistItems Table

```sql
CREATE TABLE AutoGeneratedPlaylistItems (
    PlaylistItemID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    PlaylistID UUID NOT NULL REFERENCES AutoGeneratedPlaylists(PlaylistID) ON DELETE CASCADE,
    SongID UUID NOT NULL REFERENCES Songs(SongID) ON DELETE CASCADE,
    Position INTEGER NOT NULL,
    UNIQUE(PlaylistID, Position),
    UNIQUE(PlaylistID, SongID)
);

CREATE INDEX idx_auto_playlist_items ON AutoGeneratedPlaylistItems(PlaylistID, Position);
```

---

## User Interaction Tables

### Favorites Table

Stores user's favorite songs.

```sql
CREATE TABLE Favorites (
    FavoriteID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    SongID UUID NOT NULL REFERENCES Songs(SongID) ON DELETE CASCADE,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(UserID, SongID)
);

CREATE INDEX idx_favorites_user ON Favorites(UserID);
CREATE INDEX idx_favorites_song ON Favorites(SongID);
```

### Likes Table

Stores song likes (for popularity metrics).

```sql
CREATE TABLE Likes (
    LikeID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    SongID UUID NOT NULL REFERENCES Songs(SongID) ON DELETE CASCADE,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(UserID, SongID)
);

CREATE INDEX idx_likes_user ON Likes(UserID);
CREATE INDEX idx_likes_song ON Likes(SongID);
```

### History Table

Stores user listening history with progress tracking.

```sql
CREATE TABLE History (
    HistoryID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    SongID UUID NOT NULL REFERENCES Songs(SongID) ON DELETE CASCADE,
    Progress INTEGER DEFAULT 0, -- seconds played
    LastPlayedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(UserID, SongID)
);

CREATE INDEX idx_history_user ON History(UserID);
CREATE INDEX idx_history_song ON History(SongID);
CREATE INDEX idx_history_last_played ON History(LastPlayedAt DESC);
```

**Key Features:**
- Progress tracking for "resume playback"
- LastPlayedAt for recently played lists
- Unique constraint ensures one entry per user-song pair

---

## Social Features

### UserFollowers Table

Many-to-many relationship for user following system.

```sql
CREATE TABLE UserFollowers (
    FollowerID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    FollowingID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (FollowerID, FollowingID),
    CHECK (FollowerID != FollowingID) -- Prevent self-following
);

CREATE INDEX idx_user_followers_follower ON UserFollowers(FollowerID);
CREATE INDEX idx_user_followers_following ON UserFollowers(FollowingID);
```

**Key Features:**
- Prevents users from following themselves
- Bi-directional indexes for both followers and following queries

---

## Authentication Tables

### EmailVerificationTokens Table

Temporary tokens for email verification.

```sql
CREATE TABLE EmailVerificationTokens (
    TokenID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    Token VARCHAR(255) NOT NULL,
    ExpiresAt TIMESTAMPTZ NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_tokens_user ON EmailVerificationTokens(UserID);
CREATE INDEX idx_email_tokens_token ON EmailVerificationTokens(Token);
```

**Cleanup Strategy:**
```sql
-- Run periodically via cron or pg_cron extension
DELETE FROM EmailVerificationTokens WHERE ExpiresAt < now();
```

### PasswordResetTokens Table

Temporary tokens for password reset.

```sql
CREATE TABLE PasswordResetTokens (
    TokenID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    Token VARCHAR(255) NOT NULL,
    ExpiresAt TIMESTAMPTZ NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_password_tokens_user ON PasswordResetTokens(UserID);
CREATE INDEX idx_password_tokens_token ON PasswordResetTokens(Token);
```

### UserTokens Table

Stores JWT tokens for multi-device session support.

```sql
CREATE TABLE UserTokens (
    TokenID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserID UUID NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    Token TEXT NOT NULL,
    CreatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_tokens_user ON UserTokens(UserID);
CREATE INDEX idx_user_tokens_token ON UserTokens(Token);
```

---

## Views

### SongsWithArtists View

Songs with their associated artist information.

```sql
CREATE VIEW SongsWithArtists AS
SELECT
    s.SongID,
    s.Title,
    s.Duration,
    s.FileURL,
    s.PosterURL,
    s.Category,
    s.PlayCount,
    s.CreatedAt,
    json_agg(json_build_object(
        'ArtistID', a.ArtistID,
        'Name', a.Name,
        'Role', ars.Role
    )) AS Artists
FROM Songs s
LEFT JOIN ArtistSongs ars ON s.SongID = ars.SongID
LEFT JOIN Artists a ON ars.ArtistID = a.ArtistID
GROUP BY s.SongID;
```

### UserStats View

Aggregated user statistics.

```sql
CREATE VIEW UserStats AS
SELECT
    u.UserID,
    u.Name,
    u.Email,
    COUNT(DISTINCT s.SongID) AS SongsUploaded,
    COUNT(DISTINCT f.FavoriteID) AS FavoritesCount,
    COUNT(DISTINCT p.PlaylistID) AS PlaylistsCreated,
    (SELECT COUNT(*) FROM UserFollowers WHERE FollowingID = u.UserID) AS FollowersCount,
    (SELECT COUNT(*) FROM UserFollowers WHERE FollowerID = u.UserID) AS FollowingCount
FROM Users u
LEFT JOIN Songs s ON u.UserID = s.OwnerID
LEFT JOIN Favorites f ON u.UserID = f.UserID
LEFT JOIN Playlists p ON u.UserID = p.OwnerID
GROUP BY u.UserID;
```

### TrendingSongs View

Songs trending by recent likes (last 7 days).

```sql
CREATE VIEW TrendingSongs AS
SELECT
    s.SongID,
    s.Title,
    s.FileURL,
    s.PosterURL,
    COUNT(l.LikeID) AS RecentLikes
FROM Songs s
LEFT JOIN Likes l ON s.SongID = l.SongID
    AND l.CreatedAt > now() - INTERVAL '7 days'
GROUP BY s.SongID
ORDER BY RecentLikes DESC;
```

---

## Functions & Triggers

### UpdatedAt Trigger

Automatically update the `UpdatedAt` timestamp on row updates.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedAt = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with UpdatedAt
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON Users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON Artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON Songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON Playlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auto_playlists_updated_at BEFORE UPDATE ON AutoGeneratedPlaylists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Increment Play Count Function

Efficiently increment the play count for a song.

```sql
CREATE OR REPLACE FUNCTION increment_play_count(song_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE Songs SET PlayCount = PlayCount + 1 WHERE SongID = song_id;
END;
$$ LANGUAGE plpgsql;

-- Usage:
-- SELECT increment_play_count('song-uuid-here');
```

---

## Migration Notes

### Storage Strategy

- **Audio files**: Stored in Cloudinary/S3 with URLs in `Songs.FileURL`
- **File organization**: `/artist/{artistId}/album/{albumId}/{songId}.ogg`
- **Multiple bitrates**: Can be stored as JSON column or separate file URL columns

### Migration from MongoDB

Key transformations needed:

1. **ObjectId → UUID**: Map MongoDB `_id` to PostgreSQL UUID
2. **Embedded documents → Foreign keys**:
   - `audio.owner` object → `Songs.OwnerID` reference
   - `user.avatar` object → separate columns (`AvatarURL`, `AvatarPublicID`)
3. **Arrays → Junction tables**:
   - `user.followers[]` → `UserFollowers` table
   - `user.followings[]` → `UserFollowers` table
   - `user.tokens[]` → `UserTokens` table
4. **Aggregations → JOINs**: MongoDB aggregations convert to SQL JOINs

Example migration script:

```javascript
// MongoDB to PostgreSQL migration
const users = await User.find();
for (const user of users) {
  await db.insert(users).values({
    userId: uuidFromObjectId(user._id),
    name: user.name,
    email: user.email,
    password: user.password,
    verified: user.verified,
    avatarUrl: user.avatar?.url,
    avatarPublicId: user.avatar?.publicId,
  });

  // Migrate followers to junction table
  for (const followerId of user.followers) {
    await db.insert(userFollowers).values({
      followerId: uuidFromObjectId(followerId),
      followingId: uuidFromObjectId(user._id),
    });
  }
}
```

### Scalability Considerations

1. **Read Replicas**: Use for heavy read operations
2. **Partitioning**: Partition large tables (History, Likes) by date if needed
3. **Caching**: Cache frequently accessed data (trending songs, user stats)
4. **Connection Pooling**: Configure min: 5, max: 10 connections
5. **Indexing Strategy**:
   - Trigram indexes for search
   - B-tree indexes for foreign keys
   - Covering indexes for common queries

### Performance Optimization

```sql
-- Example: Covering index for common playlist query
CREATE INDEX idx_playlist_items_covering
ON PlaylistItems(PlaylistID, Position)
INCLUDE (SongID, AddedAt);

-- Example: Partial index for active tokens only
CREATE INDEX idx_active_email_tokens
ON EmailVerificationTokens(Token)
WHERE ExpiresAt > now();
```

---

## Entity Relationship Diagram

```
Users ──┬── Songs (OwnerID)
        ├── Playlists (OwnerID)
        ├── Favorites (UserID)
        ├── Likes (UserID)
        ├── History (UserID)
        ├── UserFollowers (FollowerID, FollowingID)
        └── UserTokens (UserID)

Artists ──┬── ArtistSongs (ArtistID)
          └── (optional) Users (UserID)

Songs ───┬── ArtistSongs (SongID)
         ├── PlaylistItems (SongID)
         ├── Favorites (SongID)
         ├── Likes (SongID)
         └── History (SongID)

Playlists ── PlaylistItems (PlaylistID)
```

---

## Next Steps

1. Review schema with team
2. Set up local PostgreSQL instance
3. Run schema creation scripts
4. Test with sample data
5. Create Drizzle ORM schema definitions
6. Write data migration scripts

---

**Schema Version:** 1.0
**Last Updated:** 2025-10-23
**Based On:** Industry-standard streaming platform architecture
