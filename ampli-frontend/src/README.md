# Source Code Structure

This project follows Expo 2025 best practices for folder organization.

## 📁 Directory Structure

```
src/
├── app/                    # 🎯 Expo Router - ROUTES ONLY
│   ├── (tabs)/            # Tab navigation group
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screen
│
├── components/            # 🎨 Reusable UI Components
│   ├── ui/               # Base UI components (buttons, inputs, themed components)
│   ├── layout/           # Layout components (wrappers, scrollviews)
│   ├── player/           # Player-specific components (future)
│   └── podcast/          # Podcast-specific components (future)
│
├── api/                  # 🌐 API Client & Data Fetching
│   ├── client.ts         # HTTP client configuration
│   └── [feature]/        # Feature-specific API hooks
│
├── lib/                  # 🛠️ Core Utilities (reusable across projects)
│   ├── storage/          # AsyncStorage wrapper
│   ├── audio/            # Audio player utilities
│   ├── auth/             # Authentication logic
│   └── utils/            # Helper functions
│
├── hooks/                # 🪝 Custom React Hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
│
├── store/                # 💾 Global State Management
│   └── player-store.ts   # Zustand/Redux stores
│
├── types/                # 📝 Global TypeScript Types
│   └── index.ts          # Shared interfaces and types
│
├── constants/            # 🔒 Constants & Config
│   └── theme.ts          # Theme configuration
│
└── tamagui.config.ts     # Tamagui UI configuration
```

## 🎯 Import Aliases

Use these aliases for clean imports:

```typescript
// Components
import { ThemedText, Button } from '@/components/ui';
import { ParallaxScrollView } from '@/components/layout';

// API
import { apiClient } from '@/api';

// Lib
import { storage, formatTime } from '@/lib';

// Hooks
import { useColorScheme } from '@/hooks/use-color-scheme';

// Types
import type { User, Podcast } from '@/types';

// Assets
import logo from '@assets/images/logo.png';
```

## 📝 Rules

### `app/` folder
- **ONLY route files** - Every file becomes a screen/route
- Folder structure = navigation structure
- NO components, hooks, or utilities here

### `components/` folder
- Organized by domain (`ui/`, `layout/`, `player/`, etc.)
- Each component should be self-contained
- Use barrel exports (`index.ts`) for clean imports

### `api/` folder
- All data fetching logic
- Organized by feature
- Use React Query/TanStack Query hooks

### `lib/` folder
- Project-agnostic utilities
- Could be extracted to separate packages
- Auth, storage, core utilities

### `hooks/` folder
- Global custom hooks
- Feature-specific hooks go in `api/[feature]/`

## 🚀 Next Steps

1. Install state management: `pnpm add zustand` (optional)
2. Install React Query: `pnpm add @tanstack/react-query` (for API)
3. Install AsyncStorage: `pnpm add @react-native-async-storage/async-storage`
4. Build out features in their respective folders
