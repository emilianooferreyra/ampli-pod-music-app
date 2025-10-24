// import { create } from 'zustand';
// import type { Episode, PlayerState } from '@/types';

// interface PlayerStore extends PlayerState {
//   play: () => void;
//   pause: () => void;
//   setCurrentEpisode: (episode: Episode) => void;
//   setCurrentTime: (time: number) => void;
//   setVolume: (volume: number) => void;
// }

// export const usePlayerStore = create<PlayerStore>((set) => ({
//   isPlaying: false,
//   currentEpisode: null,
//   currentTime: 0,
//   duration: 0,
//   volume: 1,
//
//   play: () => set({ isPlaying: true }),
//   pause: () => set({ isPlaying: false }),
//   setCurrentEpisode: (episode) => set({ currentEpisode: episode, duration: episode.duration }),
//   setCurrentTime: (time) => set({ currentTime: time }),
//   setVolume: (volume) => set({ volume }),
// }));

// Placeholder export until you install Zustand
export const playerStore = {};
