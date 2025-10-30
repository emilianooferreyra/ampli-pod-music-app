import { create } from 'zustand';
import type { AudioData } from '@/types/audio';

interface PlayerState {
  isPlaying: boolean;
  currentTrack: AudioData | null;
  playlist: AudioData[];
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
}

interface PlayerStore extends PlayerState {
  play: () => void;
  pause: () => void;
  setCurrentTrack: (track: AudioData | null) => void;
  setPlaylist: (playlist: AudioData[]) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  currentTrack: null,
  playlist: [],
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setPlaylist: (playlist) => set({ playlist }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  reset: () => set({
    isPlaying: false,
    currentTrack: null,
    playlist: [],
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
  }),
}));
