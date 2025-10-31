import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Image as ImageIcon, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";

interface CreatePlaylistFormData {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: {
    uri: string;
    name: string;
  } | null;
}

const CreatePlaylistScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreatePlaylistFormData>({
    name: "",
    description: "",
    isPublic: false,
    coverImage: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(main)/(drawer)/create");
  };

  const handleCoverImagePick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Will integrate with expo-image-picker
    console.log("Pick cover image");
  };

  const handleCreatePlaylist = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a playlist name");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // API call will go here
      // await playlistAPI.create(formData)
      console.log("Creating playlist:", formData);

      // Simulate creation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Playlist created successfully!");
      // Navigate to playlist with option to add songs
      router.back();
    } catch (error) {
      alert("Error creating playlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Playlist</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Playlist Cover (Optional)</Text>
          {formData.coverImage ? (
            <View style={styles.coverImageBox}>
              <View style={styles.coverImagePlaceholder} />
              <TouchableOpacity
                style={styles.changeCoverButton}
                onPress={handleCoverImagePick}
                activeOpacity={0.7}
              >
                <Text style={styles.changeCoverText}>Change Cover</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.coverUploadBox}
              activeOpacity={0.7}
              onPress={handleCoverImagePick}
            >
              <ImageIcon size={32} color="#2952E8" />
              <Text style={styles.coverUploadText}>Add cover image</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Playlist Name *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter playlist name"
            placeholderTextColor="#666"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            maxLength={100}
          />
          <Text style={styles.characterCount}>{formData.name.length}/100</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder="Add a description (optional)"
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {formData.description.length}/500
          </Text>
        </View>

        <View style={styles.privacySection}>
          <View style={styles.privacyContent}>
            <View>
              <Text style={styles.privacyLabel}>
                {formData.isPublic ? "Public" : "Private"}
              </Text>
              <Text style={styles.privacyDescription}>
                {formData.isPublic
                  ? "Anyone can see and follow this playlist"
                  : "Only you can see this playlist"}
              </Text>
            </View>
            <Switch
              value={formData.isPublic}
              onValueChange={(value) =>
                setFormData({ ...formData, isPublic: value })
              }
              trackColor={{ false: "#2A2A2A", true: "#B794F6" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            isLoading && styles.createButtonDisabled,
          ]}
          onPress={handleCreatePlaylist}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Playlist</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
};

export default CreatePlaylistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  coverUploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#2952E8",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(41, 82, 232, 0.05)",
  },
  coverUploadText: {
    fontSize: 14,
    color: "#2952E8",
    fontWeight: "500",
  },
  coverImageBox: {
    alignItems: "center",
    gap: 12,
  },
  coverImagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
  },
  changeCoverButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: "#2952E8",
    borderRadius: 6,
  },
  changeCoverText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: "#A0A0A0",
    textAlign: "right",
  },
  privacySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  privacyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 4,
  },
  createButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#2952E8",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
