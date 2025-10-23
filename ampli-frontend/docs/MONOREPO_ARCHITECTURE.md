# Amplifier (Ampli) - Arquitectura Monorepo

> **Nombre del proyecto:** Ampli / Amplifier
> **Estado:** En desarrollo - Fase inicial (frontend standalone)
> **Migración a monorepo:** Planificada después de implementar funcionalidad core (auth, player)

## Visión General

Ampli es una aplicación de música/podcast similar a Spotify, SoundCloud y Tidal, con arquitectura de monorepo para compartir código entre múltiples plataformas.

## Estructura Objetivo del Monorepo

```
ampli/
├── packages/
│   ├── mobile/              # React Native (Expo) - iOS & Android
│   │   ├── app/             # Expo Router
│   │   ├── components/
│   │   │   ├── player/      # 🎵 Custom player components
│   │   │   ├── waveform/    # 📊 Custom waveform visualizations
│   │   │   ├── playlist/    # 📝 Playlist UI
│   │   │   ├── auth/        # 🔐 Authentication flows
│   │   │   └── shared/      # Tamagui-based shared components
│   │   └── tamagui.config.ts
│   │
│   ├── web/                 # Web app (Next.js/Vite) - FUTURO
│   │   ├── app/
│   │   ├── components/
│   │   └── tamagui.config.ts
│   │
│   ├── shared/              # 📦 Código compartido mobile/web
│   │   ├── components/      # UI components cross-platform
│   │   │   ├── ui/          # Botones, Cards, Inputs (Tamagui)
│   │   │   └── audio/       # Player controls compartidos
│   │   ├── hooks/           # React hooks
│   │   │   ├── useAudioPlayer.ts
│   │   │   ├── usePlaylist.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useWaveform.ts
│   │   ├── utils/           # Utility functions
│   │   │   ├── audio.ts
│   │   │   ├── format.ts
│   │   │   └── api.ts
│   │   ├── types/           # TypeScript types
│   │   │   ├── audio.ts
│   │   │   ├── user.ts
│   │   │   └── playlist.ts
│   │   ├── config/          # Configuración compartida
│   │   │   └── tamagui.base.ts
│   │   └── package.json
│   │
│   └── backend/             # Backend (Express/Fastify/NestJS)
│       ├── src/
│       │   ├── auth/
│       │   ├── audio/
│       │   ├── users/
│       │   └── playlists/
│       └── package.json
│
├── pnpm-workspace.yaml      # Workspace configuration
├── package.json             # Root package
├── tsconfig.base.json       # Shared TypeScript config
└── README.md
```

## Stack Tecnológico

### Frontend (Mobile)
- **Framework:** React Native + Expo 54
- **Navegación:** Expo Router 6
- **UI Framework:** Tamagui 1.135+ (híbrido con componentes custom)
- **Fuentes:** Geist (Vercel)
- **Iconos:** Lucide Icons (@tamagui/lucide-icons)
- **Animaciones:** React Native Reanimated 4
- **Gestos:** React Native Gesture Handler 2
- **Audio:** TBD (react-native-track-player / expo-av)

### Frontend (Web) - FUTURO
- **Framework:** Next.js 15 / Vite + React
- **UI:** Tamagui (compartido con mobile)
- **Audio:** Howler.js / Web Audio API

### Shared
- **Lenguaje:** TypeScript 5.9+
- **State Management:** TBD (Zustand / Jotai / TanStack Query)
- **API Client:** TBD (Axios / Fetch / tRPC)

### Backend
- **Runtime:** Node.js
- **Framework:** TBD (Express / Fastify / NestJS)
- **Database:** TBD (PostgreSQL / MongoDB)
- **ORM:** TBD (Prisma / Drizzle / TypeORM)
- **Auth:** TBD (JWT / NextAuth)
- **Storage:** TBD (Cloudinary / S3)

## Filosofía de Componentes

### Tamagui (UI General)
Usado para componentes de layout y UI estándar:
- ✅ Layouts: `XStack`, `YStack`, `ZStack`
- ✅ Textos: `H1`, `H2`, `H3`, `Paragraph`, `Text`
- ✅ Inputs: `Input`, `TextArea`, `Select`, `Switch`
- ✅ Botones: `Button` (básicos)
- ✅ Cards y contenedores: `Card`, `Sheet`, `Dialog`
- ✅ Navegación: Tabs, Lists

