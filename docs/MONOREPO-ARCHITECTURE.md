# Ampli - Monorepo Architecture

## Project Overview

**Ampli** is a modern music and podcast streaming platform built with a monorepo architecture. The platform consists of a mobile app (primary experience), a web player (limited functionality with deep linking to mobile), and a robust API backend.

## Tech Stack Philosophy

The stack is chosen for **best user experience**, following patterns used by Spotify, SoundCloud, and Tidal:

- **Modern**: Latest stable versions, active maintenance
- **Type-safe**: TypeScript across the stack
- **Developer Experience**: Fast builds, excellent tooling
- **Performance**: Optimized for audio streaming and playback
- **Cross-platform**: Maximum code sharing between mobile/web

## Monorepo Structure

```
ampli/
├── apps/
│   ├── mobile/              # Expo - Full featured mobile app
│   ├── web/                 # Next.js - Landing + basic player
│   └── api/                 # Node.js - Backend API
├── packages/
│   ├── ui/                  # Shared UI components (mobile/web)
│   ├── types/               # TypeScript types (shared across apps)
│   ├── api-client/          # API client with TanStack Query
│   ├── audio-player/        # Audio playback logic
│   ├── validators/          # Zod schemas for validation
│   └── config/              # Shared configs (eslint, tsconfig, etc.)
├── docker-compose.yml       # Local development environment
├── turbo.json              # Turborepo pipeline configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── package.json            # Root package.json
```

## Technology Decisions

### Monorepo Management

**Turborepo** (chosen over Nx and pnpm workspaces alone)

**Why Turborepo:**
- Simpler than Nx, less overhead
- Incremental builds with intelligent caching
- Remote caching for team collaboration
- Perfect for JS/TS monorepos
- Fast task orchestration (`turbo dev`, `turbo build`)

**Commands:**
```bash
turbo dev      # Run all apps in development
turbo build    # Build only what changed
turbo lint     # Lint only modified packages
turbo test     # Run tests with caching
```

### Mobile App (`apps/mobile`)

**Stack:**
- **Framework**: Expo (latest SDK)
- **State Management**:
  - Zustand (UI/local state)
  - TanStack Query (server state, caching)
- **Forms**: React Hook Form + Zod
- **Audio**: React Native Track Player
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind for React Native)

**Why Expo over React Native bare:**
- Faster development cycle
- EAS (Expo Application Services) for builds/updates
- OTA updates without app store review
- Better developer experience
- Can always eject if needed (`expo prebuild`)
- Excellent support for audio, notifications, background tasks

**Why React Native Track Player:**
- **Production-ready** for music streaming apps
- Background playback support
- Lock screen controls / CarPlay / Android Auto
- Playlist management
- Progress tracking and seeking
- Battle-tested by major apps
- Active maintenance (v4.1.2, August 2025)

**Use case:** Full-featured music/podcast player with all controls, playlists, downloads, etc.

### Web App (`apps/web`)

**Stack:**
- **Framework**: Next.js 15 (App Router)
- **State Management**:
  - Zustand (same as mobile)
  - TanStack Query (same as mobile)
- **Forms**: React Hook Form + Zod (shared with mobile)
- **Audio**: Howler.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

**Why Next.js:**
- SEO for landing pages
- SSR for song/podcast metadata (social sharing)
- Fast refresh and great DX
- Easy Vercel deployment
- Can share React components with mobile via `react-native-web` if needed

**Why Howler.js:**
- **Best-in-class web audio library** (145k+ weekly downloads)
- Supports high-quality codecs: FLAC, WAV, AAC, OPUS
- Cross-browser compatibility (Web Audio API + HTML5 Audio fallback)
- Lightweight (7KB gzipped)
- Audio sprites for efficient loading
- Spatial audio support
- Battle-tested and reliable

**Alternative considered:** Tone.js (better for audio synthesis/effects, overkill for playback)

**Web Strategy:**
- Landing page with SEO optimization
- Basic web player (play/pause/seek)
- Strong CTAs to download mobile app
- Deep linking: `ampli.com/playlist/123` → Opens in mobile app

### API (`apps/api`)

**Stack:**
- **Framework**: Node.js + Express (migrating to Hono.js)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Auth**: JWT
- **File Storage**: Cloudinary
- **Email**: Nodemailer + Mailtrap (dev) / SendGrid (prod)
- **Deployment**: Render (with Docker)

**Why Drizzle over Mongoose:**
- Type-safe queries
- Better performance
- SQL over NoSQL for relational data (playlists, followers, etc.)
- Easier migrations
- Better tooling

**Why PostgreSQL:**
- ACID compliance
- Better for complex queries (recommendations, aggregations)
- JSON support when needed
- Mature ecosystem
- Free tier on Render

