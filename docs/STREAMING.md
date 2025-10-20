# Streaming Guide - Audio & Video

> Comprehensive guide to streaming protocols, formats, and implementation strategies for Ampli

**Last Updated**: 2025-10-20
**Related Docs**: [AUDIO-CONCEPTS.md](./AUDIO-CONCEPTS.md), [ADVANCED-STREAMING.md](./ADVANCED-STREAMING.md), [AUDIO-LIBRARIES.md](./AUDIO-LIBRARIES.md)

---

## Table of Contents

1. [Streaming Fundamentals](#streaming-fundamentals)
2. [Streaming Protocols](#streaming-protocols)
3. [Audio Streaming Formats](#audio-streaming-formats)
4. [Live Radio Streaming](#live-radio-streaming)
5. [Adaptive Bitrate Streaming](#adaptive-bitrate-streaming)
6. [Authentication & Security](#authentication--security)
7. [Implementation Patterns](#implementation-patterns)
8. [Platform-Specific Considerations](#platform-specific-considerations)
9. [Performance Optimization](#performance-optimization)
10. [Legal & Licensing](#legal--licensing)

---

## Streaming Fundamentals

### What is Streaming?

**Streaming** is the continuous transmission of audio/video data over a network, allowing playback to begin before the entire file is downloaded.

### Key Concepts

#### Progressive Download vs Streaming

| Feature              | Progressive Download               | True Streaming                |
| -------------------- | ---------------------------------- | ----------------------------- |
| **Protocol**         | HTTP                               | HTTP, RTSP, RTMP              |
| **Buffering**        | Downloads file sequentially        | Downloads segments on-demand  |
| **Seeking**          | Limited (only to downloaded parts) | Full seeking support          |
| **Live Support**     | ❌ No                              | ✅ Yes                        |
| **Adaptive Quality** | ❌ No                              | ✅ Yes                        |
| **Use Case**         | Podcasts, short clips              | Live radio, long-form content |

#### Buffering

```
User hits play
     ↓
[========>---------] Buffer fills (2-10 seconds)
     ↓
Playback starts while continuing to buffer ahead
     ↓
[===============>--] Playing + Buffering
```

**Buffer Size Strategy:**

- **Mobile/Slow Connection**: 5-10 seconds
- **WiFi/Fast Connection**: 2-5 seconds
- **Live Radio**: 1-3 seconds (lower latency)

---

## Streaming Protocols

### 1. HLS (HTTP Live Streaming)

**Developer**: Apple
**Status**: Industry Standard
**Best For**: Live radio, podcasts, adaptive streaming

#### How HLS Works

```
Client Request
     ↓
Master Playlist (index.m3u8)
     ↓
┌─────────────────────────────┐
│ Quality Variants:           │
│ - 320kbps/stream_high.m3u8  │
│ - 192kbps/stream_med.m3u8   │
│ - 64kbps/stream_low.m3u8    │
└─────────────────────────────┘
     ↓
Media Playlist (stream_high.m3u8)
     ↓
┌─────────────────────────────┐
│ Segments (6-10 seconds):    │
│ - segment_001.ts            │
│ - segment_002.ts            │
│ - segment_003.ts            │
└─────────────────────────────┘
     ↓
Client downloads segments sequentially
```

#### Example HLS Playlist

**Master Playlist** (`index.m3u8`):

```m3u8
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=320000,RESOLUTION=1920x1080
high/stream.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=192000,RESOLUTION=1280x720
medium/stream.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=64000,RESOLUTION=640x360
low/stream.m3u8
```

**Media Playlist** (`high/stream.m3u8`):

```m3u8
#EXTM3U
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
segment_001.ts
#EXTINF:10.0,
segment_002.ts
#EXTINF:10.0,
segment_003.ts
```

#### HLS URL Structure (Real-World Examples)

```
The Lot Radio (Hypothetical):
https://stream.thelotradio.com/hls/live/index.m3u8?tkn=abc123

Boiler Room:
https://cdn.boilerroom.tv/hls/event_12345/master.m3u8

Radio Browser Station:
http://stream.radiostation.com/live.m3u8
```

#### Token-Based HLS

```
/hls/video+85c28sa2o8wppm58/0_1/index.m3u8?tkn=qcjV8Zh9gl4KOsqFUlms6F
 │    │                      │    │           │
 │    └─ Stream ID           │    │           └─ Auth Token (expires)
 │                           │    └─ Quality variant
 └─ Protocol                 └─ HLS index file
```

**Token Properties:**

- ⏱️ **Expiration**: 1-24 hours typically
- 🔐 **Purpose**: Prevent unauthorized hotlinking
- 🔄 **Refresh**: Must be regenerated periodically
- 📍 **Scope**: Per-session or per-user

#### Pros & Cons

✅ **Pros:**

- Native iOS support
- Adaptive bitrate (ABR)
- HTTP-based (firewall-friendly)
- CDN-friendly
- Works on all modern browsers

❌ **Cons:**

- Higher latency (10-30 seconds)
- More complex server setup
- Fragment overhead

---

### 2. DASH (Dynamic Adaptive Streaming over HTTP)

**Developer**: MPEG
**Status**: Open Standard (competitor to HLS)
**Best For**: Cross-platform adaptive streaming

#### DASH vs HLS

| Feature       | DASH             | HLS             |
| ------------- | ---------------- | --------------- |
| **Standard**  | ISO/IEC          | Apple           |
| **Container** | MP4 (fragmented) | MPEG-TS or fMP4 |
| **Manifest**  | .mpd (XML)       | .m3u8 (text)    |
| **Support**   | Android native   | iOS native      |
| **DRM**       | Built-in         | FairPlay        |

#### Example DASH Manifest (.mpd)

```xml
<?xml version="1.0"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011">
  <Period>
    <AdaptationSet mimeType="audio/mp4">
      <Representation id="audio_high" bandwidth="320000">
        <BaseURL>audio_320k.mp4</BaseURL>
      </Representation>
      <Representation id="audio_low" bandwidth="64000">
        <BaseURL>audio_64k.mp4</BaseURL>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
```

---

### 3. Traditional Streaming (Icecast/Shoutcast)

**Best For**: Legacy radio stations, simple setups

#### Direct MP3 Stream

```
http://radio.station.com:8000/live.mp3
```

**Characteristics:**

- Single bitrate (no adaptation)
- Continuous stream (no segments)
- Low latency (1-3 seconds)
- Simple server setup
- Limited metadata support

#### Metadata (Icy-Metadata)

```http
GET /live.mp3 HTTP/1.1
Host: radio.station.com
Icy-MetaData: 1

HTTP/1.1 200 OK
icy-br: 128
icy-name: Cool Radio Station
icy-genre: Electronic
icy-url: http://radio.station.com
Content-Type: audio/mpeg

[Audio data with embedded metadata every 16KB]
```

---

### 4. WebRTC

**Best For**: Ultra-low latency live streaming

#### Use Cases

- Live DJ performances (< 500ms latency)
- Interactive broadcasts
- Peer-to-peer audio

#### Latency Comparison

```
Protocol         Latency
─────────────────────────
WebRTC           < 500ms
Icecast/MP3      1-3s
HLS              10-30s
Progressive DL   Variable
```

---

## Audio Streaming Formats

### Codec Comparison

| Codec          | Bitrate Range | Quality  | Browser Support | Use Case                |
| -------------- | ------------- | -------- | --------------- | ----------------------- |
| **MP3**        | 64-320 kbps   | Good     | 100%            | Universal compatibility |
| **AAC**        | 64-320 kbps   | Better   | 98%             | Modern streaming (HLS)  |
| **Opus**       | 16-510 kbps   | Best     | 95%             | WebRTC, low-latency     |
| **FLAC**       | 700-1400 kbps | Lossless | 85%             | Hi-Fi streaming         |
| **OGG Vorbis** | 64-500 kbps   | Good     | 90%             | Open-source alternative |

### Recommended Bitrates

#### Radio/Podcasts (Voice-Heavy)

```
Low Quality:     64 kbps AAC  (voice-only, mobile data)
Standard:        96 kbps AAC  (good enough for voice)
High:            128 kbps AAC (clear voice + music)
```

#### Music Streaming

```
Mobile Data:     96 kbps AAC  (data-saving mode)
Standard:        128 kbps AAC (Spotify Free equivalent)
High:            192 kbps AAC (most users can't tell difference)
Very High:       256 kbps AAC (premium quality)
Lossless:        320 kbps MP3 / FLAC (audiophile)
```

#### Live DJ Sets

```
Club Stream:     192-256 kbps AAC (balance quality/bandwidth)
Premium:         320 kbps AAC (best quality, WiFi only)
```

### Container Formats

#### MPEG-TS (.ts)

- Used by: HLS (legacy)
- Pros: Robust error handling
- Cons: Higher overhead

#### Fragmented MP4 (.m4s, .mp4)

- Used by: HLS (modern), DASH
- Pros: Better compression, seeking
- Cons: Requires newer clients

#### MP3 Stream (raw)

- Used by: Icecast, Shoutcast
- Pros: Simple, low latency
- Cons: No adaptive bitrate

---

## Live Radio Streaming

### Radio Streaming Architecture

```
┌─────────────────┐
│  Radio Station  │
│  (Live Source)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Streaming Server│
│ (Icecast/Wowza) │
└────────┬────────┘
         │
         ├──→ HLS Transcoder ──→ CDN ──→ Mobile Apps
         ├──→ DASH Transcoder ─→ CDN ──→ Web Players
         └──→ MP3 Direct ──────→ Legacy Players
```

### Real-World Radio Platforms

#### 1. Radio Browser (Free, Open API)

**API**: https://www.radio-browser.info/
**Database**: 30,000+ stations
**Cost**: Free, community-maintained

**Example API Call:**

```javascript
// Get all stations
GET https://de1.api.radio-browser.info/json/stations

// Search by country
GET https://de1.api.radio-browser.info/json/stations/bycountry/USA

// Search by genre
GET https://de1.api.radio-browser.info/json/stations/bytag/techno

// Response
{
  "stationuuid": "960d2f22-0601-11e8-ae97-52543be04c81",
  "name": "Radio Paradise - Main Mix",
  "url": "http://stream.radioparadise.com/aac-320",
  "url_resolved": "http://stream.radioparadise.com/aac-320",
  "homepage": "https://radioparadise.com",
  "favicon": "https://radioparadise.com/favicon.ico",
  "country": "USA",
  "language": "english",
  "tags": "rock,alternative,eclectic",
  "codec": "AAC",
  "bitrate": 320,
  "votes": 4521
}
```

#### 2. The Lot Radio (Brooklyn)

**Type**: Curated 24/7 stream
**Quality**: 192 kbps AAC
**API**: Not public

**Stream Structure** (Observed):

```
/hls/video+[stream_id]/0_1/index.m3u8?tkn=[token]
```

**Integration Strategy:**

1. Contact for official API/partnership
2. Or: Reverse-engineer token refresh mechanism
3. Or: Use web embed (if available)

#### 3. Boiler Room

**Type**: Live DJ sets + archive
**Platform**: YouTube (primary)
**API**: YouTube Data API v3

**Integration Options:**

```javascript
// YouTube Data API
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &channelId=UCGBpxWJr9FNOcFYA5GkKrMg
  &eventType=live
  &type=video
  &key=[YOUR_API_KEY]

// Response: Currently live streams
```

**Embedded Player:**

```html
<iframe
  src="https://www.youtube.com/embed/[VIDEO_ID]?autoplay=1"
  allow="autoplay"
></iframe>
```

---

## Adaptive Bitrate Streaming (ABR)

### How ABR Works

```
Client starts playback
     ↓
Measures available bandwidth
     ↓
┌─────────────────────────────────┐
│ Connection Speed: 5 Mbps        │
│ → Selects 320 kbps stream       │
└─────────────────────────────────┘
     ↓
Connection degrades (mobile tower switch)
     ↓
┌─────────────────────────────────┐
│ Connection Speed: 500 Kbps      │
│ → Switches to 96 kbps stream    │
└─────────────────────────────────┘
     ↓
WiFi reconnects
     ↓
┌─────────────────────────────────┐
│ Connection Speed: 50 Mbps       │
│ → Switches back to 320 kbps     │
└─────────────────────────────────┘
```

### ABR Implementation (React Native Track Player)

```typescript
import TrackPlayer, {
  Capability,
  RatingType,
  State,
} from "react-native-track-player";

// Setup player with ABR support
await TrackPlayer.setupPlayer({
  maxCacheSize: 50000, // 50MB cache
  waitForBuffer: true,
});

// Add HLS stream (automatic ABR)
await TrackPlayer.add({
  id: "radio-station-1",
  url: "https://stream.radio.com/live/index.m3u8", // HLS
  title: "Radio Paradise",
  artist: "Live Stream",
  duration: 0, // Live = no duration
  artwork: "https://example.com/artwork.jpg",

  // Optional: Force specific quality
  // url: 'https://stream.radio.com/live/320k.m3u8',
});

// Monitor quality changes
TrackPlayer.addEventListener("playback-quality-change", (event) => {
  console.log("Quality changed to:", event.bitrate);
});
```

### Custom ABR Logic

```typescript
interface QualityVariant {
  bitrate: number;
  url: string;
  label: string;
}

const variants: QualityVariant[] = [
  { bitrate: 320, url: "stream_320k.m3u8", label: "High" },
  { bitrate: 192, url: "stream_192k.m3u8", label: "Medium" },
  { bitrate: 96, url: "stream_96k.m3u8", label: "Low" },
];

async function selectOptimalQuality(
  connectionSpeed: number // Kbps
): Promise<QualityVariant> {
  // Buffer: Select bitrate at 80% of available bandwidth
  const targetBitrate = connectionSpeed * 0.8;

  // Find best matching variant
  const sorted = variants.sort((a, b) => b.bitrate - a.bitrate);
  return (
    sorted.find((v) => v.bitrate <= targetBitrate) || sorted[sorted.length - 1]
  );
}

// Usage
const speed = await getNetworkSpeed(); // Implement network test
const quality = await selectOptimalQuality(speed);
await TrackPlayer.load({ url: quality.url });
```

---

## Authentication & Security

### Token-Based Authentication

#### JWT Tokens for Stream Access

```typescript
// Backend generates stream token
import jwt from 'jsonwebtoken';

const generateStreamToken = (userId: string, stationId: string) => {
  return jwt.sign(
    {
      userId,
      stationId,
      tier: 'premium', // 'free', 'plus', 'pro'
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

// Frontend requests stream URL
GET /api/radio/stream/:stationId
Authorization: Bearer [user_jwt]

// Backend response
{
  "streamUrl": "https://cdn.ampli.com/hls/station_123/index.m3u8?tkn=abc123",
  "expiresAt": 1697845200,
  "quality": "320kbps"
}
```

#### Signed URLs (AWS CloudFront Pattern)

```typescript
// Generate signed URL with expiration
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const signedUrl = getSignedUrl({
  url: "https://cdn.ampli.com/stream/radio.m3u8",
  keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
  privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
  dateLessThan: new Date(Date.now() + 3600000).toISOString(), // 1 hour
});

// URL now includes signature:
// https://cdn.ampli.com/stream/radio.m3u8?Expires=...&Signature=...&Key-Pair-Id=...
```

### DRM (Digital Rights Management)

#### When You Need DRM

- ❌ **Free Radio Streams**: Not needed
- ⚠️ **Curated DJ Content**: Maybe (if licensing requires)
- ✅ **Licensed Music Library**: Required

#### DRM Solutions

| Platform    | DRM System | Use Case            |
| ----------- | ---------- | ------------------- |
| **iOS**     | FairPlay   | Apple devices       |
| **Android** | Widevine   | Android devices     |
| **Web**     | Widevine   | Chrome, Firefox     |
| **All**     | PlayReady  | Microsoft ecosystem |

#### FairPlay Example (React Native)

```typescript
// iOS FairPlay streaming
await TrackPlayer.add({
  url: "https://stream.ampli.com/protected/index.m3u8",
  title: "Protected Content",

  // FairPlay certificate
  fairPlayCertificateUrl: "https://api.ampli.com/drm/fairplay-cert",
  fairPlayContentId: "skd://content_id_123",

  // License server
  fairPlayLicenseUrl: "https://api.ampli.com/drm/license",
});
```

### Rate Limiting & Abuse Prevention

```typescript
// Redis-based rate limiting for stream access
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

const streamRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    // Different limits per tier
    const tier = req.user?.subscription?.tier || "free";
    return tier === "pro" ? 1000 : tier === "plus" ? 500 : 100;
  },
  message: "Too many stream requests, please upgrade to Premium",
});

// Apply to stream endpoints
app.get("/api/radio/stream/:id", streamRateLimiter, getStream);
```

---

## Implementation Patterns

### Pattern 1: Direct Stream URLs (Simple)

**Use Case**: Free radio stations from Radio Browser

```typescript
// Backend
export const getRadioStations: RequestHandler = async (req, res) => {
  const stations = await RadioBrowserAPI.getStations();

  res.json({
    stations: stations.map((s) => ({
      id: s.stationuuid,
      name: s.name,
      streamUrl: s.url_resolved, // Direct URL
      country: s.country,
      genre: s.tags,
      bitrate: s.bitrate,
      codec: s.codec,
    })),
  });
};

// Frontend (React Native)
const playStation = async (station: RadioStation) => {
  await TrackPlayer.add({
    id: station.id,
    url: station.streamUrl, // Use directly
    title: station.name,
    artist: station.country,
  });
  await TrackPlayer.play();
};
```

**Pros:**

- ✅ Simple, no backend processing
- ✅ Low server load

**Cons:**

- ❌ No access control
- ❌ Can't track usage analytics
- ❌ Exposes third-party URLs

---

### Pattern 2: Proxy Streaming (Controlled)

**Use Case**: Premium content (The Lot Radio, Boiler Room)

```typescript
// Backend acts as proxy
export const streamRadio: RequestHandler = async (req, res) => {
  const { stationId } = req.params;
  const user = req.user; // From auth middleware

  // Check subscription tier
  if (station.tier === "premium" && !user.isPremium) {
    return res.status(403).json({
      error: "Upgrade to Premium",
    });
  }

  // Get fresh token from external source
  const streamUrl = await fetchFreshStreamUrl(stationId);

  // Option A: Redirect to stream
  res.redirect(streamUrl);

  // Option B: Proxy the stream
  const streamResponse = await fetch(streamUrl);
  streamResponse.body.pipe(res);

  // Track analytics
  await logStreamStart(user.id, stationId);
};

// Frontend
const playStation = async (station: RadioStation) => {
  // Request through your API (requires auth)
  const { streamUrl } = await api.get(`/radio/stream/${station.id}`);

  await TrackPlayer.add({
    id: station.id,
    url: streamUrl,
    title: station.name,
  });
  await TrackPlayer.play();
};
```

**Pros:**

- ✅ Full access control
- ✅ Usage analytics
- ✅ Can hide external URLs

**Cons:**

- ❌ Higher server bandwidth
- ❌ More complex infrastructure

---

### Pattern 3: Token Refresh System

**Use Case**: Long-lived streams with expiring tokens

```typescript
// Backend: Generate stream token
export const getStreamToken: RequestHandler = async (req, res) => {
  const { stationId } = req.params;

  // Generate time-limited token
  const token = jwt.sign(
    { stationId, userId: req.user.id },
    process.env.STREAM_SECRET!,
    { expiresIn: "1h" }
  );

  res.json({
    streamUrl: `https://cdn.ampli.com/hls/${stationId}/index.m3u8?tkn=${token}`,
    expiresAt: Date.now() + 3600000,
  });
};

// Frontend: Auto-refresh token
const useStreamToken = (stationId: string) => {
  const [streamUrl, setStreamUrl] = useState<string>();

  useEffect(() => {
    const fetchToken = async () => {
      const { streamUrl, expiresAt } = await api.get(
        `/radio/token/${stationId}`
      );
      setStreamUrl(streamUrl);

      // Refresh before expiration
      const timeUntilExpiry = expiresAt - Date.now();
      const refreshTime = timeUntilExpiry - 300000; // 5min before expiry

      setTimeout(fetchToken, refreshTime);
    };

    fetchToken();
  }, [stationId]);

  return streamUrl;
};
```

---

## Platform-Specific Considerations

### iOS (React Native Track Player)

#### Background Audio

```typescript
// Enable background playback
await TrackPlayer.updateOptions({
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.Stop,
    Capability.SeekTo,
  ],
  compactCapabilities: [Capability.Play, Capability.Pause],

  // iOS-specific
  progressUpdateEventInterval: 2,
});

// Info.plist configuration required:
/*
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>
*/
```

#### Lock Screen Controls

```typescript
await TrackPlayer.add({
  id: "station-1",
  url: "https://stream.radio.com/live.m3u8",
  title: "Radio Paradise",
  artist: "Live Stream",
  artwork: "https://example.com/logo.jpg", // Shows on lock screen
  duration: 0,
});

// Artwork appears automatically on:
// - Lock screen
// - Control Center
// - CarPlay
```

### Android

#### MediaSession Integration

```typescript
// Automatically handled by react-native-track-player
// Shows in:
// - Notification drawer
// - Lock screen
// - Android Auto
// - Wear OS
```

#### Data Saver Mode

```typescript
import NetInfo from "@react-native-community/netinfo";

const unsubscribe = NetInfo.addEventListener((state) => {
  if (state.details?.isConnectionExpensive) {
    // Switch to lower bitrate
    switchToQuality("low");
  }
});
```

### Web (Audio API)

```typescript
const audio = new Audio();
audio.src = "https://stream.radio.com/live.m3u8";
audio.crossOrigin = "anonymous"; // Required for CORS

// HLS support (Safari native, others need hls.js)
if (audio.canPlayType("application/vnd.apple.mpegurl")) {
  // Native HLS (Safari)
  audio.src = hlsUrl;
} else {
  // Use hls.js for other browsers
  import Hls from "hls.js";
  const hls = new Hls();
  hls.loadSource(hlsUrl);
  hls.attachMedia(audio);
}

audio.play();
```

---

## Performance Optimization

### Caching Strategy

```typescript
// Service Worker (Web)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Cache audio segments
  if (url.pathname.endsWith(".ts") || url.pathname.endsWith(".m3u8")) {
    event.respondWith(
      caches.open("audio-cache").then((cache) =>
        cache.match(event.request).then(
          (response) =>
            response ||
            fetch(event.request).then((fetchResponse) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            })
        )
      )
    );
  }
});
```

### Preloading & Prefetching

```typescript
// Prefetch upcoming stations
const prefetchStations = async (stationIds: string[]) => {
  // Preload artwork
  await Promise.all(
    stationIds.map((id) => Image.prefetch(stations[id].artwork))
  );

  // Preload first segment of stream (HLS only)
  await Promise.all(
    stationIds.map((id) => prefetchHLSPlaylist(stations[id].streamUrl))
  );
};
```

### CDN Configuration

```typescript
// CloudFront distribution for HLS
const cdnConfig = {
  Origins: [
    {
      DomainName: "stream-origin.ampli.com",
      CustomHeaders: [
        {
          HeaderName: "Access-Control-Allow-Origin",
          HeaderValue: "*", // Or specific domain
        },
      ],
    },
  ],

  CacheBehaviors: [
    {
      PathPattern: "*.m3u8",
      MinTTL: 0,
      MaxTTL: 5, // Playlists change frequently
      DefaultTTL: 2,
    },
    {
      PathPattern: "*.ts",
      MinTTL: 3600,
      MaxTTL: 86400, // Segments are immutable
      DefaultTTL: 86400,
    },
  ],
};
```

---

## Legal & Licensing

### Radio Streaming Rights

#### Broadcasting vs Streaming

| Type               | License Required        | Who Pays      | Cost       |
| ------------------ | ----------------------- | ------------- | ---------- |
| **FM/AM Radio**    | Yes (BMI, ASCAP, SESAC) | Radio station | High       |
| **Internet Radio** | Yes (SoundExchange)     | Radio station | Per-stream |
| **Podcasts**       | No (fair use)           | N/A           | Free       |
| **DJ Mixes**       | Complex (depends)       | Varies        | Varies     |

#### Embedding Third-Party Streams

**The Lot Radio, Boiler Room, etc.**

```
✅ ALLOWED (Usually):
- Embedding official player (with attribution)
- Linking to their website
- Personal/non-commercial use

❌ NOT ALLOWED (Usually):
- Rehosting their streams
- Removing branding
- Commercial use without permission
- Claiming as your own content

⚠️ GRAY AREA:
- Proxying their streams
- Extracting stream URLs
- Building apps around their content
```

**Recommendation**: Always contact for official API or partnership

#### User-Generated Content

```typescript
// If users upload DJ mixes
interface UploadPolicy {
  // Require users to confirm rights
  requiresRightsConfirmation: true;

  // DMCA takedown process
  dmcaContactEmail: "dmca@ampli.com";

  // Content ID (YouTube-style)
  enableContentMatching: true; // Match against known copyrighted works
}
```

---

## Streaming Decision Matrix

### Choose Your Streaming Strategy

```
┌─────────────────────────────────────────────────────────────┐
│ CONTENT TYPE              │ RECOMMENDED APPROACH            │
├─────────────────────────────────────────────────────────────┤
│ Free Radio Stations       │ Radio Browser API → Direct URLs │
│ Premium Curated Streams   │ Proxy + Auth + Token Refresh    │
│ User Uploads (Podcasts)   │ Cloudinary → Progressive DL     │
│ Live DJ Sets              │ HLS + ABR                       │
│ Ultra-Low Latency         │ WebRTC                          │
│ Music Library (Licensed)  │ HLS + DRM + CDN                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Next Steps for Ampli

### Phase 1: Free Radio (Week 1-2)

- [ ] Integrate Radio Browser API
- [ ] Implement HLS playback (React Native Track Player)
- [ ] Add favorites/history
- [ ] Search & filter by country/genre

### Phase 2: Premium Streams (Week 3-4)

- [ ] Contact The Lot Radio / Boiler Room for API
- [ ] Implement subscription tiers
- [ ] Add payment integration (Stripe)
- [ ] Token-based stream access

### Phase 3: Advanced Features (Week 5+)

- [ ] Adaptive bitrate streaming
- [ ] Offline caching
- [ ] Chromecast/AirPlay support
- [ ] Analytics & recommendations

---

## References & Resources

### Official Documentation

- [HLS Specification (RFC 8216)](https://datatracker.ietf.org/doc/html/rfc8216)
- [DASH Industry Forum](https://dashif.org/)
- [React Native Track Player](https://react-native-track-player.js.org/)
- [hls.js (Web HLS)](https://github.com/video-dev/hls.js)

### APIs

- [Radio Browser API](https://www.radio-browser.info/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)

### Tools

- [FFmpeg](https://ffmpeg.org/) - Transcoding streams
- [VLC Media Player](https://www.videolan.org/) - Testing stream URLs
- [Postman](https://www.postman.com/) - API testing

### Learning Resources

- [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Apple HLS Authoring Spec](https://developer.apple.com/documentation/http_live_streaming)

---

**Document Version**: 1.0.0
**Maintained By**: Ampli Development Team
**Last Review**: 2025-10-20

For questions or contributions, see [CONTRIBUTING.md](../CONTRIBUTING.md)
