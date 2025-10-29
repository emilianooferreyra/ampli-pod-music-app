import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Music, Upload } from "lucide-react-native";

export default function CreateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create</Text>
          <Text style={styles.subtitle}>Share your music with the world</Text>
        </View>

        {/* Create Options */}
        <View style={styles.optionsContainer}>
          {/* Create Playlist */}
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.iconContainer}>
              <Music size={40} color="#FF6B35" strokeWidth={1.5} />
            </View>
            <Text style={styles.optionTitle}>Create Playlist</Text>
            <Text style={styles.optionDescription}>
              Curate your own collection of favorite tracks
            </Text>
          </TouchableOpacity>

          {/* Upload Audio */}
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.iconContainer}>
              <Upload size={40} color="#6C3EDB" strokeWidth={1.5} />
            </View>
            <Text style={styles.optionTitle}>Upload Audio</Text>
            <Text style={styles.optionDescription}>
              Share your podcast or music with our community
            </Text>
          </TouchableOpacity>
        </View>

        {/* Coming Soon Section */}
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            More creation features will be available soon. Stay tuned!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: "#232323",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  comingSoonContainer: {
    backgroundColor: "#232323",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
});