**Migration Path:**
1. MongoDB → PostgreSQL data migration
2. Mongoose models → Drizzle schemas
3. Express → Hono.js (optional, for better performance)

## Shared Packages

### `packages/types`

Shared TypeScript types across all apps:

```typescript
// Example: User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Audio {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverArt?: string;
}
```

### `packages/api-client`

API client wrapper with TanStack Query hooks:

```typescript
// Shared between mobile and web
export const useAudios = () => {
  return useQuery({
    queryKey: ['audios'],
    queryFn: () => api.get('/audios'),
  });
};
```

### `packages/validators`

Zod schemas for validation (shared between frontend and backend):

```typescript
export const CreatePlaylistSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
});
```

### `packages/audio-player`

Shared audio playback logic (adapted per platform):

```typescript
// Core logic that both mobile and web use
export const formatDuration = (seconds: number) => { ... };
export const calculateProgress = (current: number, total: number) => { ... };
```

### `packages/ui`

Shared UI components (using `react-native-web` for cross-platform):

```typescript
// Can be used in both mobile and web
export const Button = ({ ... }) => { ... };
export const PlayButton = ({ ... }) => { ... };
```

## Audio Quality & Streaming

### Target Quality Levels

Following industry standards (Spotify, Tidal):

**Free Tier:**
- 128 kbps AAC (web)
- 160 kbps AAC (mobile)

**Premium Tier:**
- 256 kbps AAC (standard)
- 320 kbps AAC (high quality)
- FLAC lossless (24-bit/44.1kHz) - future

### Web Audio Implementation

**Howler.js configuration:**
```javascript
const sound = new Howl({
  src: ['song.flac', 'song.mp3', 'song.ogg'], // Fallbacks
  html5: true,  // Streaming mode for large files
  format: ['flac', 'mp3', 'ogg'],
  volume: 1.0,
  onload: () => { /* Ready to play */ },
  onplay: () => { /* Update UI */ },
  onend: () => { /* Next track */ },
});
```

**Features:**
- Progressive streaming (no full download needed)
- Preloading next track
- Crossfade between tracks
- Gapless playback

### Mobile Audio Implementation

**React Native Track Player configuration:**
```typescript
await TrackPlayer.setupPlayer({
  maxCacheSize: 1024 * 10, // 10 MB
  waitForBuffer: true,
});

await TrackPlayer.updateOptions({
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.SeekTo,
  ],
  compactCapabilities: [
    Capability.Play,
    Capability.Pause,
  ],
});
```

**Features:**
- Background playback
- Lock screen controls
- CarPlay / Android Auto
- Audio focus management
- Notification controls
- Queue management

## Code Sharing Strategy

### What to Share

✅ **Always share:**
- TypeScript types
- API client logic
- Validation schemas (Zod)
- Business logic utilities
- Constants and configurations

✅ **Sometimes share:**
- UI components (via `react-native-web`)
- Styling utilities (Tailwind classes)
- State management hooks (if logic is identical)

❌ **Never share:**
- Platform-specific audio implementations
- Native modules
- Platform-specific navigation

### Example: Shared Hook

```typescript
// packages/api-client/src/hooks/usePlaylist.ts
export const usePlaylist = (id: string) => {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: () => api.get(`/playlists/${id}`),
  });
};

// Used in both apps/mobile and apps/web
```

## State Management Architecture

### Zustand Stores

**Player Store (example):**
```typescript
interface PlayerState {
  currentTrack: Audio | null;
  isPlaying: boolean;
  queue: Audio[];
  play: (track: Audio) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  play: (track) => set({ currentTrack: track, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  // ... etc
}));
```

**User Store (example):**
```typescript
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}
```

### TanStack Query Usage

All server state managed with React Query:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

**Example:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['playlists'],
  queryFn: fetchPlaylists,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Deep Linking Strategy

### URL Structure

```
ampli.com/                    → Landing page
ampli.com/playlist/123        → Playlist detail (web player + app CTA)
ampli.com/artist/456          → Artist profile (web + app CTA)
ampli.com/album/789           → Album detail (web + app CTA)
ampli.com/download            → Download app page
```

### Implementation

**Mobile (Expo):**
```typescript
// app.json
{
  "expo": {
    "scheme": "ampli",
    "ios": {
      "associatedDomains": ["applinks:ampli.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "https", "host": "ampli.com" }]
        }
      ]
    }
  }
}
```

**Web (Next.js):**
```typescript
// components/OpenInAppButton.tsx
const openInApp = () => {
  const appUrl = `ampli://playlist/${id}`;
  const webUrl = `https://ampli.com/playlist/${id}`;

  // Try to open app, fallback to download page
  window.location.href = appUrl;
  setTimeout(() => {
    window.location.href = '/download';
  }, 2000);
};
```

## Development Workflow

### Local Development

```bash
# Start entire stack
docker-compose up  # Starts postgres, redis, etc.
turbo dev         # Runs mobile, web, api in parallel

