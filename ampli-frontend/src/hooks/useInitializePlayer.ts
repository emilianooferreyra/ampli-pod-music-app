import { useEffect } from 'react';
import { usePlayerStore } from '@/store';
import type { AudioData } from '@/types/audio';

// Mock data para testing
const mockTracks: AudioData[] = [
  {
    id: '1',
    title: 'Beautiful Day',
    about: 'A wonderful song to start your day',
    category: 'pop',
    file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    poster: 'https://via.placeholder.com/200/FF6B35/FFFFFF?text=Beautiful+Day',
    owner: {
      id: 'artist-1',
      name: 'The Band',
    },
  },
  {
    id: '2',
    title: 'Sunset Dreams',
    about: 'Relaxing evening vibes',
    category: 'ambient',
    file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    poster: 'https://via.placeholder.com/200/6C3EDB/FFFFFF?text=Sunset+Dreams',
    owner: {
      id: 'artist-2',
      name: 'Chill Waves',
    },
  },
  {
    id: '3',
    title: 'Energy Boost',
    about: 'Perfect for workouts',
    category: 'electronic',
    file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    poster: 'https://via.placeholder.com/200/E74C3C/FFFFFF?text=Energy+Boost',
    owner: {
      id: 'artist-3',
      name: 'Beat Masters',
    },
  },
];

export const useInitializePlayer = () => {
  const { setCurrentTrack, setPlaylist } = usePlayerStore();

  useEffect(() => {
    // Inicializar con el primer track
    if (mockTracks.length > 0) {
      setCurrentTrack(mockTracks[0]);
      setPlaylist(mockTracks);
    }
  }, [setCurrentTrack, setPlaylist]);
};
