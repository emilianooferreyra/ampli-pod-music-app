import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Upload, Image as ImageIcon, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";

interface UploadTrackFormData {
  title: string;
  description: string;
  genre: string;
  audioFile: {
    uri: string;
    name: string;
    type: string;
  } | null;
}

export default function UploadTrackScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<UploadTrackFormData>({
    title: "",
    description: "",
    genre: "",
    audioFile: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Volver a Create, no al home
    router.push("/(main)/(drawer)/create");
  };

  const handleAudioFilePick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Will integrate with expo-document-picker
    console.log("Pick audio file");
  };

  const handleUpload = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a track title");
      return;
    }

    if (!formData.audioFile) {
      alert("Please select an audio file");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // API call will go here
      // await trackAPI.upload(formData)
      console.log("Uploading track:", formData);

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Track uploaded successfully!");
      router.back();
    } catch (error) {
      alert("Error uploading track. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Electronic",
    "Jazz",
    "Classical",
    "R&B",
    "Country",
    "Indie",
    "Metal",
  ];

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
        <Text style={styles.headerTitle}>Upload Track</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover Art Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Cover Art (Optional)</Text>
          <TouchableOpacity
            style={styles.coverUploadBox}
            activeOpacity={0.7}
            onPress={handleAudioFilePick}
          >
            <ImageIcon size={32} color="#B794F6" />
            <Text style={styles.coverUploadText}>Tap to add cover image</Text>
          </TouchableOpacity>
        </View>

        {/* Audio File Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Audio File *</Text>
          {formData.audioFile ? (
            <View style={styles.fileSelectedBox}>
              <Upload size={20} color="#4ECDC4" />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>{formData.audioFile.name}</Text>
                <Text style={styles.fileInfo}>MP3, WAV, FLAC, M4A</Text>
              </View>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, audioFile: null })}
              >
                <X size={20} color="#A0A0A0" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.fileUploadBox}
              activeOpacity={0.7}
              onPress={handleAudioFilePick}
            >
              <Upload size={32} color="#B794F6" />
              <Text style={styles.fileUploadText}>Select Audio File</Text>
              <Text style={styles.fileUploadSubtext}>
                MP3, WAV, FLAC, M4A (Max 50MB)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Track Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Track Title *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter track title"
            placeholderTextColor="#666"
            value={formData.title}
            onChangeText={(text) =>
              setFormData({ ...formData, title: text })
            }
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            placeholder="Add a description about your track"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
          />
        </View>

        {/* Genre Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Genre</Text>
          <View style={styles.genreContainer}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={[
                  styles.genreButton,
                  formData.genre === genre && styles.genreButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, genre })}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.genreButtonText,
                    formData.genre === genre && styles.genreButtonTextActive,
                  ]}
                >
                  {genre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadButton,
            isLoading && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Upload Track</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}

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
    borderColor: "#B794F6",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(183, 148, 246, 0.05)",
  },
  coverUploadText: {
    fontSize: 14,
    color: "#B794F6",
    fontWeight: "500",
  },
  fileUploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#B794F6",
    borderRadius: 8,
    padding: 32,
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(183, 148, 246, 0.05)",
  },
  fileUploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  fileUploadSubtext: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  fileSelectedBox: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  fileInfo: {
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 4,
  },
  textInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreButton: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  genreButtonActive: {
    backgroundColor: "#B794F6",
  },
  genreButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A0A0A0",
  },
  genreButtonTextActive: {
    color: "#FFFFFF",
  },
  uploadButton: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#B794F6",
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