# Individual apps
cd apps/mobile && pnpm dev
cd apps/web && pnpm dev
cd apps/api && pnpm dev
```

### Docker Setup

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: ampli
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Build Pipeline

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

## Deployment Strategy

### Mobile App

**Platform**: EAS (Expo Application Services)

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# OTA Updates
eas update --branch production
```

### Web App

**Platform**: Vercel

- Auto-deploy from `main` branch
- Preview deployments for PRs
- Edge functions for API routes
- CDN for static assets

### API

**Platform**: Render (with Docker)

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm turbo build --filter=api

FROM base AS runtime
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

**Render configuration:**
- Auto-deploy from `main` branch
- PostgreSQL managed database
- Environment variables management
- Health checks
- Auto-scaling

## Performance Optimizations

### Mobile

- **Code splitting**: Lazy load screens with Expo Router
- **Image optimization**: Use `expo-image` with caching
- **Audio preloading**: Preload next 2 tracks in queue
- **Offline mode**: Cache playlists and songs locally
- **Background tasks**: Use `expo-background-fetch` for sync

### Web

- **Next.js optimizations**:
  - Static pages for landing
  - ISR for playlists (revalidate every 60s)
  - Image optimization with `next/image`
- **Code splitting**: Route-based splitting
- **Audio streaming**: Progressive download with Howler.js
- **CDN**: Cloudinary for audio/images

### API

- **Database**:
  - Connection pooling
  - Query optimization with indexes
  - Caching with Redis
- **Rate limiting**: Prevent abuse
- **Compression**: gzip/brotli responses
- **CDN**: Cloudinary for media delivery

## Security Considerations

### Authentication

- JWT tokens with refresh mechanism
- Secure httpOnly cookies (web)
- Encrypted storage (mobile)
- Multi-device session management

### Data Protection

- HTTPS only
- CORS configuration
- Input validation with Zod
- SQL injection protection (Drizzle parameterized queries)
- File upload validation
- Rate limiting on auth endpoints

### API Security

- Helmet.js for security headers
- CSRF protection
- Request size limits
- Environment variable validation
- Secrets management (never commit .env)

## Monitoring & Analytics

### Planned Integrations

- **Error tracking**: Sentry
- **Analytics**: Mixpanel or PostHog
- **Performance**: Vercel Analytics (web), Expo Analytics (mobile)
- **Logs**: Render logs (API), CloudWatch (future)

## Testing Strategy

### Unit Tests

- **Tool**: Vitest
- **Coverage**: Business logic, utilities, helpers
- **Location**: `*.test.ts` alongside source files

### Integration Tests

- **API**: Supertest for endpoint testing
- **Database**: Test database with migrations
- **Mocking**: Mock external services (Cloudinary, email)

### E2E Tests

- **Mobile**: Detox (future)
- **Web**: Playwright (future)
- **Focus**: Critical user flows (auth, playback, playlists)

### Test Command

```bash
turbo test              # Run all tests
turbo test --filter=api # Test only API
```

## Migration Path

### Phase 1: Monorepo Setup ✅
- [x] Create monorepo structure
- [x] Setup Turborepo
- [x] Configure pnpm workspaces
- [x] Move existing backend to `apps/api`

### Phase 2: Database Migration (In Progress)
- [ ] Setup PostgreSQL on Render
- [ ] Create Drizzle schemas
- [ ] Write migration scripts
- [ ] Migrate data from MongoDB
- [ ] Update API to use Drizzle

### Phase 3: Mobile App
- [ ] Initialize Expo project
- [ ] Setup navigation (Expo Router)
- [ ] Implement authentication flow
- [ ] Build audio player with Track Player
- [ ] Implement playlists, favorites, history
- [ ] Add offline support

### Phase 4: Web App
- [ ] Initialize Next.js project
- [ ] Build landing page
- [ ] Implement basic web player with Howler.js
- [ ] Add deep linking
- [ ] Deploy to Vercel

### Phase 5: Shared Packages
- [ ] Extract common types to `packages/types`
- [ ] Build API client with TanStack Query
- [ ] Share validation schemas
- [ ] Share UI components where possible

### Phase 6: Production
- [ ] Setup EAS builds
- [ ] Configure CI/CD
- [ ] Implement monitoring
- [ ] Launch beta
- [ ] Collect feedback and iterate

## References

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Expo Docs](https://docs.expo.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [React Native Track Player](https://rntp.dev/)
- [Howler.js](https://howlerjs.com/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs/)
