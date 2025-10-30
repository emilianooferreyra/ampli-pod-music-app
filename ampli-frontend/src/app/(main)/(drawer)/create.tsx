import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Music, ListMusic, Plus, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function CreateScreen() {
  const router = useRouter();

  const handleUploadTrackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(main)/(drawer)/upload-track");
  };

  const handleCreatePlaylistPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(main)/(drawer)/create-playlist");
  };

  const handleCloseModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={handleCloseModal} activeOpacity={0.7}>
          <X size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.modalHeaderTitle}>Create</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Share your music or build the perfect playlist
          </Text>
        </View>

        <View style={styles.actionCardsContainer}>
          <TouchableOpacity
            style={[styles.actionCard, styles.uploadCard]}
            onPress={handleUploadTrackPress}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Music size={48} color="#FFFFFF" strokeWidth={1.5} />
            </View>
            <Text style={styles.cardTitle}>Upload Track</Text>
            <Text style={styles.cardSubtitle}>
              Share your music with the world
            </Text>
            <View style={styles.cardButton}>
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.cardButtonText}>Add Track</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.playlistCard]}
            onPress={handleCreatePlaylistPress}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <ListMusic size={48} color="#FFFFFF" strokeWidth={1.5} />
            </View>
            <Text style={styles.cardTitle}>Create Playlist</Text>
            <Text style={styles.cardSubtitle}>
              Curate your perfect collection
            </Text>
            <View style={styles.cardButton}>
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.cardButtonText}>New Playlist</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Your Recent Activity</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No activity yet. Start creating!
            </Text>
          </View>
        </View>
      </ScrollView>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyTab: {
    flex: 1,
    backgroundColor: "#232323",
    justifyContent: "center",
    alignItems: "center",
  },
  createTabButton: {
    alignItems: "center",
    gap: 12,
  },
  createTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B794F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    lineHeight: 22,
  },
  actionCardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    overflow: "hidden",
    borderRadius: 12,
    height: 220,
    padding: 24,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadCard: {
    backgroundColor: "#B794F6",
  },
  playlistCard: {
    backgroundColor: "#2952E8",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  cardButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B794F6",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#A0A0A0",
    fontWeight: "500",
  },
  recentSection: {
    paddingHorizontal: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#A0A0A0",
    textAlign: "center",
  },
});
