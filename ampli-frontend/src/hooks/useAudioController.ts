import { useEffect } from 'react';
import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import type { AudioData } from '@/types/audio';
import { usePlayerStore } from '@/store';

let isReady = false;

const updateQueue = async (data: AudioData[]) => {
  const lists: Track[] = data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      url: item.file,
      artwork: item.poster || require('../../assets/images/music.png'),
      artist: item.owner.name,
      genre: item.category,
      isLiveStream: true,
    };
  });
  await TrackPlayer.add([...lists]);
};

export const useAudioController = () => {
  const playbackState = usePlaybackState();
  const { currentTrack, playlist, setCurrentTrack, setPlaylist } =
    usePlayerStore();

  const isPalyerReady = playbackState !== State.None;
  const isPalying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isBusy =
    playbackState === State.Buffering || playbackState === State.Connecting;

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

    if (playbackState === State.Playing && currentTrack?.id === item.id) {
      // same audio is already playing (handle pause)
      return await TrackPlayer.pause();
    }

    if (playbackState === State.Paused && currentTrack?.id === item.id) {
      // same audio no need to load handle resume
      return await TrackPlayer.play();
    }

    if (currentTrack?.id !== item.id) {
      const playlistIds = playlist.map((p) => p.id).join(',');
      const dataIds = data.map((p) => p.id).join(',');
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
    if (isPalying) await TrackPlayer.pause();
    if (isPaused) await TrackPlayer.play();
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
      setCurrentTrack(playlist[nextIndex]);
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
      setCurrentTrack(playlist[preIndex]);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
  };

  useEffect(() => {
    const setupPlayer = async () => {
      if (isReady) return;

      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 10,
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
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
      });
    };

    setupPlayer();
    isReady = true;
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