### Custom (Componentes Críticos)
Construidos desde cero para máximo control:
- 🎵 **Audio Player:** Player principal con controles avanzados
- 📊 **Waveform:** Visualizaciones de audio
- 🎨 **Animaciones específicas:** Transiciones de pantalla, gestos
- 📝 **Listas de reproducción:** Drag & drop, swipe actions
- 🎚️ **Controles de audio:** Sliders personalizados, ecualizador

## Fases de Desarrollo

### ✅ Fase 0: Setup Inicial (COMPLETADO)
- [x] Configurar Tamagui
- [x] Integrar Geist font
- [x] Configurar Lucide Icons
- [x] Setup Babel + Reanimated

### 🔄 Fase 1: Funcionalidad Core (EN PROGRESO)
- [ ] Sistema de autenticación
- [ ] Player de audio básico
- [ ] Lista de canciones/podcasts
- [ ] Perfiles de usuario

### 📋 Fase 2: Migración a Monorepo
- [ ] Crear estructura de packages
- [ ] Configurar pnpm workspaces
- [ ] Mover código compartido a `/shared`
- [ ] Setup TypeScript paths
- [ ] Configurar build pipeline

### 🚀 Fase 3: Features Avanzadas
- [ ] Playlists con drag & drop
- [ ] Waveform visualization
- [ ] Animaciones avanzadas
- [ ] Sincronización offline
- [ ] Web app (opcional)

## Configuración del Monorepo (FUTURO)

### pnpm-workspace.yaml
```yaml
packages:
  - "packages/*"
  - "packages/mobile"
  - "packages/web"
  - "packages/shared"
  - "packages/backend"
```

### Root package.json
```json
{
  "name": "ampli",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:mobile": "pnpm --filter @ampli/mobile dev",
    "dev:web": "pnpm --filter @ampli/web dev",
    "dev:backend": "pnpm --filter @ampli/backend dev",
    "dev:all": "pnpm --parallel dev",
    "build": "pnpm --recursive build",
    "lint": "pnpm --recursive lint",
    "test": "pnpm --recursive test",
    "typecheck": "pnpm --recursive typecheck"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "typescript": "~5.9.2",
    "prettier": "^3.0.0",
    "eslint": "^9.25.0"
  }
}
```

### TypeScript Configuration

**tsconfig.base.json** (root)
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "esnext",
    "lib": ["esnext"],
    "jsx": "react-jsx",
    "paths": {
      "@ampli/shared": ["./packages/shared/src"],
      "@ampli/shared/*": ["./packages/shared/src/*"]
    }
  }
}
```

## Compartir Código Entre Packages

### Ejemplo: Hook de Audio Compartido

**packages/shared/hooks/useAudioPlayer.ts**
```typescript
import { useState, useCallback } from 'react';

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = useCallback(() => {
    // Platform-specific implementation
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
  };
}
```

**Uso en mobile:**
```typescript
import { useAudioPlayer } from '@ampli/shared/hooks/useAudioPlayer';
```

**Uso en web:**
```typescript
import { useAudioPlayer } from '@ampli/shared/hooks/useAudioPlayer';
```

## Ventajas del Monorepo

✅ **Código compartido:** Hooks, utils, types compartidos
✅ **Consistencia:** Mismo UI system (Tamagui) en todas las plataformas
✅ **Desarrollo rápido:** Cambios en shared se reflejan en todos los packages
✅ **TypeScript end-to-end:** Types compartidos entre frontend y backend
✅ **Deploy atómico:** Versionar y deployar juntos
✅ **DX mejorado:** Un solo `pnpm install`, comandos centralizados

## Referencias

- **Inspiración:** [Exa by Exactly](https://github.com/exactly/exa) - DeFi app con Tamagui + monorepo
- **Tamagui Docs:** https://tamagui.dev
- **pnpm Workspaces:** https://pnpm.io/workspaces

---

**Última actualización:** 2025-10-23
**Estado:** Documento de planificación - Implementación pendiente
