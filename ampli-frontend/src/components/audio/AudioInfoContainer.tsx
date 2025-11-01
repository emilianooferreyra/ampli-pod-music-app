import AppLink from "@/components/ui/AppLink";
import colors from "@/constants/colors";
import type { FC } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { X } from "lucide-react-native";
import { usePlayerStore } from "@/store";

interface Props {
  visible: boolean;
  closeHandler(state: boolean): void;
}

const AudioInfoContainer: FC<Props> = ({ visible, closeHandler }) => {
  const { currentTrack } = usePlayerStore();

  if (!visible) return null;

  const handleClose = () => {
    closeHandler(!visible);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeBtn} onPress={handleClose}>
        <X color={colors.TEXT_PRIMARY} size={24} />
      </Pressable>
      <ScrollView>
        <View>
          <Text style={styles.title}>{currentTrack?.title}</Text>
          <View style={styles.ownerInfo}>
            <Text style={styles.title}>Creator: </Text>
            <AppLink title={currentTrack?.owner.name || ""} />
          </View>
          <Text style={styles.about}>{currentTrack?.about}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.BACKGROUND_SECONDARY,
    zIndex: 1,
    padding: 10,
  },
  closeBtn: {
    alignSelf: "flex-end",
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    color: colors.TEXT_PRIMARY,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  about: {
    fontSize: 16,
    color: colors.TEXT_PRIMARY,
    paddingVertical: 5,
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default AudioInfoContainer;
