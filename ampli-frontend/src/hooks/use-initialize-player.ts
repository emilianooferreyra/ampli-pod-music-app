import { useEffect } from "react";
import TrackPlayer, { type Track } from "react-native-track-player";
import { usePlayerStore } from "@/store";
import type { AudioData } from "@/types/audio";

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

  useEffect(() => {
    const initializePlayer = async () => {
      if (playerInitialized) return;

      try {
        try {
          await TrackPlayer.setupPlayer({
            maxCacheSize: 0,
            autoUpdateMetadata: true,
          });
        } catch (setupError: any) {
          if (setupError?.code === "player_already_initialized") {
            console.log(
              "useInitializePlayer - Player already initialized by another instance"
            );
          } else {
            throw setupError;
          }
        }

        const trackList: Track[] = mockTracks.map((item) => ({
          id: item.id,
          title: item.title,
          url: item.file,
          artwork: item.poster,
          artist: item.owner.name,
          genre: item.category,
          isLiveStream: false,
        }));

        await TrackPlayer.add(trackList);

        await TrackPlayer.skip(0);

        const firstTrack = mockTracks[0] ?? null;
        setCurrentTrack(firstTrack);
        setPlaylist(mockTracks);

        playerInitialized = true;
      } catch (error: any) {
        if (error?.code === "player_already_initialized") {
          playerInitialized = true;
        }
      }
    };

    initializePlayer();
  }, []);
};
