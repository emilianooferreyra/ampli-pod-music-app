import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Temporary placeholder data
const trendingTracks = [
  {
    id: "1",
    title: "Synthwave Dreams",
    subtitle: "Various Artists",
    color: "#FF6B35",
  },
  {
    id: "2",
    title: "Indie Folk Classics",
    subtitle: "Various Artists",
    color: "#6C3EDB",
  },
  {
    id: "3",
    title: "Lo-Fi Hip Hop Beats",
    subtitle: "Various Artists",
    color: "#E91E63",
  },
];

const categories = [
  {
    id: "1",
    name: "New Releases",
    color: "#FF6B6B",
  },
  {
    id: "2",
    name: "Top Charts",
    color: "#FBBF24",
  },
  { id: "3", name: "Pop", color: "#6C3EDB" },
  { id: "4", name: "Hip Hop", color: "#1E3A5F" },
  { id: "5", name: "Rock", color: "#8B4513" },
  { id: "6", name: "Electronic", color: "#E67E22" },
];

export default function ExploreScreen() {
  const handleCategoryPress = (categoryId: string) => {
    // Handle category navigation
    console.log("Category pressed:", categoryId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>
            Discover new music and curated collections
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular & Trending</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingScroll}
          >
            {trendingTracks.map((track) => (
              <TouchableOpacity
                key={track.id}
                style={styles.trackCard}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.trackImage, { backgroundColor: track.color }]}
                />
                <View style={styles.trackInfo}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackSubtitle}>{track.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: category.color,
                  },
                ]}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  seeAll: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  trendingScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  trackCard: {
    width: 130,
  },
  trackImage: {
    width: 130,
    height: 130,
    borderRadius: 4,
    marginBottom: 8,
  },
  trackInfo: {
    gap: 4,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  trackSubtitle: {
    fontSize: 12,
    color: "#999",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: "47%",
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
