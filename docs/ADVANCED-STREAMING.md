# Advanced Audio Streaming - HLS, MSE & Adaptive Bitrate

## Overview

Este documento explica las tecnologías de streaming profesional usadas por plataformas como Spotify, SoundCloud y Tidal. Aprenderás cómo funcionan HLS (HTTP Live Streaming), MSE (Media Source Extensions) y streaming adaptativo de bitrate.

---

## Table of Contents

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [HLS (HTTP Live Streaming)](#hls-http-live-streaming)
3. [MSE (Media Source Extensions)](#mse-media-source-extensions)
4. [DASH vs HLS](#dash-vs-hls)
5. [Arquitectura de Spotify](#arquitectura-de-spotify)
6. [Implementación Práctica](#implementación-práctica)
7. [Comparación de Tecnologías](#comparación-de-tecnologías)

---

## Conceptos Fundamentales

### ¿Qué es Streaming Adaptativo?

**Adaptive Bitrate Streaming (ABR)** detecta el ancho de banda y capacidad de CPU del usuario en tiempo real, ajustando la calidad del stream automáticamente.

#### ¿Por qué es importante?

- **Sin buffering**: Cambia a menor calidad si la conexión es lenta
- **Mejor calidad**: Sube a mayor calidad cuando hay buen ancho de banda
- **Experiencia fluida**: Usuario no nota los cambios
- **Ahorro de datos**: No envía calidad 4K a quien tiene conexión 3G

#### Cómo funciona:

```
Usuario con WiFi rápido → Recibe 320 kbps AAC
Red se pone lenta      → Cambia a 128 kbps AAC (automático)
WiFi mejora            → Sube a 256 kbps AAC
```

### Streaming Tradicional vs Adaptativo

**Streaming Tradicional (Progressive Download):**

```
[Archivo completo.mp3] → Download → Reproduce
```

- Descarga un solo archivo
- Una sola calidad
- Si la red es lenta: buffering infinito
- Desperdicia ancho de banda

**Streaming Adaptativo (HLS/DASH):**

```
[Segmento1-320k] → [Segmento2-128k] → [Segmento3-256k]
     ↓                  ↓                   ↓
  Red rápida      Red lenta          Red media
```

- Múltiples calidades disponibles
- Cambia entre segmentos
- Se adapta en tiempo real
- Optimiza ancho de banda

---

## HLS (HTTP Live Streaming)

### ¿Qué es HLS?

**HTTP Live Streaming** es un protocolo de streaming adaptativo desarrollado por Apple en 2009. Es el estándar de facto para streaming de audio/video en la web.

### Características Principales

✅ **Adaptive Bitrate**: Cambia calidad automáticamente
✅ **Segmentación**: Divide audio en chunks de 2-10 segundos
✅ **Multi-calidad**: Ofrece múltiples versiones del mismo audio
✅ **HTTP-based**: Funciona con CDNs estándar
✅ **Apple nativo**: Soporte nativo en iOS/Safari
✅ **Amplio soporte**: Funciona en casi todos los dispositivos

### Arquitectura HLS

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR DE ORIGEN                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Audio Original (song.wav)                                  │
│         ↓                                                   │
│  ┌──────────────────┐                                       │
│  │   ENCODER        │                                       │
│  │  (FFmpeg/etc)    │                                       │
│  └──────────────────┘                                       │
│         ↓                                                   │
│  ┌─────────────────────────────────────────────┐            │
│  │  Múltiples calidades:                       │            │
│  │  • 320 kbps AAC (high)                      │            │
│  │  • 256 kbps AAC (medium)                    │            │
│  │  • 128 kbps AAC (low)                       │            │
│  │  • 64 kbps AAC (very low)                   │            │
│  └─────────────────────────────────────────────┘            │
│         ↓                                                   │
│  ┌──────────────────┐                                       │
│  │  SEGMENTADOR     │                                       │
│  │ (Corta en chunks)│                                       │
│  └──────────────────┘                                       │
│         ↓                                                   │
│  ┌─────────────────────────────────────────────┐            │
│  │  Segmentos (.ts files):                     │            │
│  │                                             │            │
│  │  320kbps/                                   │            │
│  │    ├── segment0.ts (0-10s)                  │            │
│  │    ├── segment1.ts (10-20s)                 │            │
│  │    └── segment2.ts (20-30s)                 │            │
│  │                                             │            │
│  │  256kbps/                                   │            │
│  │    ├── segment0.ts                          │            │
│  │    ├── segment1.ts                          │            │
│  │    └── segment2.ts                          │            │
│  │                                             │            │
│  │  128kbps/                                   │            │
│  │    ├── segment0.ts                          │            │
│  │    ├── segment1.ts                          │            │
│  │    └── segment2.ts                          │            │
│  └─────────────────────────────────────────────┘            │
│         ↓                                                   │
│  ┌──────────────────────────────────────────────┐           │
│  │  PLAYLISTS (m3u8)                            │           │
│  │                                              │           │
│  │  master.m3u8 (apunta a todas las calidades)  │           │
│  │  320k.m3u8 (lista de segmentos alta calidad) │           │
│  │  256k.m3u8                                   │           │
│  │  128k.m3u8                                   │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                       ↓
              ┌────────────────┐
              │      CDN       │
              │  (Cloudflare,  │
              │  CloudFront)   │
              └────────────────┘
                       ↓
         ┌─────────────────────────┐
         │  CLIENTE (Browser/App)  │
         │                         │
         │  1. Pide master.m3u8    │
         │  2. Analiza calidades   │
         │  3. Elige mejor calidad │
         │  4. Descarga segments   │
         │  5. Monitorea red       │
         │  6. Cambia calidad si   │
         │     es necesario        │
         └─────────────────────────┘
```

### Estructura de Archivos HLS

#### Master Playlist (master.m3u8)

```m3u8
#EXTM3U
#EXT-X-VERSION:3

# Alta calidad - 320 kbps AAC
#EXT-X-STREAM-INF:BANDWIDTH=320000,CODECS="mp4a.40.2"
320k/playlist.m3u8

# Calidad media - 256 kbps AAC
#EXT-X-STREAM-INF:BANDWIDTH=256000,CODECS="mp4a.40.2"
256k/playlist.m3u8

# Calidad baja - 128 kbps AAC
#EXT-X-STREAM-INF:BANDWIDTH=128000,CODECS="mp4a.40.2"
128k/playlist.m3u8

# Calidad muy baja - 64 kbps AAC
#EXT-X-STREAM-INF:BANDWIDTH=64000,CODECS="mp4a.40.2"
64k/playlist.m3u8
```

#### Media Playlist (320k/playlist.m3u8)

```m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0

# Cada segmento es ~10 segundos
#EXTINF:10.0,
segment0.ts
#EXTINF:10.0,
segment1.ts
#EXTINF:10.0,
segment2.ts
#EXTINF:10.0,
segment3.ts
#EXTINF:8.5,
segment4.ts
#EXT-X-ENDLIST
```

### Codecs Soportados

**Audio:**

- AAC (más común, mejor compresión)
- MP3 (compatible, menos eficiente)
- AC-3 / EAC-3 (Dolby Audio)
- Opus (moderno, excelente calidad)

**Container:**

- MPEG-2 Transport Stream (.ts)
- Fragmented MP4 (.m4s) - HLS moderno

### Ventajas de HLS

✅ **Apple Native**: iOS/macOS lo soportan nativamente (no necesita JS)
✅ **CDN Friendly**: Usa HTTP estándar, funciona con cualquier CDN
✅ **Seguridad**: Soporta encriptación AES-128
✅ **Maduro**: 15+ años en producción
✅ **Amplio soporte**: Casi todos los dispositivos

### Desventajas de HLS

❌ **Latencia**: ~10-30 segundos de delay (mejorado con LL-HLS)
❌ **No universal en Android**: Requiere hls.js en navegadores no-Apple
❌ **Segmentos**: Genera muchos archivos pequeños
❌ **Apple-centric**: Diseñado primero para Apple

---

## MSE (Media Source Extensions)

### ¿Qué es MSE?

**Media Source Extensions** es una API de JavaScript que permite construir streams de audio/video de forma dinámica usando JavaScript.

### ¿Por qué MSE es importante?

Antes de MSE:

```html
<!-- Solo podías hacer esto -->
<audio src="song.mp3"></audio>
```

Con MSE:

```javascript
// Puedes construir el stream desde JavaScript
const mediaSource = new MediaSource();
audio.src = URL.createObjectURL(mediaSource);

// Agregar chunks de audio dinámicamente
sourceBuffer.appendBuffer(audioChunk1);
sourceBuffer.appendBuffer(audioChunk2);
// ... cambiar calidad en tiempo real
sourceBuffer.appendBuffer(audioChunk3LowerQuality);
```

### Características Principales

✅ **Control total**: Decides qué chunks cargar y cuándo
✅ **Adaptive streaming**: Puedes cambiar calidad al vuelo
✅ **Buffering inteligente**: Control sobre cuánto pre-cargar
✅ **Memoria eficiente**: Puedes eliminar chunks viejos
✅ **Base de HLS/DASH**: hls.js y dash.js usan MSE

### Arquitectura MSE

```
┌──────────────────────────────────────────────────────────┐
│                   JAVASCRIPT APP                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐      │
│  │  1. Fetch chunks de audio (AJAX/fetch)         │      │
│  │     https://cdn.com/song/chunk1.ts             │      │
│  │     https://cdn.com/song/chunk2.ts             │      │
│  └────────────────────────────────────────────────┘      │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────┐      │
│  │  2. MediaSource API                            │      │
│  │     const ms = new MediaSource();              │      │
│  │     audio.src = URL.createObjectURL(ms);       │      │
│  └────────────────────────────────────────────────┘      │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────┐      │
│  │  3. SourceBuffer                               │      │
│  │     const sb = ms.addSourceBuffer(             │      │
│  │       'audio/mp4; codecs="mp4a.40.2"'          │      │
│  │     );                                         │      │
│  └────────────────────────────────────────────────┘      │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────┐      │
│  │  4. Append audio chunks                        │      │
│  │     sb.appendBuffer(chunk1);                   │      │
│  │     sb.appendBuffer(chunk2);                   │      │
│  │     // Decide cambiar a calidad baja           │      │
│  │     sb.appendBuffer(chunk3_lowquality);        │      │
│  └────────────────────────────────────────────────┘      │
│                        ↓                                 │
│  ┌────────────────────────────────────────────────┐      │
│  │  5. <audio> element reproduce                  │      │
│  │     <audio controls></audio>                   │      │
│  └────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

### MSE Code Example

```javascript
// 1. Crear MediaSource
const audio = document.querySelector("audio");
const mediaSource = new MediaSource();
audio.src = URL.createObjectURL(mediaSource);

// 2. Esperar a que MediaSource esté listo
mediaSource.addEventListener("sourceopen", async () => {
  // 3. Crear SourceBuffer con codec
  const sourceBuffer = mediaSource.addSourceBuffer(
    'audio/mp4; codecs="mp4a.40.2"'
  );

  // 4. Fetch primer chunk
  const response = await fetch("https://cdn.com/audio/chunk0.m4s");
  const chunk = await response.arrayBuffer();

  // 5. Agregar chunk al buffer
  sourceBuffer.appendBuffer(chunk);

  // 6. Esperar a que termine de agregar
  sourceBuffer.addEventListener("updateend", async () => {
    if (!sourceBuffer.updating && mediaSource.readyState === "open") {
      // Cargar siguiente chunk
      const nextChunk = await fetch("https://cdn.com/audio/chunk1.m4s");
      const data = await nextChunk.arrayBuffer();
      sourceBuffer.appendBuffer(data);
    }
  });
});

// 7. Monitoring de buffer
audio.addEventListener("timeupdate", () => {
  const buffered = audio.buffered;
  if (buffered.length > 0) {
    const bufferedEnd = buffered.end(buffered.length - 1);
    const currentTime = audio.currentTime;
    const bufferRemaining = bufferedEnd - currentTime;

    console.log(`Buffer remaining: ${bufferRemaining}s`);

    // Si queda poco buffer, cargar más
    if (bufferRemaining < 10) {
      // Fetch next chunk...
    }
  }
});
```

### MSE + Adaptive Bitrate

```javascript
class AdaptivePlayer {
  constructor(audioElement) {
    this.audio = audioElement;
    this.mediaSource = new MediaSource();
    this.sourceBuffer = null;
    this.currentQuality = "medium";
    this.qualities = {
      high: { url: "https://cdn.com/320k/", bitrate: 320000 },
      medium: { url: "https://cdn.com/256k/", bitrate: 256000 },
      low: { url: "https://cdn.com/128k/", bitrate: 128000 },
    };
    this.currentChunk = 0;
  }

  async init() {
    this.audio.src = URL.createObjectURL(this.mediaSource);

    this.mediaSource.addEventListener("sourceopen", async () => {
      this.sourceBuffer = this.mediaSource.addSourceBuffer(
        'audio/mp4; codecs="mp4a.40.2"'
      );

      // Cargar primer chunk
      await this.loadNextChunk();

      // Setup auto-load
      this.sourceBuffer.addEventListener("updateend", () => {
        if (!this.sourceBuffer.updating) {
          this.loadNextChunk();
        }
      });
    });

    // Monitor network
    this.monitorNetwork();
  }

  async loadNextChunk() {
    const quality = this.qualities[this.currentQuality];
    const url = `${quality.url}chunk${this.currentChunk}.m4s`;

    try {
      const response = await fetch(url);
      const chunk = await response.arrayBuffer();

      if (!this.sourceBuffer.updating) {
        this.sourceBuffer.appendBuffer(chunk);
        this.currentChunk++;
      }
    } catch (error) {
      console.error("Error loading chunk:", error);
      // Bajar calidad si hay error
      this.downgradeQuality();
    }
  }

  monitorNetwork() {
    // Detectar velocidad de red
    if ("connection" in navigator) {
      const connection = navigator.connection;

      connection.addEventListener("change", () => {
        const effectiveType = connection.effectiveType;

        if (effectiveType === "4g") {
          this.currentQuality = "high";
        } else if (effectiveType === "3g") {
          this.currentQuality = "medium";
        } else {
          this.currentQuality = "low";
        }

        console.log(`Quality changed to: ${this.currentQuality}`);
      });
    }

    // Monitor buffering
    this.audio.addEventListener("waiting", () => {
      // Buffering detected, bajar calidad
      this.downgradeQuality();
    });
  }

  downgradeQuality() {
    if (this.currentQuality === "high") {
      this.currentQuality = "medium";
    } else if (this.currentQuality === "medium") {
      this.currentQuality = "low";
    }
    console.log(`Downgraded to: ${this.currentQuality}`);
  }

  upgradeQuality() {
    if (this.currentQuality === "low") {
      this.currentQuality = "medium";
    } else if (this.currentQuality === "medium") {
      this.currentQuality = "high";
    }
    console.log(`Upgraded to: ${this.currentQuality}`);
  }
}

// Usage
const audio = document.querySelector("audio");
const player = new AdaptivePlayer(audio);
player.init();
```

### Browser Support MSE

| Browser        | Support    | Notes              |
| -------------- | ---------- | ------------------ |
| Chrome         | ✅ Full    | Desde Chrome 23+   |
| Firefox        | ✅ Full    | Desde Firefox 42+  |
| Safari         | ✅ Full    | Desde Safari 8+    |
| Edge           | ✅ Full    | Chromium-based     |
| iOS Safari     | ⚠️ Partial | iPad sí, iPhone no |
| Android Chrome | ✅ Full    | Android 4.4+       |

**Importante**: iOS iPhones NO soportan MSE, pero sí HLS nativo.

---

## HLS + MSE: hls.js

### ¿Qué es hls.js?

**hls.js** es una librería JavaScript que usa MSE para reproducir HLS en navegadores que no tienen soporte nativo (todos excepto Safari).

### Ventajas de hls.js

✅ **HLS en cualquier browser**: Chrome, Firefox, Edge
✅ **Adaptive bitrate automático**: Cambia calidad solo
✅ **Fácil de usar**: API simple
✅ **Production-ready**: Usado por Netflix, Twitch, etc.
✅ **Open source**: 14k+ stars en GitHub

### hls.js Code Example

```javascript
import Hls from "hls.js";

const audio = document.querySelector("audio");
const hlsUrl = "https://cdn.com/audio/master.m3u8";

if (Hls.isSupported()) {
  // Navegador moderno con MSE
  const hls = new Hls({
    // Configuración
    maxBufferLength: 30, // 30s de buffer máximo
    maxMaxBufferLength: 60, // 60s absoluto
    enableWorker: true, // Web Worker para mejor performance
    lowLatencyMode: false, // true para live streams
    debug: false, // true para logs

    // Adaptive bitrate settings
    abrEwmaDefaultEstimate: 500000, // Bitrate inicial estimado
    abrBandWidthFactor: 0.95, // Factor de seguridad (95%)
    abrBandWidthUpFactor: 0.7, // Cuánto subir calidad
  });

  // Cargar stream
  hls.loadSource(hlsUrl);
  hls.attachMedia(audio);

  // Events
  hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
    console.log("Manifest loaded, qualities:", data.levels);
    // data.levels contiene todas las calidades disponibles
    data.levels.forEach((level, index) => {
      console.log(`Level ${index}: ${level.bitrate / 1000} kbps`);
    });
  });

  hls.on(Hls.Events.LEVEL_SWITCHING, (event, data) => {
    console.log(`Switching to quality level: ${data.level}`);
  });

  hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
    const level = hls.levels[data.level];
    console.log(`Now playing at: ${level.bitrate / 1000} kbps`);
  });

  hls.on(Hls.Events.ERROR, (event, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.error("Network error");
          hls.startLoad(); // Retry
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.error("Media error");
          hls.recoverMediaError();
          break;
        default:
          console.error("Fatal error");
          hls.destroy();
          break;
      }
    }
  });

  // Play
  audio.play();
} else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
  // Safari - HLS nativo
  audio.src = hlsUrl;
  audio.play();
} else {
  console.error("HLS not supported");
}
```

### hls.js + React Hook

```typescript
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface UseHLSPlayerOptions {
  autoPlay?: boolean;
  enableLogs?: boolean;
}

export function useHLSPlayer(url: string, options: UseHLSPlayerOptions = {}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [currentQuality, setCurrentQuality] = useState<number>(0);
  const [qualities, setQualities] = useState<
    { bitrate: number; index: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // Check HLS support
    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: options.enableLogs,
        enableWorker: true,
        maxBufferLength: 30,
      });

      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setIsLoading(false);
        const levels = data.levels.map((level, index) => ({
          bitrate: level.bitrate,
          index,
        }));
        setQualities(levels);

        if (options.autoPlay) {
          audio.play();
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setError(data.type);
        }
      });
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      audio.src = url;
      setIsLoading(false);

      if (options.autoPlay) {
        audio.play();
      }
    } else {
      setError("HLS not supported");
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [url, options.autoPlay, options.enableLogs]);

  const changeQuality = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
    }
  };

  const setAutoQuality = () => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = -1; // -1 = auto
    }
  };

  return {
    audioRef,
    currentQuality,
    qualities,
    isLoading,
    error,
    changeQuality,
    setAutoQuality,
  };
}

// Component usage
function HLSAudioPlayer({ streamUrl }: { streamUrl: string }) {
  const {
    audioRef,
    currentQuality,
    qualities,
    isLoading,
    error,
    changeQuality,
    setAutoQuality,
  } = useHLSPlayer(streamUrl, { autoPlay: true });

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <audio ref={audioRef} controls />

      <div className="quality-selector">
        <button onClick={setAutoQuality}>Auto</button>
        {qualities.map((q) => (
          <button
            key={q.index}
            onClick={() => changeQuality(q.index)}
            className={currentQuality === q.index ? "active" : ""}
          >
            {q.bitrate / 1000} kbps
          </button>
        ))}
      </div>

      <p>Current: {qualities[currentQuality]?.bitrate / 1000} kbps</p>
    </div>
  );
}
```

---

## DASH vs HLS

### Comparación Técnica

| Feature             | HLS                       | DASH                                    |
| ------------------- | ------------------------- | --------------------------------------- |
| **Creador**         | Apple (2009)              | MPEG (2012)                             |
| **Soporte iOS**     | ✅ Nativo                 | ⚠️ Requiere JS                          |
| **Soporte Android** | ⚠️ Requiere JS            | ✅ Mejor soporte                        |
| **Codecs**          | H.264, AAC principalmente | Codec-agnostic (VP9, AV1, Opus)         |
| **Latencia**        | ~10-30s (LL-HLS: <3s)     | ~5-15s (nativo bajo)                    |
| **Container**       | .ts o .m4s                | .m4s, .webm                             |
| **Licencias**       | Gratis                    | Gratis (pero codecs pueden tener costo) |
| **Madurez**         | 15+ años                  | 12+ años                                |
| **Adopción**        | Mayor (Apple dominance)   | Menor (Android, YouTube)                |

### ¿Cuál usar?

**Usa HLS si:**

- ✅ Tu audiencia principal es iOS/Apple
- ✅ Quieres máxima compatibilidad
- ✅ Latencia no es crítica (<30s está bien)
- ✅ Quieres menos problemas de implementación

**Usa DASH si:**

- ✅ Necesitas latencia ultra-baja (<5s)
- ✅ Quieres flexibilidad de codecs (VP9, AV1, Opus)
- ✅ Tu audiencia es Android-heavy
- ✅ Necesitas evitar licencias de codecs (usa VP9+Opus)

**Solución ideal:**

- 🎯 **Soporta ambos**: Genera HLS para iOS, DASH para Android/Web
- Librerías como **Video.js** soportan ambos automáticamente

### Implementación Dual (HLS + DASH)

```javascript
import Hls from "hls.js";
import dashjs from "dashjs";

class UniversalPlayer {
  constructor(audioElement, hlsUrl, dashUrl) {
    this.audio = audioElement;
    this.hlsUrl = hlsUrl;
    this.dashUrl = dashUrl;
  }

  init() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS && this.audio.canPlayType("application/vnd.apple.mpegurl")) {
      // iOS - HLS nativo
      this.audio.src = this.hlsUrl;
    } else if (Hls.isSupported()) {
      // Navegadores modernos - HLS con hls.js
      const hls = new Hls();
      hls.loadSource(this.hlsUrl);
      hls.attachMedia(this.audio);
    } else {
      // Fallback a DASH (Android)
      const player = dashjs.MediaPlayer().create();
      player.initialize(this.audio, this.dashUrl, true);
    }

    this.audio.play();
  }
}

// Usage
const audio = document.querySelector("audio");
const player = new UniversalPlayer(
  audio,
  "https://cdn.com/audio/master.m3u8", // HLS
  "https://cdn.com/audio/manifest.mpd" // DASH
);
player.init();
```

---

## Arquitectura de Spotify

### Sistema General

Basado en investigación de arquitectura pública de Spotify:

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIOS (500M+)                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   CDN GLOBAL (Edgecast)                     │
│  • Servers en 200+ ubicaciones                              │
│  • Cache de archivos de audio                               │
│  • Reduce latencia (nearest server)                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              GOOGLE CLOUD PLATFORM (GCP)                    │
│                                                             │
│  ┌───────────────────────────────────────────────┐          │
│  │  300+ MICROSERVICIOS                          │          │
│  │  • Authentication Service                     │          │
│  │  • Playlist Service                           │          │
│  │  • Recommendation Engine (ML)                 │          │
│  │  • Search Service                             │          │
│  │  • User Profile Service                       │          │
│  │  • Audio Streaming Service                    │          │
│  │  • Social Service (followers)                 │          │
│  │  • Payment/Billing Service                    │          │
│  └───────────────────────────────────────────────┘          │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────┐          │
│  │  MESSAGE QUEUE (Apache Kafka)                 │          │
│  │  • 1+ billion events/day                      │          │
│  │  • Real-time data streaming                   │          │
│  └───────────────────────────────────────────────┘          │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────┐          │
│  │  DATABASES                                    │          │
│  │  • Cassandra (user data, playlists)           │          │
│  │  • PostgreSQL (metadata)                      │          │
│  │  • Bigtable (analytics)                       │          │
│  └───────────────────────────────────────────────┘          │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────┐          │
│  │  STORAGE                                      │          │
│  │  • Google Cloud Storage (audio files)         │          │
│  │  • Amazon S3 (artwork, metadata)              │          │
│  └───────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Audio Streaming Flow

```
┌──────────────────────────────────────────────────────────────┐
│  USUARIO PRESIONA PLAY                                       │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  1. Cliente solicita canción                                │
│     GET /track/3n3Ppam7vgaVa1iaRUc9Lp                        │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  2. Auth Service valida token JWT                           │
│     • Verifica suscripción (Free/Premium)                   │
│     • Determina calidad permitida                           │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  3. Audio Service selecciona calidad                        │
│     Free: 160 kbps AAC (mobile), 128 kbps (web)             │
│     Premium: 256 kbps AAC                                   │
│     HiFi: FLAC lossless (nuevo tier 2025)                   │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  4. CDN Routing                                             │
│     • Geo-location del usuario                              │
│     • Selecciona CDN edge server más cercano                │
│     • Retorna URL firmada con TTL                           │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  5. Cliente empieza a descargar                             │
│     • Descarga chunks de ~10 segundos                       │
│     • Pre-carga 2-3 chunks adelante                         │
│     • Monitorea velocidad de red                            │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  6. Adaptive Bitrate (si la red cambia)                     │
│     Red lenta → Baja a 128 kbps                             │
│     Red mejora → Sube a 256 kbps                            │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│  7. Analytics & Kafka                                       │
│     • Track play event                                      │
│     • Update listening history                              │
│     • Feed recommendation engine                            │
│     • Track progress (para "Resume")                        │
└──────────────────────────────────────────────────────────────┘
```

### Tecnologías Clave de Spotify

**Infraestructura:**

- Google Cloud Platform (GCP)
- Kubernetes para orquestación
- 300+ microservicios independientes

**Streaming:**

- CDN global personalizado (Edgecast/Verizon)
- Protocolo propietario (Spotify Connect)
- OGG Vorbis (viejo) → AAC (actual) → FLAC (HiFi)

**Data Processing:**

- Apache Kafka (1B+ events/day)
- Apache Spark (analytics)
- TensorFlow (recommendations ML)

**Storage:**

- Cassandra (user data, high availability)
- PostgreSQL (metadata)
- Cloud Storage (audio files)

**Frontend:**

- React (web)
- React Native (mobile) - antes nativo
- Web Audio API + MSE custom implementation

---

## Implementación Práctica para Ampli

### Arquitectura Recomendada (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                         FASE 1: MVP                         │
│                    (Simple pero funcional)                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  AUDIO ORIGINAL  │
│   (uploaded)     │
└──────────────────┘
        ↓
┌──────────────────────────────────────────────────────────────┐
│  CLOUDINARY (o similar)                                     │
│  • Auto-transcode a múltiples calidades                     │
│  • 320 kbps AAC (Premium)                                   │
│  • 256 kbps AAC (Standard)                                  │
│  • 128 kbps AAC (Free/Mobile)                               │
│  • CDN global incluido                                      │
└──────────────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────────────┐
│  WEB APP                                                    │
│  • Howler.js (simple playback)                              │
│  • Fetch calidad basada en tier del usuario                │
│  • Progressive download (no HLS todavía)                    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  MOBILE APP                                                 │
│  • React Native Track Player                               │
│  • Fetch URL de Cloudinary                                 │
│  • Track Player maneja buffering                           │
└──────────────────────────────────────────────────────────────┘
```

### Fase 2: Adaptive Streaming

```
┌─────────────────────────────────────────────────────────────┐
│                    FASE 2: HLS/DASH                         │
│               (Adaptive bitrate streaming)                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  AUDIO UPLOAD    │
└──────────────────┘
        ↓
┌──────────────────────────────────────────────────────────────┐
│  ENCODING PIPELINE (FFmpeg)                                 │
│  • Transcode a múltiples bitrates                           │
│  • Segmentar en chunks de 10s                               │
│  • Generar playlists m3u8                                   │
│  • Upload a S3/Cloudinary                                   │
└──────────────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────────────┐
│  CDN (CloudFront, Cloudflare)                               │
│  • Cache de segmentos                                       │
│  • Geo-distribution                                         │
│  • Low latency                                              │
└──────────────────────────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────────────────────────┐
│  WEB: hls.js                                                │
│  • Adaptive bitrate automático                             │
│  • Network monitoring                                       │
│  • Seamless quality switching                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  MOBILE: ExoPlayer (Android) / AVPlayer (iOS)               │
│  • HLS nativo                                               │
│  • Hardware acceleration                                    │
│  • Background playback                                      │
└──────────────────────────────────────────────────────────────┘
```

### FFmpeg Script para HLS

```bash
#!/bin/bash
# convert-to-hls.sh

INPUT="$1"
OUTPUT_DIR="$2"

# Crear directorio
mkdir -p "$OUTPUT_DIR"

# 320 kbps - Alta calidad
ffmpeg -i "$INPUT" \
  -c:a aac -b:a 320k \
  -f hls \
  -hls_time 10 \
  -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/320k/segment%03d.ts" \
  "$OUTPUT_DIR/320k/playlist.m3u8"

# 256 kbps - Media calidad
ffmpeg -i "$INPUT" \
  -c:a aac -b:a 256k \
  -f hls \
  -hls_time 10 \
  -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/256k/segment%03d.ts" \
  "$OUTPUT_DIR/256k/playlist.m3u8"

# 128 kbps - Baja calidad
ffmpeg -i "$INPUT" \
  -c:a aac -b:a 128k \
  -f hls \
  -hls_time 10 \
  -hls_playlist_type vod \
  -hls_segment_filename "$OUTPUT_DIR/128k/segment%03d.ts" \
  "$OUTPUT_DIR/128k/playlist.m3u8"

# Generar master playlist
cat > "$OUTPUT_DIR/master.m3u8" << EOF
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=320000,CODECS="mp4a.40.2"
320k/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=256000,CODECS="mp4a.40.2"
256k/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=128000,CODECS="mp4a.40.2"
128k/playlist.m3u8
EOF

echo "HLS conversion complete!"
echo "Master playlist: $OUTPUT_DIR/master.m3u8"
```

**Usage:**

```bash
./convert-to-hls.sh song.mp3 output/song-id
```

### Node.js HLS Generation

```typescript
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs/promises";

interface HLSQuality {
  name: string;
  bitrate: string;
}

const qualities: HLSQuality[] = [
  { name: "320k", bitrate: "320k" },
  { name: "256k", bitrate: "256k" },
  { name: "128k", bitrate: "128k" },
];

async function convertToHLS(
  inputPath: string,
  outputDir: string
): Promise<string> {
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Convert each quality
  const conversions = qualities.map((quality) => {
    return new Promise<void>((resolve, reject) => {
      const qualityDir = path.join(outputDir, quality.name);
      fs.mkdir(qualityDir, { recursive: true });

      ffmpeg(inputPath)
        .audioCodec("aac")
        .audioBitrate(quality.bitrate)
        .outputOptions([
          "-f hls",
          "-hls_time 10",
          "-hls_playlist_type vod",
          `-hls_segment_filename ${qualityDir}/segment%03d.ts`,
        ])
        .output(path.join(qualityDir, "playlist.m3u8"))
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });
  });

  // Wait for all conversions
  await Promise.all(conversions);

  // Generate master playlist
  const masterPlaylist = [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    ...qualities.map((q) => {
      const bitrate = parseInt(q.bitrate) * 1000;
      return `#EXT-X-STREAM-INF:BANDWIDTH=${bitrate},CODECS="mp4a.40.2"\n${q.name}/playlist.m3u8`;
    }),
  ].join("\n");

  const masterPath = path.join(outputDir, "master.m3u8");
  await fs.writeFile(masterPath, masterPlaylist);

  return masterPath;
}

// Usage
convertToHLS("./uploads/song.mp3", "./hls-output/song-123")
  .then((masterPath) => console.log("Done:", masterPath))
  .catch((err) => console.error("Error:", err));
```

---

## Comparación de Tecnologías

### Resumen Ejecutivo

| Tecnología               | Complejidad         | Calidad              | Costo    | Recomendación      |
| ------------------------ | ------------------- | -------------------- | -------- | ------------------ |
| **Progressive Download** | ⭐ Muy fácil        | ⭐⭐⭐ Buena         | $ Bajo   | MVP inicial        |
| **Howler.js**            | ⭐⭐ Fácil          | ⭐⭐⭐⭐ Muy buena   | $ Bajo   | Web simple         |
| **HLS (hls.js)**         | ⭐⭐⭐ Media        | ⭐⭐⭐⭐⭐ Excelente | $$ Media | Producción web     |
| **DASH**                 | ⭐⭐⭐⭐ Media-alta | ⭐⭐⭐⭐⭐ Excelente | $$ Media | Android optimizado |
| **Custom MSE**           | ⭐⭐⭐⭐⭐ Muy alta | ⭐⭐⭐⭐⭐ Excelente | $$$ Alta | Empresas grandes   |

### Roadmap Recomendado para Ampli

**Mes 1-2: MVP**

```
✅ Progressive download con Howler.js
✅ Cloudinary auto-transcode (3 calidades)
✅ Track Player en mobile
✅ Calidad basada en tier de usuario
```

**Mes 3-4: Mejorar experiencia**

```
✅ Implementar HLS con hls.js (web)
✅ Pipeline de encoding automatizado
✅ CDN setup (CloudFront o Cloudflare)
✅ Adaptive bitrate automático
```

**Mes 5-6: Optimización**

```
✅ Analytics de calidad de streaming
✅ A/B testing de bitrates
✅ Offline mode (mobile)
✅ Preloading inteligente
```

**Futuro (6+ meses):**

```
⭐ Low-latency HLS (live streaming)
⭐ DASH support (Android optimization)
⭐ Lossless FLAC tier
⭐ Custom MSE implementation
```

---

## Recursos Adicionales

### Documentación Oficial

- [HLS Specification (Apple)](https://developer.apple.com/streaming/)
- [MSE API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API)
- [hls.js GitHub](https://github.com/video-dev/hls.js)
- [DASH Specification](https://dashif.org/)

### Tutoriales

- [Chrome MSE Audio Tutorial](https://developer.chrome.com/blog/media-source-extensions-for-audio/)
- [HLS.js Complete Guide 2025](https://www.videosdk.live/developer-hub/hls/hls-js)
- [FFmpeg HLS Guide](https://trac.ffmpeg.org/wiki/StreamingGuide)

### Herramientas

- **FFmpeg**: Encoding y segmentación
- **hls.js**: HLS playback en web
- **dash.js**: DASH playback en web
- **Shaka Player**: Universal player (HLS + DASH)
- **Video.js**: Player con plugins para HLS/DASH

### Servicios

- **Cloudinary**: Transcoding automático + CDN
- **Mux**: Video/Audio infrastructure as a service
- **AWS MediaConvert**: Transcoding a escala
- **Cloudflare Stream**: Streaming completo

---

## Conclusión

**Para Ampli, la recomendación es:**

### Fase MVP (ahora):

- ✅ **Web**: Howler.js con progressive download
- ✅ **Mobile**: React Native Track Player
- ✅ **Backend**: Cloudinary para transcoding automático

### Fase Producción (3-6 meses):

- ✅ **Web**: hls.js con HLS adaptive streaming
- ✅ **Mobile**: Mantener Track Player (ya soporta HLS)
- ✅ **Backend**: Pipeline HLS automatizado con FFmpeg
- ✅ **CDN**: CloudFront o Cloudflare

### Futuro:

- ⭐ Considerar DASH para Android
- ⭐ Custom MSE solo si necesitas features muy específicas
- ⭐ Lossless tier con FLAC

**Esto te dará calidad Spotify-level sin la complejidad de una implementación 100% custom desde día 1.**
