import AppLink from "@/components/ui/AppLink";
import AudioInfoContainer from "@/components/audio/AudioInfoContainer";
import colors from "@/constants/colors";
import { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useProgress } from "react-native-track-player";
import { usePlayerStore } from "@/store";
import { useAudioController } from "@/hooks/use-audio-controller";
import { Info, SkipBack, SkipForward, Music } from "lucide-react-native";

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onListOptionPress?(): void;
  onProfileLinkPress?(): void;
}

const formatDuration = (seconds: number = 0): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer = ({
  visible,
  onRequestClose,
  onListOptionPress,
  onProfileLinkPress,
}: Props) => {
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const { currentTrack } = usePlayerStore();
  const {
    isPlaying,
    isLoading,
    onNextPress,
    onPreviousPress,
    seekTo,
    playOrPause,
  } = useAudioController();

  const poster = currentTrack?.poster;
  const source =
    poster && poster !== ""
      ? { uri: poster }
      : require("../../../assets/images/music.png");

  const { duration, position } = useProgress();

  // Estado para rastrear el inicio del swipe
  const [swipeStartX, setSwipeStartX] = useState(0);

  // Manejador para el inicio del swipe
  const handlePosterPressIn = (e: any) => {
    setSwipeStartX(e.nativeEvent.pageX);
  };

  // Manejador para el fin del swipe
  const handlePosterPressOut = (e: any) => {
    const endX = e.nativeEvent.pageX;
    const deltaX = swipeStartX - endX;

    // Si se desliza más de 50px, cambiar de canción
    if (deltaX > 50) {
      // Deslizar a la izquierda (restar) → siguiente canción
      onNextPress();
    } else if (deltaX < -50) {
      // Deslizar a la derecha (sumar) → canción anterior
      onPreviousPress();
    }
  };

  const handleSliderChange = async (value: number) => {
    await seekTo(value);
  };

  if (!currentTrack) {
    return null;
  }

  const handleOnNextPress = async () => {
    await onNextPress();
  };

  const handleOnPreviousPress = async () => {
    await onPreviousPress();
  };


  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <AudioInfoContainer
          visible={showAudioInfo}
          closeHandler={setShowAudioInfo}
        />

        <Pressable
          onPress={() => setShowAudioInfo(true)}
          style={styles.infoBtn}
        >
          <Info size={24} color={colors.TEXT_PRIMARY} />
        </Pressable>

        {/* Poster con swipe para cambiar de canción */}
        <Pressable
          onPressIn={handlePosterPressIn}
          onPressOut={handlePosterPressOut}
        >
          <Image source={source} style={styles.poster} />
        </Pressable>

        <ScrollView style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {currentTrack.title}
          </Text>

          <AppLink
            onPress={onProfileLinkPress}
            title={currentTrack.owner.name || ""}
          />

          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{formatDuration(position)}</Text>
            <Text style={styles.duration}>{formatDuration(duration)}</Text>
          </View>

          {/* Slider de progreso */}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={handleSliderChange}
            minimumTrackTintColor={colors.ACCENT}
            maximumTrackTintColor={colors.GRAY_700}
            thumbTintColor={colors.ACCENT}
          />

          <View style={styles.controles}>
            {/* Previous */}
            <Pressable onPress={handleOnPreviousPress}>
              <SkipBack size={24} color={colors.TEXT_PRIMARY} />
            </Pressable>

            {/* Skip Time Left 
            <Pressable onPress={() => handleSkipTo("reverse")}>
              <View style={styles.skipButton}>
                <RotateCcw size={16} color={colors.TEXT_PRIMARY} />
                <Text style={styles.skipText}>-10s</Text>
              </View>
            </Pressable>*/}

            {/* Play Pause */}
            <Pressable
              style={styles.playButton}
              onPress={playOrPause}
              disabled={isLoading}
            >
              <Text style={styles.playButtonText}>
                {isLoading ? "⌛" : isPlaying ? "⏸" : "▶"}
              </Text>
            </Pressable>

            {/* Skip Time Right 
            <Pressable onPress={() => handleSkipTo("forward")}>
              <View style={styles.skipButton}>
                <RotateCw size={16} color={colors.TEXT_PRIMARY} />
                <Text style={styles.skipText}>+10s</Text>
              </View>
            </Pressable>*/}

            {/* Next */}
            <Pressable onPress={handleOnNextPress}>
              <SkipForward size={24} color={colors.TEXT_PRIMARY} />
            </Pressable>
          </View>

          {/* Playback Rate Selector 
          <View style={styles.playbackRateContainer}>
            {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
              <Pressable
                key={rate}
                style={[
                  styles.rateButton,
                  playbackRate === rate && styles.rateButtonActive,
                ]}
                onPress={() => handlePlaybackRatePress(rate)}
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
          </View>*/}

          {/* List Option Button */}
          <View style={styles.listOptionBtnContainer}>
            <Pressable onPress={onListOptionPress}>
              <Music size={24} color={colors.TEXT_PRIMARY} />
            </Pressable>
          </View>
        </ScrollView>

        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={onRequestClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.BACKGROUND,
    paddingTop: 100,
  },
  poster: {
    width: 300,
    height: 400,
    borderRadius: 10,
    backgroundColor: colors.GRAY_800,
  },
  contentContainer: {
    width: "100%",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.TEXT_PRIMARY,
    marginBottom: 8,
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
    paddingBottom: 30,
  },
  infoBtn: {
    position: "absolute",
    right: 10,
    top: 50,
    zIndex: 10,
    padding: 8,
  },
  closeButton: {
    position: "absolute",
    top: 50,
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
