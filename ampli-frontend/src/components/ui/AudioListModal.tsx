import colors from "@/constants/colors";
import type { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import type { AudioData } from "@/types/audio";
import { AudioListItem } from "./AudioListItem";
import { AudioListLoadingUI } from "./AudioListLoadingUI";
import { usePlayerStore } from "@/store";
import { X } from "lucide-react-native";

interface Props {
  data: AudioData[];
  header?: string;
  visible: boolean;
  onRequestClose(): void;
  onItemPress(item: AudioData, data: AudioData[]): void;
  loading?: boolean;
}

const AudioListModal: FC<Props> = ({
  header,
  loading,
  data,
  visible,
  onItemPress,
  onRequestClose,
}) => {
  const { currentTrack } = usePlayerStore();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header_container}>
            <Text style={styles.header}>{header}</Text>
            <Pressable onPress={onRequestClose}>
              <X size={24} color={colors.TEXT_PRIMARY} />
            </Pressable>
          </View>

          {loading ? (
            <AudioListLoadingUI />
          ) : (
            <FlatList
              contentContainerStyle={styles.flatlist}
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <AudioListItem
                    onPress={() => onItemPress(item, data)}
                    audio={item}
                    isPlaying={currentTrack?.id === item.id}
                  />
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.BACKGROUND_SECONDARY,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    maxHeight: "80%",
  },
  header_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  flatlist: {
    paddingBottom: 50,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.TEXT_PRIMARY,
    paddingVertical: 10,
  },
});

export default AudioListModal;
