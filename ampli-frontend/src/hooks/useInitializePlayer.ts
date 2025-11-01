import { useEffect } from "react";
import TrackPlayer, { type Track } from "react-native-track-player";
import { usePlayerStore } from "@/store";
import type { AudioData } from "@/types/audio";

// Mock data para testing
const mockTracks: AudioData[] = [
  {
    id: "1",
    title: "Beautiful Day",
    about: "A wonderful song to start your day",
    category: "Music",
    file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    poster: "",
    owner: {
      id: "artist-1",
      name: "The Band",
    },
  },
  {
    id: "2",
    title: "Sunset Dreams",
    about: "Relaxing evening vibes",
    category: "Music",
    file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    poster: "",
    owner: {
      id: "artist-2",
      name: "Chill Waves",
    },
  },
  {
    id: "3",
    title: "Energy Boost",
    about: "Perfect for workouts",
    category: "Music",
    file: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    poster: "",
    owner: {
      id: "artist-3",
      name: "Beat Masters",
    },
  },
];

let playerInitialized = false;

export const useInitializePlayer = () => {
  const setCurrentTrack = usePlayerStore((state) => state.setCurrentTrack);
  const setPlaylist = usePlayerStore((state) => state.setPlaylist);
  const currentTrack = usePlayerStore((state) => state.currentTrack);

  useEffect(() => {
    const initializePlayer = async () => {
      // Esperar a que el player esté listo
      let attempts = 0;
      const maxAttempts = 50; // 5 segundos (50 * 100ms)

      while (attempts < maxAttempts) {
        try {
          // Intentar obtener la cola - si funciona, el player está listo
          await TrackPlayer.getQueue();
          console.log("useInitializePlayer - Player is ready");
          break;
        } catch (error) {
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      }

      if (attempts >= maxAttempts) {
        console.error("useInitializePlayer - Player initialization timeout");
        return;
      }

      // Inicializar con el primer track solo si no hay track actual
      const firstTrack = mockTracks[0];
      console.log(
        "useInitializePlayer - currentTrack:",
        currentTrack,
        "firstTrack:",
        firstTrack
      );

      if (!currentTrack && firstTrack && !playerInitialized) {
        try {
          console.log("useInitializePlayer - Inicializando player...");

          // Convertir AudioData a Track
          const trackList: Track[] = mockTracks.map((item) => ({
            id: item.id,
            title: item.title,
            url: item.file,
            artwork: item.poster,
            artist: item.owner.name,
            genre: item.category,
            isLiveStream: false,
          }));

          // Añadir canciones a la cola
          await TrackPlayer.add(trackList);
          console.log("useInitializePlayer - Canciones añadidas a la cola");

          // Seleccionar el primer track como activo
          await TrackPlayer.skip(0);
          console.log("useInitializePlayer - Track 0 seleccionado");

          // Configurar el estado del store
          setCurrentTrack(firstTrack);
          setPlaylist(mockTracks);
          console.log("useInitializePlayer - Store actualizado");

          playerInitialized = true;

          // NO reproducir automáticamente, dejar que el usuario lo haga
          // El player está listo cuando el usuario presione play
        } catch (error) {
          console.error("Error initializing player:", error);
        }
      }
    };

    initializePlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar
};
