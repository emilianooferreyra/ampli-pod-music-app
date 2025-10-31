import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useProgress } from "react-native-track-player";
import colors from "@/constants/colors";
import { usePlayerStore, useAuthStore, useNotificationStore } from "@/store";
import { useAudioController } from "@/hooks/useAudioController";
import { mapRange } from "@/utils/math";
import { Heart } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/api/client";
import { useFetchIsFavorite } from "@/hooks/query";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { AudioPlayer } from "./AudioPlayer";

export const MiniPlayerHeight = 60;

type DrawerNavigation = DrawerNavigationProp<any>;

export const MiniAudioPlayer = () => {
  const { currentTrack } = usePlayerStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { isPalying, isBusy, togglePlayPause } = useAudioController();
  const progress = useProgress();
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const navigation = useNavigation<DrawerNavigation>();

  const { data: isFav } = useFetchIsFavorite(currentTrack?.id || "");

  const poster = currentTrack?.poster;
  const source = poster
    ? { uri: poster }
    : require("../../../assets/images/music.png");

  const queryClient = useQueryClient();

  const toggleIsFav = async (id: string) => {
    if (!id) return;
    const client = await getClient();
    await client.post(`/favorite?audioId=${id}`);
  };

  const favoriteMutation = useMutation({
    mutationFn: async (id: string) => toggleIsFav(id),
    onMutate: () => {
      queryClient.setQueryData<boolean>(
        ["favorite", currentTrack?.id],
        (oldData) => !oldData
      );
    },
    onError: (error: any) => {
      addNotification(
        error?.message || "Error al actualizar favorito",
        "error"
      );
    },
  });

  const showPlayerModal = () => {
    setPlayerVisibility(true);
  };

  const closePlayerModal = () => {
    setPlayerVisibility(false);
  };

  const handleOnProfileLinkPress = () => {
    closePlayerModal();
    if (user?.id === currentTrack?.owner.id) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("PublicProfile", {
        profileId: currentTrack?.owner.id || "",
      });
    }
  };

  if (!currentTrack) {
    return null;
  }

  const progressPercent = mapRange({
    outputMin: 0,
    outputMax: 100,
    inputMin: 0,
    inputMax: progress.duration,
    inputValue: progress.position,
  });

  return (
    <>
      <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />

        <Pressable onPress={showPlayerModal} style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.name} numberOfLines={1}>
            {currentTrack.owner.name}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => favoriteMutation.mutate(currentTrack?.id || "")}
          style={styles.favoriteButton}
        >
          <Heart
            size={24}
            color={colors.TEXT_PRIMARY}
            fill={isFav ? colors.ERROR : "transparent"}
          />
        </Pressable>

        {isBusy ? (
          <ActivityIndicator size="small" color={colors.ACCENT} />
        ) : (
          <Pressable onPress={togglePlayPause} style={styles.playButton}>
            <Text style={styles.playButtonText}>{isPalying ? "⏸" : "▶"}</Text>
          </Pressable>
        )}
      </View>

      <AudioPlayer
        visible={playerVisibility}
        onRequestClose={closePlayerModal}
        onProfileLinkPress={handleOnProfileLinkPress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 3,
    backgroundColor: colors.SECONDARY,
    width: "0%",
  },
  container: {
    width: "100%",
    height: MiniPlayerHeight,
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  poster: {
    height: MiniPlayerHeight - 16,
    width: MiniPlayerHeight - 16,
    borderRadius: 8,
    backgroundColor: colors.GRAY_800,
  },
  title: {
    color: colors.TEXT_PRIMARY,
    fontWeight: "700",
    paddingHorizontal: 0,
    fontSize: 14,
    marginBottom: 2,
  },
  name: {
    color: "#999999",
    fontWeight: "500",
    paddingHorizontal: 0,
    fontSize: 12,
  },
  favoriteButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonText: {
    fontSize: 24,
    color: colors.TEXT_PRIMARY,
  },
});

export default MiniAudioPlayer;
