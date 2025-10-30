import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  useProgress,
  usePlaybackState,
  State,
} from "react-native-track-player";
import colors from "@/constants/colors";
import { usePlayerStore } from "@/store";
import { useAudioController } from "@/hooks/useAudioController";
import {
  Info,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
} from "lucide-react-native";
import Slider from "@react-native-community/slider";

interface AudioPlayerProps {
  visible: boolean;
  onRequestClose: () => void;
  onListOptionPress?: () => void;
  onProfileLinkPress?: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  visible,
  onRequestClose,
  onListOptionPress,
  onProfileLinkPress,
}) => {
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const { currentTrack, playbackRate } = usePlayerStore();
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();
  const {
    isPalying,
    isBusy,
    onNextPress,
    onPreviousPress,
    seekTo,
    skipTo,
    togglePlayPause,
    setPlaybackRate,
  } = useAudioController();

  const poster = currentTrack?.poster;
  const source = poster
    ? { uri: poster }
    : require("../../../assets/images/music.png");

  const handleOnNextPress = async () => {
    await onNextPress();
  };

  const handleOnPreviousPress = async () => {
    await onPreviousPress();
  };

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: "forward" | "reverse") => {
    if (skipType === "forward") await skipTo(10);
    if (skipType === "reverse") await skipTo(-10);
  };

  const onPlaybackRatePress = async (rate: number) => {
    await setPlaybackRate(rate);
  };

  if (!visible || !currentTrack) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setShowAudioInfo(true)} style={styles.infoBtn}>
        <Info size={24} color={colors.TEXT_PRIMARY} />
      </Pressable>

      <Image source={source} style={styles.poster} />

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {currentTrack.title}
        </Text>

        <Pressable onPress={onProfileLinkPress}>
          <Text style={styles.artist}>{currentTrack.owner.name}</Text>
        </Pressable>

        <View style={styles.durationContainer}>
          <Text style={styles.duration}>{formatDuration(position)}</Text>
          <Text style={styles.duration}>{formatDuration(duration)}</Text>
        </View>

        <Slider
          minimumValue={0}
          maximumValue={duration || 1}
          minimumTrackTintColor={colors.ACCENT}
          maximumTrackTintColor={colors.GRAY_700}
          value={position}
          onSlidingComplete={updateSeek}
          style={styles.slider}
        />

        <View style={styles.controles}>
          {/* Previous */}
          <Pressable onPress={handleOnPreviousPress}>
            <SkipBack size={24} color={colors.TEXT_PRIMARY} />
          </Pressable>

          {/* Skip Time Left */}
          <Pressable onPress={() => handleSkipTo("reverse")}>
            <View style={styles.skipButton}>
              <RotateCcw size={16} color={colors.TEXT_PRIMARY} />
              <Text style={styles.skipText}>-10s</Text>
            </View>
          </Pressable>

          {/* Play Pause */}
          <Pressable
            style={styles.playButton}
            onPress={togglePlayPause}
            disabled={isBusy}
          >
            {isBusy ? (
              <ActivityIndicator size="large" color={colors.PRIMARY} />
            ) : (
              <Text style={styles.playButtonText}>{isPalying ? "⏸" : "▶"}</Text>
            )}
          </Pressable>

          {/* Skip Time Right */}
          <Pressable onPress={() => handleSkipTo("forward")}>
            <View style={styles.skipButton}>
              <RotateCw size={16} color={colors.TEXT_PRIMARY} />
              <Text style={styles.skipText}>+10s</Text>
            </View>
          </Pressable>

          {/* Next */}
          <Pressable onPress={handleOnNextPress}>
            <SkipForward size={24} color={colors.TEXT_PRIMARY} />
          </Pressable>
        </View>

        {/* Playback Rate Selector */}
        <View style={styles.playbackRateContainer}>
          {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
            <Pressable
              key={rate}
              style={[
                styles.rateButton,
                playbackRate === rate && styles.rateButtonActive,
              ]}
              onPress={() => onPlaybackRatePress(rate)}
            >
              <Text
                style={[
                  styles.rateButtonText,
                  playbackRate === rate && styles.rateButtonTextActive,
                ]}
              >
                {rate}x
              </Text>
            </Pressable>
          ))}
        </View>

        {/* List Option Button */}
        <View style={styles.listOptionBtnContainer}>
          <Pressable onPress={onListOptionPress}>
            <Text style={styles.playlistIcon}>🎵</Text>
          </Pressable>
        </View>
      </View>

      {/* Close Button */}
      <Pressable style={styles.closeButton} onPress={onRequestClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.BACKGROUND,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: colors.GRAY_800,
  },
  contentContainer: {
    width: "100%",
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.TEXT_PRIMARY,
    marginBottom: 8,
  },
  artist: {
    fontSize: 14,
    color: colors.ACCENT,
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  duration: {
    color: colors.TEXT_SECONDARY,
    fontSize: 12,
  },
  slider: {
    width: "100%",
    height: 40,
    marginVertical: 10,
  },
  controles: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  skipButton: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  skipText: {
    fontSize: 10,
    color: colors.TEXT_PRIMARY,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.ACCENT,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonText: {
    fontSize: 32,
    color: colors.BLACK,
  },
  playbackRateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
    flexWrap: "wrap",
  },
  rateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.GRAY_700,
    minWidth: 44,
    alignItems: "center",
  },
  rateButtonActive: {
    backgroundColor: colors.ACCENT,
    borderColor: colors.ACCENT,
  },
  rateButtonText: {
    fontSize: 12,
    color: colors.TEXT_PRIMARY,
    fontWeight: "500",
  },
  rateButtonTextActive: {
    color: colors.BLACK,
    fontWeight: "700",
  },
  listOptionBtnContainer: {
    alignItems: "flex-end",
    marginTop: 16,
  },
  playlistIcon: {
    fontSize: 28,
  },
  infoBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 10,
    padding: 8,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 32,
    color: colors.TEXT_PRIMARY,
  },
});

export default AudioPlayer;
