# Audio Libraries - Technical Comparison

## Overview

This document provides in-depth analysis of audio libraries for web and React Native, with focus on delivering Spotify/Tidal/SoundCloud quality streaming experience.

## Mobile Audio Libraries

### React Native Track Player (RECOMMENDED)

**Version**: 4.1.2 (Latest: August 2025)
**License**: Apache 2.0
**GitHub**: https://github.com/doublesymmetry/react-native-track-player
**Docs**: https://rntp.dev/

#### Why This is the Best Choice

React Native Track Player is specifically designed for music streaming apps and is production-ready for professional audio applications.

#### Key Features

✅ **Background Playback**
- Continues playing when app is in background
- Survives app crashes/restarts
- Battery optimized

✅ **System Integration**
- Lock screen controls (iOS & Android)
- CarPlay support (iOS)
- Android Auto support
- Media notification controls
- Headphone/Bluetooth controls

✅ **Playlist Management**
- Queue manipulation
- Repeat modes (off, track, queue)
- Shuffle mode
- Add/remove tracks dynamically

✅ **Playback Controls**
- Play/Pause/Stop
- Seek to position
- Skip to next/previous
- Change playback rate (0.5x - 2x)
- Volume control

✅ **Progress Tracking**
- Real-time position updates
- Duration reporting
- Buffering status
- State changes (playing, paused, buffering, etc.)

✅ **Audio Formats**
- MP3, AAC, FLAC, WAV, OGG
- HLS streaming (m3u8)
- DASH support
- Local files and remote URLs

✅ **Caching**
- Automatic caching of remote tracks
- Configurable cache size
- Pre-loading next track

#### Production Use Cases

Used by major apps:
- Music streaming platforms
- Podcast apps
- Audiobook players
- Radio streaming apps

#### Code Example

```typescript
import TrackPlayer, {
  Capability,
  Event,
  State
} from 'react-native-track-player';

// Setup
await TrackPlayer.setupPlayer({
  maxCacheSize: 1024 * 10, // 10 MB
  waitForBuffer: true,
});

// Configure capabilities
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
  notificationCapabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
  ],
});

// Add tracks
await TrackPlayer.add([
  {
    id: '1',
    url: 'https://example.com/track1.mp3',
    title: 'Song Title',
    artist: 'Artist Name',
    artwork: 'https://example.com/artwork.jpg',
    duration: 180,
  },
]);

// Control playback
await TrackPlayer.play();
await TrackPlayer.pause();
await TrackPlayer.seekTo(30); // Seek to 30 seconds

// Listen to events
TrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
  if (state === State.Playing) {
    console.log('Playing');
  }
});

TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, ({ position, duration }) => {
  console.log(`Position: ${position}/${duration}`);
});
```

#### Integration with State Management

```typescript
// Using Zustand
import { create } from 'zustand';
import TrackPlayer, { State, Event } from 'react-native-track-player';

interface PlayerStore {
  isPlaying: boolean;
  currentTrack: Track | null;
  position: number;
  duration: number;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  currentTrack: null,
  position: 0,
  duration: 0,

  play: async () => {
    await TrackPlayer.play();
    set({ isPlaying: true });
  },

  pause: async () => {
    await TrackPlayer.pause();
    set({ isPlaying: false });
  },

  seekTo: async (position) => {
    await TrackPlayer.seekTo(position);
    set({ position });
  },
}));

// Setup event listeners
TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, ({ position, duration }) => {
  usePlayerStore.setState({ position, duration });
});
```

#### Performance Characteristics

- **Memory**: Efficient caching, configurable cache size
- **Battery**: Optimized for background playback
- **Startup**: Fast initialization (<100ms)
- **Seeking**: Instant for cached, fast for streamed
- **Buffer**: Automatic buffering with progress events

#### Limitations

