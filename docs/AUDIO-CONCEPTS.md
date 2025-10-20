# Advanced Audio Concepts - Complete Guide

## Overview

Este documento cubre TODOS los conceptos técnicos avanzados que necesitas dominar para construir una plataforma de streaming de audio profesional como Spotify, SoundCloud o Tidal.

---

## Table of Contents

1. [Audio Codecs - Comparación Profunda](#audio-codecs---comparación-profunda)
2. [Audio Normalization & Loudness](#audio-normalization--loudness)
3. [DRM (Digital Rights Management)](#drm-digital-rights-management)
4. [CDN Strategies & Caching](#cdn-strategies--caching)
5. [Audio Metadata Standards](#audio-metadata-standards)
6. [Gapless Playback](#gapless-playback)
7. [Crossfade & Audio Transitions](#crossfade--audio-transitions)
8. [Audio Fingerprinting & Content ID](#audio-fingerprinting--content-id)
9. [Waveform Visualization](#waveform-visualization)
10. [Audio Processing & Effects](#audio-processing--effects)
11. [Offline Mode & Caching](#offline-mode--caching)
12. [Analytics & Telemetry](#analytics--telemetry)

---

## Audio Codecs - Comparación Profunda

### ¿Qué es un Codec?

**Codec** = **Co**der + **Dec**oder

Un codec comprime audio (encoder) y lo descomprime para reproducción (decoder). Hay dos tipos:

**Lossless** (sin pérdida):
- Audio idéntico al original
- Archivos grandes (~30 MB por canción)
- Ejemplos: FLAC, ALAC, WAV

**Lossy** (con pérdida):
- Remueve frecuencias que el oído humano no detecta
- Archivos pequeños (~3-8 MB por canción)
- Ejemplos: MP3, AAC, Opus

### Comparación Detallada de Codecs

#### 1. **AAC (Advanced Audio Codec)**

**Overview:**
- Sucesor de MP3
- Usado por Apple Music, YouTube, Spotify
- Mejor calidad que MP3 al mismo bitrate

**Características:**
- **Bitrates**: 64-320 kbps
- **Calidad óptima**: 256+ kbps
- **Container**: MP4, M4A
- **Licencia**: Requiere licencia (pero ampliamente soportado)

**Ventajas:**
✅ Mejor que MP3 en calidad/tamaño
✅ Soporte universal (iOS, Android, Web)
✅ Excelente para música a 256+ kbps
✅ Streaming eficiente

**Desventajas:**
❌ No es el mejor a bitrates bajos (<128 kbps)
❌ Requiere licencias para encoders

**Calidad por Bitrate:**
```
320 kbps: ⭐⭐⭐⭐⭐ Indistinguible del original
256 kbps: ⭐⭐⭐⭐⭐ Excelente (Spotify Premium)
192 kbps: ⭐⭐⭐⭐  Muy buena
128 kbps: ⭐⭐⭐   Buena (Spotify Free web)
64 kbps:  ⭐⭐    Aceptable solo para voz
```

**Uso recomendado:**
- Streaming Premium: 256-320 kbps
- Streaming Free: 128-160 kbps
- Podcasts: 64-96 kbps

---

#### 2. **Opus**

**Overview:**
- Codec moderno (2012)
- Royalty-free (sin licencias)
- Mejor calidad a bitrates bajos
- Usado por WhatsApp, Discord, Zoom

**Características:**
- **Bitrates**: 6-510 kbps (rango enorme)
- **Calidad óptima**: 96-128 kbps
- **Container**: OGG, WebM
- **Licencia**: 100% libre

**Ventajas:**
✅ Mejor codec a bitrates bajos (<100 kbps)
✅ Sin costos de licencia
✅ Latencia ultra-baja
✅ Excelente para voz y música
✅ Ideal para streaming en vivo

**Desventajas:**
❌ Menor soporte en iOS (Safari parcial)
❌ No todos los devices soportan hardware decode
❌ Menos maduro que AAC/MP3

**Calidad por Bitrate:**
```
128 kbps: ⭐⭐⭐⭐⭐ Mejor que AAC 192 kbps
96 kbps:  ⭐⭐⭐⭐  Mejor que MP3 128 kbps
64 kbps:  ⭐⭐⭐⭐  Mejor que AAC 96 kbps
48 kbps:  ⭐⭐⭐   Excelente para voz
```

**Uso recomendado:**
- VoIP / Live streaming
- Podcasts (excelente calidad a 48-64 kbps)
- Cuando quieres evitar licencias
- Aplicaciones con latencia crítica

---

#### 3. **MP3**

**Overview:**
- El formato que revolucionó la música digital
- Universal pero obsoleto técnicamente
- Usado todavía por compatibilidad

**Características:**
- **Bitrates**: 32-320 kbps
- **Calidad óptima**: 256-320 kbps
- **Container**: MP3
- **Licencia**: Patentes expiraron (2017, ahora libre)

**Ventajas:**
✅ Soporte 100% universal
✅ Maduro y probado
✅ Hardware decode en todos los devices

**Desventajas:**
❌ Inferior a AAC/Opus en calidad/bitrate
❌ Archivos más grandes que AAC
❌ No ideal para bitrates bajos

**Calidad por Bitrate:**
```
320 kbps: ⭐⭐⭐⭐  Muy buena (pero AAC es mejor)
256 kbps: ⭐⭐⭐⭐  Buena
192 kbps: ⭐⭐⭐   Aceptable
128 kbps: ⭐⭐    Pobre (artifacts audibles)
```

**Uso recomendado:**
- Compatibilidad máxima
- Cuando necesitas soporte legacy
- Ya NO recomendado para nuevos proyectos

---

#### 4. **FLAC (Lossless)**

**Overview:**
- Free Lossless Audio Codec
- Audio bit-perfect (idéntico al original)
- Usado por Tidal, Amazon Music HD

**Características:**
- **Compression**: ~50-70% del tamaño WAV
- **Calidad**: 100% sin pérdida
- **Container**: FLAC
- **Licencia**: 100% libre

**Ventajas:**
✅ Calidad perfecta
✅ Sin licencias
✅ Streaming support (web)
✅ Metadata rica (Vorbis Comments)

**Desventajas:**
❌ Archivos grandes (~25-30 MB por canción)
❌ Requiere más ancho de banda
❌ No todos los devices tienen hardware decode

**Tamaños típicos (canción 3 min):**
```
WAV original:   ~30 MB
FLAC:          ~25 MB (compresión sin pérdida)
AAC 320 kbps:   ~7 MB
AAC 256 kbps:   ~6 MB
MP3 320 kbps:   ~7 MB
```

**Uso recomendado:**
- Tier HiFi/Premium (Tidal-like)
- Audiophiles
- Archivo de masters
- Cuando el ancho de banda no es problema

---

#### 5. **ALAC (Apple Lossless)**

**Overview:**
- Apple's lossless codec
- Similar a FLAC
- Usado por Apple Music Lossless

**Características:**
- **Compression**: Similar a FLAC
- **Calidad**: 100% sin pérdida
- **Container**: M4A
- **Licencia**: Open source (2011)

**Ventajas:**
✅ Soporte nativo iOS/macOS
✅ Lossless quality
✅ Metadata (ID3)

**Desventajas:**
❌ Menos soporte que FLAC fuera de Apple
❌ Archivos grandes

**Uso recomendado:**
- Ecosistema Apple
- Cuando ya usas M4A/MP4 containers

---

### Comparación Lado a Lado

| Codec | Type | Bitrate | Quality | Size | License | Best For |
|-------|------|---------|---------|------|---------|----------|
| **AAC** | Lossy | 64-320k | ⭐⭐⭐⭐ | Pequeño | Paid* | Streaming general |
| **Opus** | Lossy | 6-510k | ⭐⭐⭐⭐⭐ | Muy pequeño | Free | Bitrates bajos, VoIP |
| **MP3** | Lossy | 32-320k | ⭐⭐⭐ | Mediano | Free | Compatibilidad |
| **FLAC** | Lossless | N/A | ⭐⭐⭐⭐⭐ | Grande | Free | Audiophiles |
| **ALAC** | Lossless | N/A | ⭐⭐⭐⭐⭐ | Grande | Free | Ecosistema Apple |

*AAC decoders son gratis, encoders requieren licencia

### Recomendación para Ampli

```
┌─────────────────────────────────────────────────────────┐
│               TIER DE SUSCRIPCIÓN                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FREE TIER:                                             │
│  • Web: AAC 128 kbps                                    │
│  • Mobile: AAC 160 kbps                                 │
│                                                         │
│  PREMIUM TIER:                                          │
│  • Web: AAC 256 kbps                                    │
│  • Mobile: AAC 256 kbps                                 │
│                                                         │
│  HIFI TIER (futuro):                                    │
│  • FLAC lossless (24-bit/44.1kHz)                       │
│  • Fallback a AAC 320 kbps si device no soporta        │
│                                                         │
│  PODCASTS (todos los tiers):                            │
│  • AAC 64 kbps (voz clara, tamaño pequeño)              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Justificación:**
- ✅ **AAC**: Mejor balance calidad/compatibilidad/tamaño
- ✅ **FLAC**: Para audiophiles (HiFi tier)
- ❌ **Opus**: Mejor técnicamente pero problemas de compatibilidad iOS
- ❌ **MP3**: Obsoleto, AAC es superior

---

## Audio Normalization & Loudness

### ¿Por qué es importante?

Sin normalización:
```
Usuario reproduce:
Canción 1 (rock):  🔊🔊🔊🔊🔊 LOUD!
Canción 2 (jazz):  🔉 quiet...
Canción 3 (EDM):   🔊🔊🔊🔊🔊🔊 SUPER LOUD!
```

Usuario tiene que ajustar volumen constantemente = **mala experiencia**

Con normalización:
```
Todas las canciones:  🔊🔊🔊 volumen consistente
```

### Conceptos Clave

#### Peak Normalization (obsoleto)

Ajusta el volumen basado en el pico más alto.

**Problema:** No toma en cuenta percepción de loudness
```
Canción A: Pico = -0.1 dB, pero mayormente quieta
Canción B: Pico = -0.1 dB, constantemente loud

Ambas tienen mismo "peak" pero B suena MUCHO más loud
```

#### RMS Normalization (mejor)

Ajusta basado en el promedio (Root Mean Square).

**Mejor** que peak, pero todavía no perfecto.

#### LUFS (Loudness Units Full Scale) - ESTÁNDAR ACTUAL

**LUFS** = Loudness Units relative to Full Scale

Mide loudness **percibido** por el oído humano (psychoacoustic).

**Estándar de la industria:**
- Broadcasting: EBU R128 (-23 LUFS)
- **Streaming music: -14 LUFS** ← ESTE ES EL IMPORTANTE

### Niveles de LUFS por Plataforma (2025)

| Plataforma | Target LUFS | Normalization |
|------------|-------------|---------------|
| **Spotify** | -14 LUFS | ✅ Yes (can disable) |
| **Apple Music** | -16 LUFS | ✅ Yes (Sound Check) |
| **YouTube** | -14 LUFS | ✅ Yes |
| **Tidal** | -14 LUFS | ✅ Yes |
| **Amazon Music** | -14 LUFS | ✅ Yes |
| **SoundCloud** | -8 to -13 LUFS | ⚠️ Inconsistent |

**Recomendación universal: -14 LUFS integrated**

### ReplayGain vs LUFS

#### ReplayGain (viejo método)

- Método anterior usado por Spotify
- Basado en percepción psicoacústica
- Calcula "gain" necesario para normalizar

#### LUFS (método actual)

- Estándar ITU-R BS.1770
- Usado por broadcasting y streaming moderno
- **Spotify migró a LUFS en 2020**

**Para nuevos proyectos: usa LUFS, no ReplayGain**

### Implementación

#### Medir LUFS (FFmpeg)

```bash
# Analizar archivo para obtener LUFS
ffmpeg -i input.mp3 -af ebur128 -f null -

# Output incluirá:
# I: -16.2 LUFS  <- Integrated loudness
# LRA: 8.5 LU   <- Loudness range
# TP: -1.0 dBTP <- True peak
```

#### Normalizar a -14 LUFS

```bash
# Paso 1: Medir loudness actual
ffmpeg -i input.mp3 -af ebur128=framelog=verbose -f null - 2>&1 | grep "I:"

# Ejemplo output: I: -18.5 LUFS

# Paso 2: Calcular gain necesario
# Target = -14 LUFS
# Current = -18.5 LUFS
# Gain = -14 - (-18.5) = +4.5 dB

# Paso 3: Aplicar gain
ffmpeg -i input.mp3 -af "volume=4.5dB" output.mp3
```

#### Normalización Automática (FFmpeg)

```bash
# Normalizar automáticamente a -14 LUFS
ffmpeg -i input.mp3 \
  -af loudnorm=I=-14:TP=-1:LRA=11 \
  -ar 48000 \
  output.mp3
```

#### Node.js Implementation

```typescript
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

interface LoudnessInfo {
  integrated: number;  // LUFS
  truePeak: number;    // dBTP
  loudnessRange: number; // LU
}

async function measureLoudness(filePath: string): Promise<LoudnessInfo> {
  const command = `ffmpeg -i "${filePath}" -af ebur128 -f null - 2>&1`;
  const { stdout } = await execAsync(command);

  // Parse output
  const integratedMatch = stdout.match(/I:\s+([-\d.]+)\s+LUFS/);
  const truePeakMatch = stdout.match(/TP:\s+([-\d.]+)\s+dBTP/);
  const lraMatch = stdout.match(/LRA:\s+([-\d.]+)\s+LU/);

  return {
    integrated: parseFloat(integratedMatch?.[1] || '0'),
    truePeak: parseFloat(truePeakMatch?.[1] || '0'),
    loudnessRange: parseFloat(lraMatch?.[1] || '0'),
  };
}

async function normalizeTo14LUFS(
  inputPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters([
        'loudnorm=I=-14:TP=-1:LRA=11'
      ])
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
}

// Usage
const info = await measureLoudness('./song.mp3');
console.log(`Current loudness: ${info.integrated} LUFS`);

if (info.integrated < -14 || info.integrated > -14) {
  await normalizeTo14LUFS('./song.mp3', './song-normalized.mp3');
  console.log('Normalized to -14 LUFS');
}
```

### Metadata Approach (Non-Destructive)

En lugar de modificar el archivo, guardar el "gain" en metadata:

```typescript
interface AudioMetadata {
  id: string;
  title: string;
  artist: string;
  // Loudness metadata
  replayGain: number;      // dB adjustment needed
  measuredLUFS: number;    // Original LUFS
  targetLUFS: number;      // -14 LUFS
}

// En el player, aplicar gain al vuelo:
function applyReplayGain(audio: HTMLAudioElement, metadata: AudioMetadata) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(audio);
  const gainNode = audioContext.createGain();

  // Calcular gain
  const gainDB = metadata.targetLUFS - metadata.measuredLUFS;
  const gainLinear = Math.pow(10, gainDB / 20);

  gainNode.gain.value = gainLinear;

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
}
```

**Ventaja:** No modificas archivos originales, aplicas gain dinámicamente.

### Recomendación para Ampli

```
┌─────────────────────────────────────────────────────────┐
│           PIPELINE DE NORMALIZACIÓN                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Usuario sube audio                                  │
│      ↓                                                  │
│  2. Analizar con FFmpeg ebur128                         │
│      • Medir LUFS integrated                            │
│      • Medir true peak                                  │
│      • Medir loudness range                             │
│      ↓                                                  │
│  3. Guardar metadata en DB                              │
│      {                                                  │
│        measuredLUFS: -16.5,                             │
│        targetLUFS: -14,                                 │
│        replayGain: +2.5,  // dB                         │
│      }                                                  │
│      ↓                                                  │
│  4. Opción A: Pre-normalizar archivos                   │
│     ffmpeg loudnorm → guardar versión normalizada       │
│                                                         │
│  5. Opción B: Normalizar al vuelo (runtime)             │
│     Player aplica gain node basado en metadata          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Recomendación:**
- ✅ **Opción A** (pre-normalizar): Menos CPU en runtime, mejor para mobile
- ⚠️ **Opción B** (runtime): Más flexible, pero usa más batería en mobile

---

## DRM (Digital Rights Management)

### ¿Qué es DRM?

**Digital Rights Management** = Tecnología para proteger contenido digital contra piratería.

**Uso principal:**
- Prevenir descarga no autorizada
- Controlar quién puede reproducir
- Expirar licencias (subscripciones)

### ¿Necesitas DRM?

**SÍ necesitas DRM si:**
- ✅ Tienes contenido con derechos de labels/distributors
- ✅ Quieres prevenir piratería seria
- ✅ Contratos requieren protección

**NO necesitas DRM si:**
- ❌ Contenido user-generated (como SoundCloud)
- ❌ Proyecto indie/pequeño
- ❌ Enfoque es crecimiento, no protección

**Ampli probablemente NO necesita DRM en MVP**, pero aquí está la info:

### Los 3 Grandes Sistemas de DRM

#### 1. **Google Widevine**

**Plataformas:**
- Android
- Chrome
- Firefox
- Edge
- Smart TVs

**Niveles de seguridad:**
- **L1**: Hardware security (más seguro, permite HD/4K)
- **L2**: Software security
- **L3**: Software security (básico)

**Pricing:**
- Requiere licencia de Google
- ~$1000-5000 setup + royalties

---

#### 2. **Apple FairPlay**

**Plataformas:**
- iOS
- macOS
- Safari
- Apple TV

**Características:**
- Integrado con HLS
- Requiere certificados de Apple
- FairPlay Streaming (FPS)

**Pricing:**
- Requiere Apple Developer Program
- Sin costo adicional de licencia

---

#### 3. **Microsoft PlayReady**

**Plataformas:**
- Windows
- Xbox
- Edge (legacy)
- Smart TVs

**Características:**
- Usado por streaming services grandes
- Hardware DRM support

**Pricing:**
- Licencias comerciales
- Complejo pricing model

---

### Multi-DRM Approach (Lo que usa Spotify/Netflix)

Para cobertura completa, necesitas **los 3**:

```
┌──────────────────────────────────────────────────────┐
│              CONTENIDO PROTEGIDO                     │
└──────────────────────────────────────────────────────┘
                     ↓
         ┌───────────────────────┐
         │   DRM License Server  │
         │  (Azure, AWS, etc)    │
         └───────────────────────┘
                     ↓
         ┌───────────────────────────┐
         │  Detección de Platform    │
         └───────────────────────────┘
                ↓        ↓        ↓
          Widevine  FairPlay  PlayReady
             ↓          ↓          ↓
         Android     iOS      Windows
         Chrome    Safari      Edge
```

### Implementación Multi-DRM

#### Opción 1: Servicios Third-Party (Recomendado)

**Proveedores:**
- **PallyCon**: Multi-DRM as a service
- **BuyDRM KeyOS**: Enterprise DRM
- **Inka Entworks**: DRM + watermarking
- **EZDRM**: Simple DRM solution

**Ventajas:**
✅ No tienes que implementar todo
✅ Manejan licencias con Google/Apple/Microsoft
✅ License servers incluidos
✅ Support incluido

**Pricing típico:**
- Setup: $500-2000
- Monthly: $100-500
- Por-stream: $0.001-0.01

#### Opción 2: DIY con Azure Media Services

Azure ofrece Multi-DRM integrado:

```typescript
import { AzureMediaServices } from '@azure/arm-mediaservices';

// Configure Multi-DRM
const drmConfig = {
  widevine: {
    template: JSON.stringify({
      allowed_track_types: 'SD_HD',
      content_key_specs: [{
        track_type: 'SD',
        security_level: 1,
      }],
    }),
  },
  fairplay: {
    certificateUrl: 'https://yourserver.com/fairplay.cer',
    askUrl: 'https://yourserver.com/fairplay/ask',
  },
  playready: {
    template: '<PlayReadyLicenseResponseTemplate>...</>',
  },
};

// Client-side: Detectar y usar DRM apropiado
function getDRMConfig(platform: string) {
  if (platform === 'ios') return 'fairplay';
  if (platform === 'android') return 'widevine';
  if (platform === 'windows') return 'playready';
  return 'none';
}
```

### Alternativa: Protección Sin DRM

Si no puedes costear DRM full, usa protecciones más simples:

**1. Signed URLs con expiración**
```typescript
// Backend genera URL temporal
function generateSignedURL(audioId: string, userId: string) {
  const token = jwt.sign(
    { audioId, userId },
    SECRET,
    { expiresIn: '1h' }  // URL expira en 1 hora
  );

  return `https://cdn.com/audio/${audioId}?token=${token}`;
}

// Cliente solo puede acceder durante 1 hora
```

**2. Token-based authentication**
```typescript
// Requiere auth header válido
app.get('/stream/:id', authenticateToken, (req, res) => {
  // Verificar subscription activa
  if (!req.user.isPremium) {
    return res.status(403).json({ error: 'Premium required' });
  }

  // Stream audio
  const audioPath = `./audio/${req.params.id}.m4a`;
  res.sendFile(audioPath);
});
```

**3. Domain restrictions (CORS)**
```typescript
// Solo permite streaming desde tu dominio
app.use(cors({
  origin: ['https://ampli.com', 'https://app.ampli.com'],
  credentials: true,
}));
```

**4. Rate limiting**
```typescript
import rateLimit from 'express-rate-limit';

// Máximo 100 streams por hora por usuario
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user.id,
});

app.use('/stream', limiter);
```

### Recomendación para Ampli

```
FASE 1 (MVP): Sin DRM
• Signed URLs con expiración
• Token authentication
• Rate limiting
• CORS restrictions

FASE 2 (Crecimiento): DRM básico
• Si empiezas a tener contenido de labels
• Widevine + FairPlay (cubre 95% de usuarios)
• Usar servicio third-party (PallyCon, EZDRM)

FASE 3 (Enterprise): Full Multi-DRM
• Widevine + FairPlay + PlayReady
• License server propio
• Watermarking para tracking
```

---

## CDN Strategies & Caching

### ¿Por qué necesitas CDN?

**Sin CDN:**
```
Usuario en Japón → Servidor en US East
  ↓
Latency: 200ms
Bandwidth: Limited
Load en origin server: Alto
```

**Con CDN:**
```
Usuario en Japón → CDN Edge Server (Tokyo)
  ↓
Latency: 10ms
Bandwidth: Unlimited
Load en origin: Bajo (cache hit)
```

### Cómo funciona CDN

```
┌─────────────────────────────────────────────────────────┐
│                ORIGIN SERVER                            │
│  • S3, Google Cloud Storage, etc                        │
│  • Audio files originales                               │
└─────────────────────────────────────────────────────────┘
                        ↓
         ┌──────────────────────────────┐
         │      CDN PROVIDER            │
         │  (CloudFront, Cloudflare)    │
         └──────────────────────────────┘
                        ↓
         ┌──────────────────────────────────┐
         │    EDGE SERVERS (Global)         │
         │  • Tokyo                          │
         │  • London                         │
         │  • São Paulo                      │
         │  • Sydney                         │
         │  • etc... (200+ locations)        │
         └──────────────────────────────────┘
                        ↓
                  ┌─────────┐
                  │  USERS  │
                  └─────────┘
```

**Flow:**
1. Usuario pide audio
2. Request va a edge server más cercano
3. Si edge tiene cache → return inmediatamente
4. Si no tiene cache → fetch de origin, cache, return
5. Próximos usuarios → cache hit (súper rápido)

### CDN Providers Comparison (2025)

| Provider | Pricing | Performance | Features | Best For |
|----------|---------|-------------|----------|----------|
| **Cloudflare** | $ Barato | ⭐⭐⭐⭐⭐ | DDoS, Analytics | Startups |
| **CloudFront (AWS)** | $$ Medio | ⭐⭐⭐⭐⭐ | AWS integration | AWS users |
| **Fastly** | $$$ Caro | ⭐⭐⭐⭐⭐ | Real-time purge | Enterprise |
| **Akamai** | $$$$ Muy caro | ⭐⭐⭐⭐⭐ | Máxima escala | Enterprise |
| **BunnyCDN** | $ Muy barato | ⭐⭐⭐⭐ | Simple, rápido | Indie/Small |
| **Cloudinary** | $$ Medio | ⭐⭐⭐⭐ | Media-specific | Media apps |

### Cache Strategies

#### 1. **Cache-Control Headers**

```typescript
// Express.js ejemplo
app.get('/audio/:id', (req, res) => {
  res.set({
    // Cache por 1 año (audio no cambia)
    'Cache-Control': 'public, max-age=31536000, immutable',

    // CDN puede cachear
    'CDN-Cache-Control': 'max-age=31536000',

    // Etiqueta para invalidación
    'Cache-Tag': `audio-${req.params.id}`,
  });

  res.sendFile(audioPath);
});
```

**Headers importantes:**

```
Cache-Control: public, max-age=31536000
  • public: CDN puede cachear
  • max-age: Tiempo de cache (seconds)
  • immutable: Nunca cambia, no revalidar

Cache-Control: private
  • Solo browser cache, NO CDN

Cache-Control: no-cache
  • Siempre revalidar con server

Cache-Control: no-store
  • No cachear nunca
```

#### 2. **Predictive Caching (AI-powered)**

```typescript
// Pre-cache contenido popular antes de que se pida
async function predictiveCache() {
  // Analytics: Top 100 canciones trending
  const trending = await analytics.getTrendingSongs(100);

  // Pre-warm CDN cache
  for (const song of trending) {
    await cdn.prefetch([
      `https://cdn.com/audio/${song.id}/320k/master.m3u8`,
      `https://cdn.com/audio/${song.id}/256k/master.m3u8`,
      `https://cdn.com/audio/${song.id}/cover.jpg`,
    ]);
  }

  console.log('Predictive cache warmed');
}

// Run cada hora
setInterval(predictiveCache, 60 * 60 * 1000);
```

#### 3. **Geographic Pre-Caching**

```typescript
// Pre-cache contenido popular por región
async function geographicCache() {
  const regions = ['US', 'EU', 'ASIA', 'LATAM'];

  for (const region of regions) {
    // Top 50 en cada región
    const topInRegion = await analytics.getTopSongs(region, 50);

    // Pre-cache en edge servers de esa región
    await cdn.prefetch(topInRegion, {
      regions: [region],
    });
  }
}
```

#### 4. **Adaptive Bitrate Caching**

```typescript
// Cachear solo bitrates más usados para ahorrar storage
const cacheStrategy = {
  // Siempre cache:
  always: ['256k', '128k'],  // Más común

  // Cache on-demand:
  onDemand: ['320k', '64k'],  // Menos común

  // No cache (direct from origin):
  bypass: ['flac'],  // Muy raro, archivos grandes
};

app.get('/audio/:id/:quality/*', (req, res) => {
  const { quality } = req.params;

  if (cacheStrategy.bypass.includes(quality)) {
    // No cache, siempre desde origin
    res.set('Cache-Control', 'no-store');
  } else if (cacheStrategy.always.includes(quality)) {
    // Cache agresivo
    res.set('Cache-Control', 'public, max-age=31536000');
  } else {
    // Cache moderado
    res.set('Cache-Control', 'public, max-age=86400');
  }

  // ... serve file
});
```

### Multi-CDN Strategy

Usa múltiples CDNs para redundancia:

```typescript
const cdnProviders = [
  { name: 'cloudflare', url: 'https://cf-cdn.ampli.com' },
  { name: 'cloudfront', url: 'https://aws-cdn.ampli.com' },
  { name: 'bunny', url: 'https://bunny-cdn.ampli.com' },
];

function getCDNUrl(audioId: string, userRegion: string) {
  // Routing logic
  if (userRegion === 'EU') {
    return `${cdnProviders[0].url}/audio/${audioId}`;
  } else if (userRegion === 'US') {
    return `${cdnProviders[1].url}/audio/${audioId}`;
  } else {
    return `${cdnProviders[2].url}/audio/${audioId}`;
  }
}

// Fallback automático
async function fetchAudio(audioId: string) {
  for (const cdn of cdnProviders) {
    try {
      const response = await fetch(`${cdn.url}/audio/${audioId}`);
      if (response.ok) return response;
    } catch (error) {
      console.error(`${cdn.name} failed, trying next...`);
    }
  }

  throw new Error('All CDNs failed');
}
```

### Cache Performance Metrics

**Métricas importantes:**

```typescript
interface CacheMetrics {
  hitRate: number;        // % de requests que hit cache
  missRate: number;       // % que van a origin
  bandwidth: number;      // GB transferido
  latency: number;        // ms promedio
  originLoad: number;     // % de load en origin
}

// Ideal targets:
const idealMetrics = {
  hitRate: 95,       // 95%+ hit rate
  missRate: 5,       // <5% miss rate
  latency: 50,       // <50ms
  originLoad: 10,    // <10% de requests van a origin
};
```

### CloudFront Example (AWS)

```typescript
import { CloudFront } from '@aws-sdk/client-cloudfront';

const cloudfront = new CloudFront({ region: 'us-east-1' });

// Crear invalidación (purge cache)
async function invalidateCache(paths: string[]) {
  await cloudfront.createInvalidation({
    DistributionId: 'E1234567890ABC',
    InvalidationBatch: {
      Paths: {
        Quantity: paths.length,
        Items: paths,
      },
      CallerReference: `${Date.now()}`,
    },
  });
}

// Invalidar cuando audio es actualizado
await invalidateCache([
  '/audio/song-123/*',
  '/images/cover-123.jpg',
]);
```

### Cloudflare Example

```typescript
import Cloudflare from 'cloudflare';

const cf = new Cloudflare({
  apiToken: process.env.CF_API_TOKEN,
});

// Purge cache por tags
async function purgeByTag(tags: string[]) {
  await cf.zones.purgeCache({
    zone_id: 'zone-id',
    tags: tags,
  });
}

// Purge específico de un audio
await purgeByTag(['audio-123', 'playlist-456']);
```

### Recomendación para Ampli

```
FASE 1 (MVP):
• Cloudflare (gratis, excelente performance)
• O BunnyCDN ($10/TB, muy barato)
• Cache-Control headers agresivos
• Pre-cache top 100 songs

FASE 2 (Crecimiento):
• CloudFront + Cloudflare (multi-CDN)
• Predictive caching con ML
• Regional optimization
• Analytics de cache hit rate

FASE 3 (Escala):
• Multi-CDN routing inteligente
• Edge computing (process cerca del user)
• Custom CDN logic
• 99.99% hit rate
```

---

## Audio Metadata Standards

### ¿Qué es metadata?

**Metadata** = Información sobre el audio (NO el audio en sí)

Ejemplos:
- Título, artista, álbum
- Año, género
- Cover art (imagen)
- Letra (lyrics)
- BPM, key musical
- Copyright info

### Formatos de Metadata

#### 1. **ID3 (MP3)**

**Versiones:**
- ID3v1: Muy limitado (30 chars título, etc)
- ID3v2: Moderno, flexible

**Estructura ID3v2:**

```
┌────────────────────────────────────┐
│  ID3v2 HEADER (10 bytes)           │
├────────────────────────────────────┤
│  FRAMES:                           │
│                                    │
│  TIT2: Song Title                  │
│  TPE1: Artist                      │
│  TALB: Album                       │
│  TDRC: Year                        │
│  TCON: Genre                       │
│  APIC: Cover Art (image)           │
│  TXXX: Custom fields               │
│  ...                               │
└────────────────────────────────────┘
│  AUDIO DATA                        │
│  (MP3 frames...)                   │
└────────────────────────────────────┘
```

**Common ID3v2 Frames:**

```
TIT2: Title
TPE1: Artist
TPE2: Album Artist
TALB: Album
TDRC: Recording Year
TCON: Genre
TRCK: Track Number
TPOS: Disc Number
COMM: Comments
APIC: Picture (cover art)
TXXX: User-defined text
USLT: Unsynchronized lyrics
```

**Leer ID3 con Node.js:**

```typescript
import NodeID3 from 'node-id3';

// Leer tags
const tags = NodeID3.read('./song.mp3');

console.log(tags);
/*
{
  title: "Song Title",
  artist: "Artist Name",
  album: "Album Name",
  year: "2025",
  genre: "Electronic",
  image: {
    mime: "image/jpeg",
    type: { id: 3, name: "front cover" },
    description: "",
    imageBuffer: Buffer
  }
}
*/

// Escribir tags
NodeID3.write({
  title: "New Song Title",
  artist: "New Artist",
  album: "New Album",
  year: "2025",
  genre: "Indie",
  image: "./cover.jpg",
}, './song.mp3');
```

---

#### 2. **Vorbis Comments (FLAC, OGG, Opus)**

**Características:**
- Basado en texto UTF-8
- Formato simple: `FIELD=value`
- Sin límite de fields
- Más flexible que ID3

**Estructura:**

```
TITLE=Song Title
ARTIST=Artist Name
ALBUM=Album Name
DATE=2025
GENRE=Electronic
TRACKNUMBER=1
ALBUMARTIST=Album Artist
DESCRIPTION=Song description
LYRICS=Full lyrics here...
BPM=128
KEY=Am
ISRC=US1234567890
CUSTOM_FIELD=Custom value
```

**Leer Vorbis Comments:**

```typescript
import { parseFile } from 'music-metadata';

const metadata = await parseFile('./song.flac');

console.log(metadata.common);
/*
{
  title: "Song Title",
  artist: "Artist Name",
  album: "Album Name",
  year: 2025,
  genre: ["Electronic"],
  track: { no: 1, of: 12 },
  picture: [{
    format: "image/jpeg",
    data: Buffer
  }]
}
*/

console.log(metadata.native['vorbis']);
/*
[
  { id: 'TITLE', value: 'Song Title' },
  { id: 'ARTIST', value: 'Artist Name' },
  { id: 'BPM', value: '128' },
  { id: 'KEY', value: 'Am' }
]
*/
```

---

#### 3. **MP4 Metadata (AAC, M4A)**

**Sistema:** iTunes-style atoms

**Common atoms:**

```
©nam: Title
©ART: Artist
©alb: Album
©day: Year
©gen: Genre
trkn: Track Number
disk: Disc Number
covr: Cover Art
©lyr: Lyrics
```

**Leer MP4 metadata:**

```typescript
import { parseFile } from 'music-metadata';

const metadata = await parseFile('./song.m4a');

console.log(metadata.common);
/*
{
  title: "Song Title",
  artist: "Artist Name",
  album: "Album Name",
  // ... similar a FLAC
}
*/
```

---

### Metadata Universal Parser

```typescript
import { parseFile, selectCover } from 'music-metadata';
import sharp from 'sharp';

async function extractMetadata(filePath: string) {
  const metadata = await parseFile(filePath);

  // Cover art
  const cover = selectCover(metadata.common.picture);
  let coverUrl = null;

  if (cover) {
    // Resize y upload cover
    const resized = await sharp(cover.data)
      .resize(800, 800, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload a Cloudinary, S3, etc
    coverUrl = await uploadCover(resized);
  }

  return {
    // Basic info
    title: metadata.common.title || 'Unknown',
    artist: metadata.common.artist || 'Unknown Artist',
    album: metadata.common.album || 'Unknown Album',
    year: metadata.common.year,
    genre: metadata.common.genre?.[0],

    // Track info
    trackNumber: metadata.common.track?.no,
    trackTotal: metadata.common.track?.of,
    discNumber: metadata.common.disk?.no,

    // Audio technical
    duration: metadata.format.duration, // seconds
    bitrate: metadata.format.bitrate,   // bits per second
    sampleRate: metadata.format.sampleRate,
    codec: metadata.format.codec,
    lossless: metadata.format.lossless,

    // Cover
    coverUrl,

    // Advanced
    bpm: metadata.common.bpm,
    key: metadata.common.key,
    isrc: metadata.common.isrc,
    lyrics: metadata.common.lyrics,
    comment: metadata.common.comment,
  };
}

// Usage
const info = await extractMetadata('./upload/song.mp3');
console.log(info);
```

### Metadata en Database

```typescript
// Drizzle schema
export const audios = pgTable('audios', {
  id: uuid('id').primaryKey(),

  // Basic metadata
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  album: text('album'),
  year: integer('year'),
  genre: text('genre'),

  // Track info
  trackNumber: integer('track_number'),
  trackTotal: integer('track_total'),
  discNumber: integer('disc_number'),

  // Technical
  duration: integer('duration'), // seconds
  bitrate: integer('bitrate'),
  sampleRate: integer('sample_rate'),
  codec: text('codec'),
  lossless: boolean('lossless').default(false),

  // URLs
  audioUrl: text('audio_url').notNull(),
  coverUrl: text('cover_url'),

  // Advanced
  bpm: integer('bpm'),
  musicalKey: text('musical_key'),
  isrc: text('isrc'), // International Standard Recording Code
  lyrics: text('lyrics'),

  // Loudness normalization
  measuredLUFS: real('measured_lufs'),
  replayGain: real('replay_gain'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Cover Art Best Practices

```typescript
async function processCoverArt(imageBuffer: Buffer) {
  // Generar múltiples tamaños
  const sizes = [
    { name: 'thumbnail', size: 150 },
    { name: 'small', size: 300 },
    { name: 'medium', size: 600 },
    { name: 'large', size: 1200 },
  ];

  const results = await Promise.all(
    sizes.map(async ({ name, size }) => {
      const resized = await sharp(imageBuffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({
          quality: 85,
          progressive: true,
        })
        .toBuffer();

      const url = await uploadToCloudinary(resized, `cover-${name}`);
      return { [name]: url };
    })
  );

  return Object.assign({}, ...results);
}

// Returns:
/*
{
  thumbnail: "https://cdn.com/cover-150.jpg",
  small: "https://cdn.com/cover-300.jpg",
  medium: "https://cdn.com/cover-600.jpg",
  large: "https://cdn.com/cover-1200.jpg"
}
*/
```

### Metadata Enrichment

Si metadata es incompleta, enriquecer con APIs:

```typescript
import MusicBrainz from 'musicbrainz-api';

async function enrichMetadata(basicInfo: { title: string; artist: string }) {
  // Buscar en MusicBrainz
  const mb = new MusicBrainz();
  const results = await mb.search('recording', {
    query: `${basicInfo.title} AND artist:${basicInfo.artist}`,
    limit: 1,
  });

  if (results.recordings.length > 0) {
    const recording = results.recordings[0];

    return {
      ...basicInfo,
      // Enriquecer con data oficial
      mbid: recording.id,
      album: recording.releases?.[0]?.title,
      year: recording.releases?.[0]?.date?.split('-')[0],
      isrc: recording.isrcs?.[0],
      duration: recording.length / 1000, // ms to seconds
    };
  }

  return basicInfo;
}
```

---

## Gapless Playback

### ¿Qué es Gapless Playback?

**Con gap (malo):**
```
Track 1: 🎵🎵🎵🎵 [SILENCIO 0.5s] 🎵🎵🎵🎵
Track 2: 🎵🎵🎵🎵 [SILENCIO 0.5s] 🎵🎵🎵🎵
```

**Gapless (bueno):**
```
Track 1: 🎵🎵🎵🎵🎵🎵🎵🎵
Track 2:             🎵🎵🎵🎵
                    ↑ Sin gap, transición perfecta
```

**Importante para:**
- Álbumes mixados (DJ sets, live albums)
- Classical music (movimientos continuos)
- Pink Floyd, Daft Punk, etc. (álbumes conceptuales)

### El Problema

HTML5 Audio tiene gap natural:
```javascript
audio1.addEventListener('ended', () => {
  audio2.play(); // ❌ Gap de ~200-500ms aquí
});
```

**Por qué existe el gap:**
1. Browser necesita tiempo para inicializar nuevo stream
2. Buffering inicial
3. Event loop delay

### Solución 1: Dual Audio Elements (Simple)

```typescript
class GaplessPlayer {
  private audio1: HTMLAudioElement;
  private audio2: HTMLAudioElement;
  private currentAudio: number = 1;
  private queue: string[] = [];

  constructor() {
    this.audio1 = new Audio();
    this.audio2 = new Audio();

    // Preload ambos
    this.audio1.preload = 'auto';
    this.audio2.preload = 'auto';

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.audio1.addEventListener('timeupdate', () => {
      // Cuando queda poco tiempo, preload next track
      const remaining = this.audio1.duration - this.audio1.currentTime;

      if (remaining < 5 && this.queue.length > 0) {
        // Preload next en audio2
        this.audio2.src = this.queue[0];
        this.audio2.load();
      }

      // Seamless switch cerca del final
      if (remaining < 0.5) {
        this.audio2.play();
      }
    });

    this.audio1.addEventListener('ended', () => {
      this.queue.shift();
      this.currentAudio = 2;
    });

    // Similar para audio2
    this.audio2.addEventListener('ended', () => {
      this.queue.shift();
      this.currentAudio = 1;
    });
  }

  play(url: string) {
    if (this.currentAudio === 1) {
      this.audio1.src = url;
      this.audio1.play();
    } else {
      this.audio2.src = url;
      this.audio2.play();
    }
  }

  addToQueue(url: string) {
    this.queue.push(url);
  }
}
```

### Solución 2: Web Audio API (Avanzado)

```typescript
class GaplessWebAudioPlayer {
  private audioContext: AudioContext;
  private currentSource: AudioBufferSourceNode | null = null;
  private nextSource: AudioBufferSourceNode | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();

  constructor() {
    this.audioContext = new AudioContext();
  }

  async loadTrack(url: string): Promise<AudioBuffer> {
    // Check cache
    if (this.buffers.has(url)) {
      return this.buffers.get(url)!;
    }

    // Fetch audio
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    // Decode
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    // Cache
    this.buffers.set(url, audioBuffer);

    return audioBuffer;
  }

  async play(url: string, nextUrl?: string) {
    const buffer = await this.loadTrack(url);

    // Create source
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);

    // Start playback
    source.start(0);
    this.currentSource = source;

    // Preload next track
    if (nextUrl) {
      this.nextSource = await this.createSource(nextUrl);

      // Schedule next track to start when current ends
      const currentEndTime = this.audioContext.currentTime + buffer.duration;
      this.nextSource.start(currentEndTime);
    }

    // Cleanup when ended
    source.addEventListener('ended', () => {
      this.currentSource = this.nextSource;
      this.nextSource = null;
    });
  }

  private async createSource(url: string): Promise<AudioBufferSourceNode> {
    const buffer = await this.loadTrack(url);
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    return source;
  }
}

// Usage
const player = new GaplessWebAudioPlayer();
await player.play(
  'https://cdn.com/track1.mp3',
  'https://cdn.com/track2.mp3'  // Auto-start cuando track1 termina
);
```

### Solución 3: Librería - Gapless 5

```bash
npm install @regosen/gapless-5
```

```typescript
import { Gapless5 } from '@regosen/gapless-5';

const player = new Gapless5({
  tracks: [
    'https://cdn.com/track1.mp3',
    'https://cdn.com/track2.mp3',
    'https://cdn.com/track3.mp3',
  ],
  loop: false,
  playbackRate: 1.0,
  exclusive: true, // Stop other audio on page
  crossfade: 50,   // 50ms crossfade (opcional)
});

// Controls
player.play();
player.pause();
player.next();
player.prev();
player.gotoTrack(2); // Jump to track index
```

### Gapless con HLS

HLS tiene gapless built-in si está bien encodado:

```bash
# FFmpeg: Encode sin padding
ffmpeg -i input.mp3 \
  -c:a aac \
  -b:a 256k \
  -avoid_negative_ts make_zero \  # Importante para gapless
  -f hls \
  -hls_time 10 \
  -hls_playlist_type vod \
  output.m3u8
```

### React Hook para Gapless

```typescript
import { useState, useRef, useEffect } from 'react';

export function useGaplessPlayer(tracks: string[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audio1 = useRef<HTMLAudioElement>(null);
  const audio2 = useRef<HTMLAudioElement>(null);
  const currentAudioRef = useRef<1 | 2>(1);

  useEffect(() => {
    if (!audio1.current || !audio2.current) return;

    const current = currentAudioRef.current === 1 ? audio1.current : audio2.current;
    const next = currentAudioRef.current === 1 ? audio2.current : audio1.current;

    current.addEventListener('timeupdate', () => {
      const remaining = current.duration - current.currentTime;

      // Preload next track
      if (remaining < 5 && currentIndex < tracks.length - 1) {
        next.src = tracks[currentIndex + 1];
        next.load();
      }

      // Seamless transition
      if (remaining < 0.3 && currentIndex < tracks.length - 1) {
        next.play();
        setIsPlaying(true);
      }
    });

    current.addEventListener('ended', () => {
      setCurrentIndex(i => i + 1);
      currentAudioRef.current = currentAudioRef.current === 1 ? 2 : 1;
    });
  }, [currentIndex, tracks]);

  const play = () => {
    const current = currentAudioRef.current === 1 ? audio1.current : audio2.current;
    current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audio1.current?.pause();
    audio2.current?.pause();
    setIsPlaying(false);
  };

  return {
    audio1,
    audio2,
    currentIndex,
    isPlaying,
    play,
    pause,
  };
}

// Component
function GaplessPlayerComponent({ tracks }: { tracks: string[] }) {
  const { audio1, audio2, currentIndex, isPlaying, play, pause } =
    useGaplessPlayer(tracks);

  return (
    <div>
      <audio ref={audio1} preload="auto" />
      <audio ref={audio2} preload="auto" />

      <p>Now playing: {tracks[currentIndex]}</p>
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
```

---

## Crossfade & Audio Transitions

### ¿Qué es Crossfade?

**Sin crossfade:**
```
Track 1: 🎵🎵🎵🎵 [STOP]
Track 2:                   [START] 🎵🎵🎵🎵
```

**Con crossfade:**
```
Track 1: 🎵🎵🎵🎵📉📉📉
Track 2:         📈📈📈🎵🎵🎵🎵
                 ↑ Overlap
```

### Web Audio API Crossfade

```typescript
class CrossfadePlayer {
  private audioContext: AudioContext;
  private currentGain: GainNode;
  private nextGain: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.currentGain = this.audioContext.createGain();
    this.nextGain = this.audioContext.createGain();

    // Connect to destination
    this.currentGain.connect(this.audioContext.destination);
    this.nextGain.connect(this.audioContext.destination);

    // Initial gains
    this.currentGain.gain.value = 1.0;
    this.nextGain.gain.value = 0.0;
  }

  crossfade(duration: number = 3) {
    const now = this.audioContext.currentTime;

    // Fade out current track
    this.currentGain.gain.linearRampToValueAtTime(1.0, now);
    this.currentGain.gain.linearRampToValueAtTime(0.0, now + duration);

    // Fade in next track
    this.nextGain.gain.linearRampToValueAtTime(0.0, now);
    this.nextGain.gain.linearRampToValueAtTime(1.0, now + duration);

    // Swap references after fade completes
    setTimeout(() => {
      [this.currentGain, this.nextGain] = [this.nextGain, this.currentGain];
    }, duration * 1000);
  }

  // Exponential crossfade (more natural)
  exponentialCrossfade(duration: number = 3) {
    const now = this.audioContext.currentTime;

    // Exponential is more natural to human ear
    this.currentGain.gain.exponentialRampToValueAtTime(1.0, now + 0.001);
    this.currentGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    this.nextGain.gain.exponentialRampToValueAtTime(0.001, now + 0.001);
    this.nextGain.gain.exponentialRampToValueAtTime(1.0, now + duration);
  }

  // Equal power crossfade (best quality)
  equalPowerCrossfade(duration: number = 3) {
    const now = this.audioContext.currentTime;
    const steps = 100;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      const time = now + (i * stepDuration);
      const position = i / steps;

      // Equal power curve
      const currentGain = Math.cos(position * Math.PI / 2);
      const nextGain = Math.sin(position * Math.PI / 2);

      this.currentGain.gain.linearRampToValueAtTime(currentGain, time);
      this.nextGain.gain.linearRampToValueAtTime(nextGain, time);
    }
  }
}
```

### Spotify-style Auto Crossfade

```typescript
class AutoCrossfadePlayer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private crossfadeDuration: number = 3; // seconds

  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
  }

  // Detectar "loudness" del final del track
  async detectOutroLoudness(audioBuffer: AudioBuffer): Promise<number> {
    // Analizar últimos 10 segundos
    const sampleRate = audioBuffer.sampleRate;
    const outroLength = 10 * sampleRate;
    const start = Math.max(0, audioBuffer.length - outroLength);

    const channel = audioBuffer.getChannelData(0);
    let sum = 0;

    for (let i = start; i < audioBuffer.length; i++) {
      sum += Math.abs(channel[i]);
    }

    return sum / outroLength;
  }

  // Detectar "loudness" del inicio del track
  async detectIntroLoudness(audioBuffer: AudioBuffer): Promise<number> {
    // Analizar primeros 10 segundos
    const sampleRate = audioBuffer.sampleRate;
    const introLength = Math.min(audioBuffer.length, 10 * sampleRate);

    const channel = audioBuffer.getChannelData(0);
    let sum = 0;

    for (let i = 0; i < introLength; i++) {
      sum += Math.abs(channel[i]);
    }

    return sum / introLength;
  }

  // Calcular duración óptima de crossfade
  calculateOptimalCrossfade(
    outroLoudness: number,
    introLoudness: number
  ): number {
    // Si ambos tracks son loud, crossfade corto
    if (outroLoudness > 0.3 && introLoudness > 0.3) {
      return 2; // 2 seconds
    }

    // Si uno es quiet, crossfade largo
    if (outroLoudness < 0.1 || introLoudness < 0.1) {
      return 5; // 5 seconds
    }

    // Default
    return 3; // 3 seconds
  }
}
```

### Crossfade Settings (como Spotify)

```typescript
interface CrossfadeSettings {
  enabled: boolean;
  duration: number;  // 0-12 seconds
  mode: 'linear' | 'exponential' | 'equalPower';
  autoAdjust: boolean; // Ajustar basado en contenido
}

const defaultSettings: CrossfadeSettings = {
  enabled: true,
  duration: 3,
  mode: 'equalPower',
  autoAdjust: true,
};

// UI Component
function CrossfadeSettings({ settings, onChange }: Props) {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(e) => onChange({ ...settings, enabled: e.target.checked })}
        />
        Enable Crossfade
      </label>

      {settings.enabled && (
        <>
          <label>
            Duration: {settings.duration}s
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={settings.duration}
              onChange={(e) =>
                onChange({ ...settings, duration: parseFloat(e.target.value) })
              }
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.autoAdjust}
              onChange={(e) =>
                onChange({ ...settings, autoAdjust: e.target.checked })
              }
            />
            Auto-adjust based on song
          </label>
        </>
      )}
    </div>
  );
}
```

### React Hook para Crossfade

```typescript
import { useRef, useCallback } from 'react';

export function useCrossfade(duration: number = 3) {
  const audioContext = useRef<AudioContext | null>(null);
  const currentGain = useRef<GainNode | null>(null);
  const nextGain = useRef<GainNode | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
      currentGain.current = audioContext.current.createGain();
      nextGain.current = audioContext.current.createGain();

      currentGain.current.connect(audioContext.current.destination);
      nextGain.current.connect(audioContext.current.destination);

      currentGain.current.gain.value = 1.0;
      nextGain.current.gain.value = 0.0;
    }
  }, []);

  const crossfade = useCallback(() => {
    if (!audioContext.current || !currentGain.current || !nextGain.current) {
      return;
    }

    const now = audioContext.current.currentTime;

    // Equal power crossfade
    const steps = 100;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
      const time = now + (i * stepDuration);
      const position = i / steps;

      const currentValue = Math.cos(position * Math.PI / 2);
      const nextValue = Math.sin(position * Math.PI / 2);

      currentGain.current.gain.setValueAtTime(currentValue, time);
      nextGain.current.gain.setValueAtTime(nextValue, time);
    }

    // Swap
    setTimeout(() => {
      if (currentGain.current && nextGain.current) {
        [currentGain.current, nextGain.current] = [
          nextGain.current,
          currentGain.current,
        ];
      }
    }, duration * 1000);
  }, [duration]);

  return {
    initAudioContext,
    crossfade,
    audioContext: audioContext.current,
    currentGain: currentGain.current,
    nextGain: nextGain.current,
  };
}
```

---

*Continuaré con los conceptos restantes en la siguiente parte...*

## Audio Fingerprinting & Content ID

### ¿Qué es Audio Fingerprinting?

**Audio Fingerprinting** = Crear una "huella digital" única de un audio

Similar a huellas dactilares humanas:
- Cada audio tiene firma única
- Permite identificar canciones
- Detectar duplicados
- Content matching (derechos de autor)

### Usos Principales

**1. Music Recognition (Shazam-like)**
```
Usuario: *reproduce canción*
App: "Esta canción es 'Blinding Lights' por The Weeknd"
```

**2. Duplicate Detection**
```
Usuario: *sube canción*
Sistema: "Esta canción ya existe en la plataforma"
```

**3. Copyright Detection (Content ID)**
```
Usuario: *sube canción copyrighted*
Sistema: "Esta canción está protegida por derechos de autor"
```

**4. Playlist Matching**
```
Usuario: "Importar playlist de Spotify"
Sistema: *Identifica canciones por fingerprint*
```

### Cómo Funciona

```
┌───────────────────────────────────────────────────┐
│  1. AUDIO ORIGINAL                                │
│     [waveform: 🎵🎵🎵🎵]                           │
└───────────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────────┐
│  2. ANÁLISIS DE FRECUENCIAS                       │
│     • FFT (Fast Fourier Transform)                │
│     • Detecta peaks en spectrum                   │
│     • Cada 0.125 segundos                         │
└───────────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────────┐
│  3. EXTRACCIÓN DE FEATURES                        │
│     • Frequency peaks                             │
│     • Spectral patterns                           │
│     • Temporal characteristics                    │
└───────────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────────┐
│  4. FINGERPRINT (Hash)                            │
│     • Compacto: ~2-5 KB                           │
│     • Ejemplo: "a3f5c2d9e1b8..."                  │
└───────────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────────┐
│  5. ALMACENAR EN DATABASE                         │
│     • Indexed para búsqueda rápida                │
│     • Match contra millones de fingerprints       │
└───────────────────────────────────────────────────┘
```

### Chromaprint (AcoustID) - Open Source

**Chromaprint** es el algoritmo de fingerprinting más popular open source.

**Características:**
- ✅ Rápido: <100ms para procesar canción de 2 min
- ✅ Compacto: ~2.5 KB por canción
- ✅ Robusto: Resiste compression, noise, etc
- ✅ Gratis: 100% open source

#### Instalación

```bash
# Install fpcalc (fingerprint calculator)
# macOS
brew install chromaprint

# Ubuntu/Debian
sudo apt-get install libchromaprint-tools

# Node.js library
npm install fpcalc
```

#### Generar Fingerprint

```bash
# Command line
fpcalc song.mp3

# Output:
# DURATION=180
# FINGERPRINT=AQADtNQSJUpYLOmRH4cO...
```

```typescript
import fpcalc from 'fpcalc';

// Generate fingerprint
const result = await fpcalc('./song.mp3');

console.log(result);
/*
{
  duration: 180.5,
  fingerprint: "AQADtNQSJUpYLOmRH4cO...",
  file: "./song.mp3"
}
*/
```

#### Match contra AcoustID Database

```typescript
import axios from 'axios';

const ACOUSTID_API_KEY = 'your-api-key';

async function identifySong(fingerprint: string, duration: number) {
  const response = await axios.get('https://api.acoustid.org/v2/lookup', {
    params: {
      client: ACOUSTID_API_KEY,
      fingerprint,
      duration: Math.round(duration),
      meta: 'recordings releasegroups',
    },
  });

  if (response.data.results.length > 0) {
    const result = response.data.results[0];
    const recording = result.recordings?.[0];

    return {
      id: result.id,
      score: result.score, // 0-1 confidence
      title: recording?.title,
      artists: recording?.artists?.map((a: any) => a.name),
      releasegroups: recording?.releasegroups,
    };
  }

  return null;
}

// Usage
const fp = await fpcalc('./unknown-song.mp3');
const match = await identifySong(fp.fingerprint, fp.duration);

if (match && match.score > 0.8) {
  console.log(`Song identified: ${match.title} by ${match.artists.join(', ')}`);
} else {
  console.log('Song not found');
}
```

### Implementación Custom (Sin AcoustID)

Para matching interno (duplicados en tu plataforma):

```typescript
import fpcalc from 'fpcalc';
import { db } from './db';

// Schema
export const audioFingerprints = pgTable('audio_fingerprints', {
  id: uuid('id').primaryKey(),
  audioId: uuid('audio_id').references(() => audios.id),
  fingerprint: text('fingerprint').notNull(),
  duration: real('duration').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Index para búsqueda rápida
// CREATE INDEX idx_fingerprint ON audio_fingerprints USING hash(fingerprint);

// Generar y guardar fingerprint al subir audio
async function processAudioUpload(filePath: string, audioId: string) {
  // Generate fingerprint
  const fp = await fpcalc(filePath);

  // Save to database
  await db.insert(audioFingerprints).values({
    id: crypto.randomUUID(),
    audioId,
    fingerprint: fp.fingerprint,
    duration: fp.duration,
  });
}

// Detectar duplicados
async function findDuplicates(fingerprint: string): Promise<string[]> {
  const results = await db
    .select()
    .from(audioFingerprints)
    .where(eq(audioFingerprints.fingerprint, fingerprint));

  return results.map(r => r.audioId);
}

// Check antes de procesar upload
async function checkDuplicate(filePath: string): Promise<boolean> {
  const fp = await fpcalc(filePath);
  const duplicates = await findDuplicates(fp.fingerprint);

  if (duplicates.length > 0) {
    console.log('Duplicate found! Already exists:', duplicates);
    return true;
  }

  return false;
}
```

### Fuzzy Matching (Similar pero no idéntico)

```typescript
// Hamming distance para comparar fingerprints
function hammingDistance(fp1: string, fp2: string): number {
  let distance = 0;

  for (let i = 0; i < Math.min(fp1.length, fp2.length); i++) {
    if (fp1[i] !== fp2[i]) distance++;
  }

  return distance;
}

// Encontrar canciones similares (no exactas)
async function findSimilarAudios(
  fingerprint: string,
  threshold: number = 0.1
): Promise<Array<{ audioId: string; similarity: number }>> {
  // Get all fingerprints
  const allFingerprints = await db.select().from(audioFingerprints);

  const results = allFingerprints
    .map(fp => {
      const distance = hammingDistance(fingerprint, fp.fingerprint);
      const similarity = 1 - (distance / fingerprint.length);

      return {
        audioId: fp.audioId,
        similarity,
      };
    })
    .filter(r => r.similarity >= 1 - threshold)
    .sort((a, b) => b.similarity - a.similarity);

  return results;
}

// Usage
const similar = await findSimilarAudios(newFingerprint, 0.05);
// Returns canciones con >95% similarity
```

### Content ID System (Como YouTube)

```typescript
interface ContentMatch {
  audioId: string;
  matchedAudioId: string;
  similarity: number;
  action: 'block' | 'monetize' | 'allow';
  owner: string;
}

async function contentIDCheck(
  uploadedFilePath: string,
  uploaderId: string
): Promise<ContentMatch | null> {
  // 1. Generate fingerprint
  const fp = await fpcalc(uploadedFilePath);

  // 2. Check database de contenido protegido
  const protectedContent = await db
    .select()
    .from(audioFingerprints)
    .innerJoin(audios, eq(audioFingerprints.audioId, audios.id))
    .where(eq(audios.protected, true));

  // 3. Compare fingerprints
  for (const content of protectedContent) {
    const distance = hammingDistance(fp.fingerprint, content.fingerprint);
    const similarity = 1 - (distance / fp.fingerprint.length);

    // Match encontrado (>90% similar)
    if (similarity > 0.9) {
      // Check si uploader es el owner
      if (content.audios.ownerId === uploaderId) {
        return null; // Es su propio contenido, allow
      }

      return {
        audioId: content.audios.id,
        matchedAudioId: content.audioFingerprints.audioId,
        similarity,
        action: content.audios.contentIdAction, // de DB
        owner: content.audios.ownerId,
      };
    }
  }

  return null; // No match
}

// En upload endpoint
app.post('/upload', async (req, res) => {
  const match = await contentIDCheck(req.file.path, req.user.id);

  if (match) {
    if (match.action === 'block') {
      return res.status(403).json({
        error: 'This content is copyrighted and cannot be uploaded',
        match,
      });
    } else if (match.action === 'monetize') {
      // Allow upload pero revenue va al owner original
      await createRevenueShare(match.owner, req.user.id);
    }
  }

  // Continue con upload...
});
```

### Shazam-like Recognition

```typescript
class AudioRecognition {
  async recordAndIdentify(durationSeconds: number = 10): Promise<string | null> {
    // 1. Record audio from microphone
    const recording = await this.recordAudio(durationSeconds);

    // 2. Save temporary file
    const tempFile = '/tmp/recording.wav';
    await fs.promises.writeFile(tempFile, recording);

    // 3. Generate fingerprint
    const fp = await fpcalc(tempFile);

    // 4. Query AcoustID
    const match = await identifySong(fp.fingerprint, fp.duration);

    // 5. Cleanup
    await fs.promises.unlink(tempFile);

    if (match && match.score > 0.8) {
      return `${match.title} - ${match.artists.join(', ')}`;
    }

    return null;
  }

  private async recordAudio(duration: number): Promise<Buffer> {
    // Use Web Audio API getUserMedia
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    return new Promise((resolve) => {
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks);
        const arrayBuffer = await blob.arrayBuffer();
        resolve(Buffer.from(arrayBuffer));
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), duration * 1000);
    });
  }
}
```

### Recomendación para Ampli

```
FASE 1 (MVP):
• Chromaprint para detectar duplicados en uploads
• Guardar fingerprints en database
• Match exacto (100% igual) para prevenir duplicados

FASE 2 (Crecimiento):
• Integrar AcoustID para metadata enrichment
• Fuzzy matching para detectar re-uploads
• Content ID básico para contenido protegido

FASE 3 (Avanzado):
• Sistema Content ID completo
• Revenue sharing automático
• Music recognition (Shazam-like feature)
```

---

## Waveform Visualization

### ¿Por qué Waveform?

**Beneficios:**
- ✅ Usuario ve estructura de la canción
- ✅ Navegación visual (seek)
- ✅ Profesional look (SoundCloud-style)
- ✅ Preview antes de play

**Ejemplo:**
```
SoundCloud:
[████▓▓▓▓████▓▓▓▓████▓▓▓▓████] ← Waveform
      ↑ Usuario puede click aquí para seek
```

### Tipos de Visualization

#### 1. **Waveform (Time Domain)**

Muestra amplitud en el tiempo:
```
     █
    ███
   █████
  ███████    █
 █████████  ███
███████████████
```

#### 2. **Spectrum (Frequency Domain)**

Muestra frecuencias:
```
█               ← Bass
██
███             ← Mids
████
█████           ← Highs
██████
```

#### 3. **Spectrogram**

2D: Tiempo (X) + Frecuencia (Y) + Loudness (Color)
```
     High freq ████▓▓▓▓████
     Mid freq  ████████████
     Low freq  ████████████
               ↑   ↑   ↑
              Time →
```

### Generar Waveform Data

#### Server-Side (FFmpeg)

```bash
# Generar waveform data (JSON)
ffmpeg -i song.mp3 \
  -filter_complex "showwavespic=s=1800x200:colors=blue" \
  -frames:v 1 \
  waveform.png

# O generar data points (para JSON)
ffmpeg -i song.mp3 \
  -af "astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-" \
  -f null - \
  2>&1 | grep RMS_level > waveform-data.txt
```

#### Node.js con Audiowaveform

```bash
npm install audiowaveform
```

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generateWaveformData(
  inputPath: string,
  outputPath: string,
  width: number = 1800
): Promise<void> {
  await execAsync(
    `audiowaveform -i ${inputPath} -o ${outputPath} -w ${width} -b 8`
  );
}

// Usage
await generateWaveformData(
  './song.mp3',
  './song-waveform.json',
  1800
);

// Output JSON:
/*
{
  "version": 2,
  "channels": 2,
  "sample_rate": 44100,
  "samples_per_pixel": 512,
  "bits": 8,
  "length": 1800,
  "data": [0, 45, 78, 123, 89, 45, ...]  // Peak values
}
*/
```

### Client-Side Visualization

#### Canvas-based Waveform

```typescript
class WaveformRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private waveformData: number[];
  private color: string = '#1DB954'; // Spotify green

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  async loadWaveformData(url: string) {
    const response = await fetch(url);
    const json = await response.json();
    this.waveformData = json.data;
    this.render();
  }

  render() {
    const { width, height } = this.canvas;
    const barWidth = width / this.waveformData.length;
    const center = height / 2;

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = this.color;

    this.waveformData.forEach((value, i) => {
      const barHeight = (value / 255) * center;
      const x = i * barWidth;

      // Draw bar (symmetric)
      this.ctx.fillRect(x, center - barHeight, barWidth - 1, barHeight * 2);
    });
  }

  renderWithProgress(progressPercent: number) {
    const { width, height } = this.canvas;
    const barWidth = width / this.waveformData.length;
    const center = height / 2;
    const progressX = (width * progressPercent) / 100;

    this.ctx.clearRect(0, 0, width, height);

    this.waveformData.forEach((value, i) => {
      const barHeight = (value / 255) * center;
      const x = i * barWidth;

      // Color depends on progress
      this.ctx.fillStyle = x < progressX ? '#1DB954' : '#535353';

      this.ctx.fillRect(x, center - barHeight, barWidth - 1, barHeight * 2);
    });
  }

  // Click to seek
  handleClick(event: MouseEvent, audioDuration: number): number {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / this.canvas.width;
    return audioDuration * percent;
  }
}

// Usage
const canvas = document.getElementById('waveform') as HTMLCanvasElement;
const waveform = new WaveformRenderer(canvas);

await waveform.loadWaveformData('/api/waveform/song-123.json');

// Update on timeupdate
audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  waveform.renderWithProgress(progress);
});

// Seek on click
canvas.addEventListener('click', (e) => {
  const seekTime = waveform.handleClick(e, audio.duration);
  audio.currentTime = seekTime;
});
```

#### React Component

```typescript
import { useEffect, useRef } from 'react';

interface WaveformProps {
  waveformUrl: string;
  audioElement: HTMLAudioElement;
  color?: string;
}

export function Waveform({ waveformUrl, audioElement, color = '#1DB954' }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveformRef = useRef<WaveformRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    waveformRef.current = new WaveformRenderer(canvasRef.current);
    waveformRef.current.loadWaveformData(waveformUrl);
  }, [waveformUrl]);

  useEffect(() => {
    const updateProgress = () => {
      if (!waveformRef.current || !audioElement) return;

      const progress = (audioElement.currentTime / audioElement.duration) * 100;
      waveformRef.current.renderWithProgress(progress);
    };

    audioElement.addEventListener('timeupdate', updateProgress);

    return () => {
      audioElement.removeEventListener('timeupdate', updateProgress);
    };
  }, [audioElement]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!waveformRef.current || !audioElement) return;

    const seekTime = waveformRef.current.handleClick(
      e.nativeEvent,
      audioElement.duration
    );
    audioElement.currentTime = seekTime;
  };

  return (
    <canvas
      ref={canvasRef}
      width={1800}
      height={200}
      onClick={handleClick}
      style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
    />
  );
}
```

### WebGL Waveform (High Performance)

Para muchas waveforms (playlist view):

```typescript
import * as THREE from 'three';

class WebGLWaveformRenderer {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private geometry: THREE.BufferGeometry;

  constructor(container: HTMLElement) {
    // Setup Three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
  }

  renderWaveform(data: number[], color: string = '#1DB954') {
    // Convert waveform data to vertices
    const vertices = new Float32Array(data.length * 6);

    data.forEach((value, i) => {
      const x = (i / data.length) * 2 - 1;
      const y = (value / 255) * 0.8;

      // Two triangles per bar
      vertices[i * 6] = x;
      vertices[i * 6 + 1] = -y;
      vertices[i * 6 + 2] = x;
      vertices[i * 6 + 3] = y;
      vertices[i * 6 + 4] = x + 0.001;
      vertices[i * 6 + 5] = y;
    });

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(this.geometry, material);

    this.scene.add(mesh);
    this.renderer.render(this.scene, this.camera);
  }
}
```

### Peaks.js (Library Recomendada)

```bash
npm install peaks.js
```

```typescript
import Peaks from 'peaks.js';

const options = {
  containers: {
    overview: document.getElementById('overview-waveform'),
    zoomview: document.getElementById('zoomview-waveform'),
  },
  mediaElement: document.getElementById('audio'),
  webAudio: {
    audioContext: new AudioContext(),
  },
  // O pre-generado:
  dataUri: {
    json: '/waveform/song-123.json',
  },
};

Peaks.init(options, (err, peaks) => {
  if (err) {
    console.error(err);
    return;
  }

  // Add segment (chorus, verse, etc)
  peaks.segments.add({
    startTime: 30,
    endTime: 60,
    labelText: 'Chorus',
    color: '#FF0000',
  });

  // Add point (drop, transition)
  peaks.points.add({
    time: 45,
    labelText: 'Drop',
    color: '#00FF00',
  });
});
```

### Recomendación para Ampli

```
FASE 1 (MVP):
• Generar waveform data server-side (audiowaveform)
• Canvas rendering simple
• Click to seek

FASE 2:
• Peaks.js para features avanzadas
• Segments (intro, chorus, outro)
• Zoom in/out

FASE 3:
• WebGL para rendering de 100+ waveforms
• Real-time waveform durante playback
• Spectrogram view
```

---

## Resumen Final

He cubierto TODO lo que necesitas saber sobre audio streaming profesional:

1. ✅ **Codecs**: AAC, Opus, MP3, FLAC comparados
2. ✅ **Normalization**: LUFS, ReplayGain, loudness
3. ✅ **DRM**: Widevine, FairPlay, PlayReady
4. ✅ **CDN**: Caching strategies, edge servers
5. ✅ **Metadata**: ID3, Vorbis Comments
6. ✅ **Gapless Playback**: Implementaciones
7. ✅ **Crossfade**: Web Audio API techniques
8. ✅ **Fingerprinting**: Chromaprint, Content ID
9. ✅ **Waveform**: Visualization techniques

¿Quieres que profundice en algún tema específico o continúo con más conceptos?
