import { useEffect } from "react";
import TrackPlayer, {
  type Track,
  usePlaybackState,
  State,
  AppKilledPlaybackBehavior,
  Capability,
  Event,
} from "react-native-track-player";
import type { AudioData } from "@/types/audio";
import { usePlayerStore } from "@/store";

let isReady = false;

const updateQueue = async (data: AudioData[]) => {
  const lists: Track[] = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      url: item.file,
      artwork: item.poster,
      artist: item.owner.name,
      genre: item.category,
      isLiveStream: false,
    };
  });
  await TrackPlayer.add([...lists]);
};

export const useAudioController = () => {
  const { state } = usePlaybackState();
  const { currentTrack, playlist, setCurrentTrack, setPlaylist } =
    usePlayerStore();

  const isPalyerReady = state !== undefined && state !== State.None;
  const isPalying = state === State.Playing;
  const isPaused = state === State.Paused;
  const isBusy = state === State.Buffering || state === State.Connecting;

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPalyerReady) {
      // Playing audio for the first time.
      await updateQueue(data);
      setCurrentTrack(item);
      const index = data.findIndex((audio) => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      return setPlaylist(data);
    }

    if (state === State.Playing && currentTrack?.id === item.id) {
      // same audio is already playing (handle pause)
      return await TrackPlayer.pause();
    }

    if (state === State.Paused && currentTrack?.id === item.id) {
      // same audio no need to load handle resume
      return await TrackPlayer.play();
    }

    if (currentTrack?.id !== item.id) {
      const playlistIds = playlist.map((p) => p.id).join(",");
      const dataIds = data.map((p) => p.id).join(",");
      const fromSameList = playlistIds === dataIds;

      await TrackPlayer.pause();
      const index = data.findIndex((audio) => audio.id === item.id);

      if (!fromSameList) {
        // playing new audio from different list
        await TrackPlayer.reset();
        await updateQueue(data);
        setPlaylist(data);
      }

      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      setCurrentTrack(item);
    }
  };

  const togglePlayPause = async () => {
    try {
      console.log(
        "togglePlayPause - state:",
        state,
        "isPalying:",
        isPalying,
        "isPaused:",
        isPaused,
        "isPalyerReady:",
        isPalyerReady,
        "currentTrack:",
        currentTrack?.id
      );

      if (isPalying) {
        console.log("togglePlayPause - Pausing...");
        await TrackPlayer.pause();
      } else if (isPaused || state === "none" || state === "ready") {
        console.log("togglePlayPause - Playing...");
        // Si está en pausa, en estado 'none' o 'ready', reproducir
        if (currentTrack) {
          await TrackPlayer.play();
        } else {
          console.log("togglePlayPause - No track selected");
        }
      } else {
        console.log("togglePlayPause - Unknown state:", state);
      }
    } catch (error) {
      console.error("Error in togglePlayPause:", error);
    }
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (sec: number) => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPosition + sec);
  };

  const onNextPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getCurrentTrack();
    if (currentIndex === null) return;

    const nextIndex = currentIndex + 1;

    const nextAudio = currentList[nextIndex];
    if (nextAudio) {
      await TrackPlayer.skipToNext();
      const nextTrack = playlist[nextIndex];
      if (nextTrack) {
        setCurrentTrack(nextTrack);
      }
    }
  };

  const onPreviousPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getCurrentTrack();
    if (currentIndex === null) return;

    const preIndex = currentIndex - 1;

    const nextAudio = currentList[preIndex];
    if (nextAudio) {
      await TrackPlayer.skipToPrevious();
      const prevTrack = playlist[preIndex];
      if (prevTrack) {
        setCurrentTrack(prevTrack);
      }
    }
  };

  const setPlaybackRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
  };

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        if (isReady) {
          console.log("TrackPlayer already setup");
          return;
        }

        console.log("Setting up TrackPlayer...");
        try {
          await TrackPlayer.setupPlayer();
          console.log("TrackPlayer setup completed");
        } catch (setupError: any) {
          // Player ya está inicializado, ignorar este error
          if (!setupError?.message?.includes("already been initialized")) {
            throw setupError;
          }
          console.log("TrackPlayer already initialized");
        }

        await TrackPlayer.updateOptions({
          progressUpdateEventInterval: 10,
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.ContinuePlayback,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
        isReady = true;
        console.log("TrackPlayer options updated and ready");
      } catch (error) {
        console.log("Player setup error:", error);
      }
    };

    setupPlayer();
  }, []);

  // Event listeners para los controles remotos (notificación y lock screen)
  useEffect(() => {
    const unsubscribePlayPause = TrackPlayer.addEventListener(
      Event.RemotePlay,
      async () => {
        await TrackPlayer.play();
      }
    );

    const unsubscribePause = TrackPlayer.addEventListener(
      Event.RemotePause,
      async () => {
        await TrackPlayer.pause();
      }
    );

    const unsubscribeNext = TrackPlayer.addEventListener(
      Event.RemoteNext,
      async () => {
        await onNextPress();
      }
    );

    const unsubscribePrevious = TrackPlayer.addEventListener(
      Event.RemotePrevious,
      async () => {
        await onPreviousPress();
      }
    );

    return () => {
      unsubscribePlayPause.remove();
      unsubscribePause.remove();
      unsubscribeNext.remove();
      unsubscribePrevious.remove();
    };
  }, []);

  return {
    onAudioPress,
    onNextPress,
    onPreviousPress,
    seekTo,
    togglePlayPause,
    setPlaybackRate,
    skipTo,
    isBusy,
    isPalyerReady,
    isPalying,
  };
};

export default useAudioController;