- Requires native modules (can't use Expo Go, need custom dev client)
- Platform-specific quirks (iOS vs Android behavior differences)
- Need to handle service lifecycle manually

---

### React Native Audio API (Alternative)

**Version**: 1.x (Released: January 2025)
**License**: MIT
**Provider**: Software Mansion
**Docs**: https://docs.swmansion.com/react-native-audio-api/

#### When to Use

Use React Native Audio API when you need:
- Low-level audio processing
- Real-time audio effects
- Audio synthesis
- Audio visualization
- Custom DSP (Digital Signal Processing)

#### NOT Recommended For

❌ Simple music playback (use Track Player instead)
❌ Podcast apps (use Track Player instead)
❌ Standard streaming apps (use Track Player instead)

#### Key Differences from Track Player

| Feature | Track Player | Audio API |
|---------|-------------|-----------|
| Purpose | Music/podcast playback | Audio processing/synthesis |
| Background playback | ✅ Built-in | ❌ Manual setup |
| Lock screen controls | ✅ Automatic | ❌ Manual setup |
| API style | High-level | Low-level |
| Learning curve | Easy | Steep |
| Use case | Streaming apps | Audio manipulation |

#### Code Example

```typescript
import { AudioContext, OscillatorNode } from 'react-native-audio-api';

// Create audio context
const audioContext = new AudioContext();

// Create oscillator (tone generator)
const oscillator = new OscillatorNode(audioContext, {
  type: 'sine',
  frequency: 440, // A4 note
});

// Connect to output
oscillator.connect(audioContext.destination);

// Start/stop
oscillator.start();
oscillator.stop();
```

#### When This Makes Sense

- DJ apps with live mixing
- Music production apps
- Audio effects processors
- Educational music apps (learning piano, etc.)
- Games with procedural audio

---

## Web Audio Libraries

### Howler.js (RECOMMENDED)

**Version**: 2.2.4
**License**: MIT
**GitHub**: https://github.com/goldfire/howler.js
**Docs**: https://howlerjs.com/
**Weekly Downloads**: 145,000+

#### Why This is the Best Choice

Howler.js is the industry standard for web audio playback, used by production apps requiring Spotify-level quality.

#### Key Features

✅ **High-Quality Audio Support**
- FLAC (lossless, 24-bit/44.1kHz)
- WAV (uncompressed)
- AAC (256/320 kbps)
- MP3, OPUS, OGG, M4A, WEBM
- Automatic codec fallback

✅ **Browser Compatibility**
- Web Audio API (modern browsers)
- HTML5 Audio fallback (older browsers)
- IE9+ support
- Mobile Safari support
- Chrome, Firefox, Edge

✅ **Streaming Optimized**
- Progressive download
- HTML5 streaming mode for large files
- Preloading strategies
- Bandwidth-aware codec selection

✅ **Advanced Playback**
- Audio sprites (single file, multiple sounds)
- 3D spatial audio
- Stereo panning
- Fade in/out
- Looping
- Playback rate control

✅ **Lightweight**
- 7KB gzipped
- No dependencies
- Tree-shakeable

#### Code Example

```javascript
import { Howl, Howler } from 'howler';

// Create sound with multiple formats (auto-fallback)
const sound = new Howl({
  src: [
    'https://example.com/song.flac',  // Lossless (preferred)
    'https://example.com/song.mp3',   // Fallback 1
    'https://example.com/song.ogg',   // Fallback 2
  ],
  html5: true,           // Enable streaming for large files
  preload: true,         // Start loading immediately
  volume: 1.0,
  format: ['flac', 'mp3', 'ogg'],

  onload: function() {
    console.log('Ready to play');
  },

  onplay: function() {
    console.log('Started playing');
  },

  onend: function() {
    console.log('Finished playing');
  },

  onloaderror: function(id, error) {
    console.error('Load error:', error);
  },

  onplayerror: function(id, error) {
    console.error('Play error:', error);
  },
});

// Playback controls
sound.play();
sound.pause();
sound.stop();
sound.seek(30); // Seek to 30 seconds
sound.volume(0.5); // Set volume to 50%
sound.rate(1.5); // Playback at 1.5x speed

// Fade effects
sound.fade(1.0, 0.0, 2000); // Fade out over 2 seconds

// Get current state
const isPlaying = sound.playing();
const currentPosition = sound.seek();
const duration = sound.duration();

// Unload when done
sound.unload();
```

#### Advanced: Audio Sprites

```javascript
// One file, multiple sound effects
const sfx = new Howl({
  src: ['sounds.mp3'],
  sprite: {
    click: [0, 500],        // 0ms to 500ms
    notification: [500, 1000], // 500ms to 1500ms
    success: [1500, 2000],    // 1500ms to 3500ms
  }
});

// Play specific sprite
sfx.play('click');
sfx.play('notification');
```

#### Advanced: Playlist Implementation

```javascript
class AudioPlayer {
  constructor() {
    this.playlist = [];
    this.currentIndex = 0;
    this.sound = null;
  }

  loadPlaylist(tracks) {
    this.playlist = tracks;
    this.loadTrack(0);
  }

  loadTrack(index) {
    // Unload previous
    if (this.sound) {
      this.sound.unload();
    }

    const track = this.playlist[index];

    this.sound = new Howl({
      src: [track.url],
      html5: true,
      format: ['mp3', 'aac'],
      onend: () => this.next(),
    });

    this.currentIndex = index;
  }

  play() {
    this.sound?.play();
  }

  pause() {
    this.sound?.pause();
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.playlist.length;
    this.loadTrack(nextIndex);
    this.play();
  }

  previous() {
    const prevIndex = this.currentIndex === 0
      ? this.playlist.length - 1
      : this.currentIndex - 1;
    this.loadTrack(prevIndex);
    this.play();
  }

  seekTo(position) {
    this.sound?.seek(position);
  }
}

// Usage
const player = new AudioPlayer();
player.loadPlaylist([
  { url: 'https://example.com/song1.mp3', title: 'Song 1' },
  { url: 'https://example.com/song2.mp3', title: 'Song 2' },
]);
player.play();
```

#### Integration with React

```typescript
import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

function useAudioPlayer(url: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [url],
      html5: true,
      onload: () => {
        setDuration(soundRef.current?.duration() ?? 0);
      },
      onplay: () => {
        setIsPlaying(true);
        // Update position every 100ms
        intervalRef.current = setInterval(() => {
          setPosition(soundRef.current?.seek() ?? 0);
        }, 100);
      },
      onpause: () => {
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      },
      onend: () => {
        setIsPlaying(false);
        setPosition(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      },
    });

    return () => {
      soundRef.current?.unload();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [url]);

  const play = () => soundRef.current?.play();
  const pause = () => soundRef.current?.pause();
  const seekTo = (pos: number) => soundRef.current?.seek(pos);

  return {
    isPlaying,
    position,
    duration,
    play,
    pause,
    seekTo,
  };
}

// Component usage
function AudioPlayerComponent({ track }: { track: Track }) {
  const { isPlaying, position, duration, play, pause, seekTo } =
    useAudioPlayer(track.url);

  const progressPercent = (position / duration) * 100;

  return (
    <div>
      <h2>{track.title}</h2>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p>{formatTime(position)} / {formatTime(duration)}</p>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
```

#### Performance Characteristics

- **Load time**: Fast (<100ms for metadata)
- **Memory**: Efficient, automatic garbage collection
- **Streaming**: Progressive, doesn't load entire file
- **CPU**: Low usage, optimized Web Audio API
- **Mobile**: Works well on iOS/Android browsers

#### Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ 100% | Web Audio API |
| Firefox | ✅ 100% | Web Audio API |
| Safari | ✅ 100% | Web Audio API |
| Edge | ✅ 100% | Web Audio API |
| Mobile Safari | ✅ 100% | Requires user interaction |
| Mobile Chrome | ✅ 100% | Full support |
| IE 11 | ⚠️ Partial | HTML5 Audio fallback |
| IE 9-10 | ⚠️ Partial | Limited features |

---

### Tone.js (Alternative - Not Recommended for Streaming)

**Version**: 14.7.77
**License**: MIT
**GitHub**: https://github.com/Tonejs/Tone.js
**Docs**: https://tonejs.github.io/

#### When to Use

Tone.js is designed for:
- Music creation/composition apps
- Interactive music experiences
- Audio synthesis
- MIDI applications
- DAW (Digital Audio Workstation) features

#### NOT Recommended For

❌ Simple audio playback
❌ Music streaming (use Howler.js)
❌ Podcast players (use Howler.js)

#### Key Differences from Howler.js

| Feature | Howler.js | Tone.js |
|---------|-----------|---------|
| Purpose | Playback | Synthesis/Sequencing |
| File size | 7KB | 200KB+ |
| Learning curve | Easy | Steep |
| Use case | Streaming | Music creation |
| Playback | ✅ Optimized | ⚠️ Basic |
| Synthesis | ❌ None | ✅ Advanced |
| Effects | ⚠️ Basic | ✅ Extensive |
| Scheduling | ❌ Simple | ✅ Sample-accurate |

#### Code Example

```javascript
import * as Tone from 'tone';

// Create synthesizer
const synth = new Tone.Synth().toDestination();

// Play notes
synth.triggerAttackRelease('C4', '8n');

// Create sequence
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '8n', time);
}, ['C4', 'E4', 'G4', 'B4']);

// Start transport
Tone.Transport.start();
seq.start(0);
```

#### When This Makes Sense

- Browser-based DAW (like Ableton Live)
- Music learning apps with synthesis
- Interactive music installations
- Generative music apps
- Loop-based music creation

---

## Audio Quality Comparison

### Codec Quality Levels

| Codec | Bitrate | Quality | Use Case | File Size (3min song) |
|-------|---------|---------|----------|----------------------|
| FLAC | Lossless | ⭐⭐⭐⭐⭐ | Audiophiles | ~25-30 MB |
| WAV | Lossless | ⭐⭐⭐⭐⭐ | Studio | ~30 MB |
| AAC 320kbps | Lossy | ⭐⭐⭐⭐ | Premium | ~7-8 MB |
| AAC 256kbps | Lossy | ⭐⭐⭐⭐ | Standard | ~6 MB |
| MP3 320kbps | Lossy | ⭐⭐⭐⭐ | High quality | ~7-8 MB |
| MP3 256kbps | Lossy | ⭐⭐⭐ | Good quality | ~6 MB |
| AAC 128kbps | Lossy | ⭐⭐⭐ | Free tier | ~3 MB |
| MP3 128kbps | Lossy | ⭐⭐ | Low quality | ~3 MB |

### Streaming Service Comparisons (2025)

| Service | Free Tier | Premium | HiFi/Lossless |
|---------|-----------|---------|---------------|
| Spotify | 160 kbps AAC | 256 kbps AAC | FLAC (Music Pro, $16.99) |
| Apple Music | - | 256 kbps AAC | 24-bit/192kHz ALAC |
| Tidal | - | 320 kbps AAC | 24-bit/192kHz FLAC |
| YouTube Music | 128 kbps AAC | 256 kbps AAC | - |
| Amazon Music | - | 256 kbps AAC | 24-bit/192kHz FLAC |

### Recommended Quality Tiers for Ampli

**Free Tier:**
- Web: 128 kbps AAC
- Mobile: 160 kbps AAC

**Premium Tier:**
- Web: 256 kbps AAC
- Mobile: 256 kbps AAC

**HiFi Tier (Future):**
- Web: FLAC (if browser supports)
- Mobile: FLAC
- Fallback: 320 kbps AAC

---

## Performance Benchmarks

### Mobile (React Native Track Player)

| Metric | Value |
|--------|-------|
| Init time | <100ms |
| Seek latency | <50ms (cached), <200ms (streamed) |
| Buffer time | 1-3s (depends on connection) |
| Memory usage | 20-50 MB (varies with cache) |
| Battery impact | Low (optimized for background) |

### Web (Howler.js)

| Metric | Value |
|--------|-------|
| Init time | <50ms |
| Seek latency | Instant (cached), <100ms (streamed) |
| Buffer time | 1-2s (depends on connection) |
| Memory usage | 10-30 MB |
| CPU usage | <5% (idle), <15% (playing) |

---

## Recommendations Summary

### For Ampli Project

#### Mobile App
✅ **Use: React Native Track Player**
- Perfect for music/podcast streaming
- Production-ready
- All features needed out of the box
- Great community support

❌ **Don't use: React Native Audio API**
- Overkill for streaming
- More complex setup
- Designed for different use case

#### Web App
✅ **Use: Howler.js**
- Industry standard
- Perfect for streaming
- Lightweight and fast
- Excellent codec support including FLAC

❌ **Don't use: Tone.js**
- Not designed for playback
- Heavy bundle size
- Complex API for simple playback

---

## Implementation Checklist

### Mobile (Track Player)

- [ ] Install `react-native-track-player`
- [ ] Setup playback service
- [ ] Configure capabilities and notifications
- [ ] Implement queue management
- [ ] Add lock screen controls
- [ ] Handle background playback
- [ ] Implement caching strategy
- [ ] Add error handling
- [ ] Test on both iOS and Android

### Web (Howler.js)

- [ ] Install `howler`
- [ ] Create audio player hook
- [ ] Implement playback controls
- [ ] Add progress tracking
- [ ] Implement playlist queue
- [ ] Add preloading for next track
- [ ] Handle errors gracefully
- [ ] Test across browsers
- [ ] Optimize for mobile web

---

## Additional Resources

### Documentation
- [React Native Track Player Docs](https://rntp.dev/)
- [Howler.js Documentation](https://howlerjs.com/)
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### Tutorials
- [Building a Music Player with Track Player](https://addjam.com/blog/2025-04-04/playing-audio-in-react-native/)
- [Howler.js Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)

### Community
- [Track Player Discord](https://discord.gg/ya2XDCR)
- [Howler.js GitHub Issues](https://github.com/goldfire/howler.js/issues)
