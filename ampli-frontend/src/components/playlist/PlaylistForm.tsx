import { BasicModalContainer } from "@/components/ui/BasicModalContainer";
import colors from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import { CheckCircle2, Circle } from "lucide-react-native";

export interface PlaylistInfo {
  title: string;
  private: boolean;
}

interface PlaylistFormProps {
  visible: boolean;
  initialValue?: PlaylistInfo;
  onRequestClose: () => void;
  onSubmit: (value: PlaylistInfo) => void;
}

export const PlaylistForm: React.FC<PlaylistFormProps> = ({
  visible,
  initialValue,
  onSubmit,
  onRequestClose,
}) => {
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>({
    title: "",
    private: false,
  });

  const handleSubmit = () => {
    if (!playlistInfo.title.trim()) {
      return;
    }
    onSubmit(playlistInfo);
    handleClose();
  };

  const handleClose = () => {
    setPlaylistInfo({ title: "", private: false });
    setIsForUpdate(false);
    onRequestClose();
  };

  useEffect(() => {
    if (initialValue) {
      setPlaylistInfo({ ...initialValue });
      setIsForUpdate(true);
    }
  }, [initialValue, visible]);

  return (
    <BasicModalContainer visible={visible} onRequestClose={handleClose}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {isForUpdate ? "Update Playlist" : "Create New Playlist"}
        </Text>

        <TextInput
          onChangeText={(text) => {
            setPlaylistInfo({ ...playlistInfo, title: text });
          }}
          placeholder="Playlist title"
          placeholderTextColor={colors.TEXT_SECONDARY}
          style={styles.input}
          value={playlistInfo.title}
          maxLength={50}
        />

        <Text style={styles.characterCount}>
          {playlistInfo.title.length}/50
        </Text>

        <Pressable
          onPress={() => {
            setPlaylistInfo({
              ...playlistInfo,
              private: !playlistInfo.private,
            });
          }}
          style={styles.privateSelector}
        >
          {playlistInfo.private ? (
            <CheckCircle2 size={24} color={colors.ACCENT} />
          ) : (
            <Circle size={24} color={colors.TEXT_SECONDARY} />
          )}
          <Text style={styles.privateLabel}>Private Playlist</Text>
        </Pressable>

        <Pressable
          onPress={handleSubmit}
          style={[
            styles.submitBtn,
            !playlistInfo.title.trim() && styles.submitBtnDisabled,
          ]}
          disabled={!playlistInfo.title.trim()}
        >
          <Text style={styles.submitBtnText}>
            {isForUpdate ? "Update" : "Create"}
          </Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
  },
  title: {
    fontSize: 18,
    color: colors.TEXT_PRIMARY,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    height: 45,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.ACCENT,
    color: colors.TEXT_PRIMARY,
    fontSize: 14,
    marginBottom: 4,
  },
  characterCount: {
    fontSize: 12,
    color: colors.TEXT_SECONDARY,
    marginBottom: 16,
    textAlign: "right",
  },
  privateSelector: {
    height: 45,
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  privateLabel: {
    color: colors.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: "500",
  },
  submitBtn: {
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.ACCENT,
    borderRadius: 7,
    backgroundColor: colors.ACCENT,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: colors.BLACK,
    fontWeight: "700",
    fontSize: 14,
  },
});

export default PlaylistForm;
