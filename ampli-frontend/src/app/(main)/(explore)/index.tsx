import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";

// Temporary placeholder data
const trendingPodcasts = [
  {
    id: "1",
    title: "ON PURPOSE",
    subtitle: "with Jay Shetty",
    image: "https://picsum.photos/200/300?random=1",
  },
  {
    id: "2",
    title: "Heal your Heartbreak",
    subtitle: "with Alex Brusk by Renée",
    image: "https://picsum.photos/200/300?random=2",
  },
  {
    id: "3",
    title: "Mindvalley Podcast",
    subtitle: "Mindvalley",
    image: "https://picsum.photos/200/300?random=3",
  },
];

const genres = [
  { id: "1", name: "Crime", color: "#2D5F4F" },
  { id: "2", name: "Art", color: "#6B6B6B" },
  { id: "3", name: "Technology", color: "#1E3A5F" },
  { id: "4", name: "Culture", color: "#8B4513" },
  { id: "5", name: "Thriller", color: "#2C2C2C" },
  { id: "6", name: "Educational", color: "#E67E22" },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Podcast, Artist, Genre..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Popular & Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular & Trending</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingScroll}
          >
            {trendingPodcasts.map((podcast) => (
              <TouchableOpacity key={podcast.id} style={styles.podcastCard}>
                <Image
                  source={{ uri: podcast.image }}
                  style={styles.podcastImage}
                />
                <View style={styles.podcastInfo}>
                  <Text style={styles.podcastTitle}>{podcast.title}</Text>
                  <Text style={styles.podcastSubtitle}>{podcast.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search by Genre */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Search by genre</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.genreGrid}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={[styles.genreCard, { backgroundColor: genre.color }]}
              >
                <Text style={styles.genreText}>{genre.name}</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
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
    color: "#B794F6",
    fontWeight: "600",
  },
  trendingScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  podcastCard: {
    width: 130,
  },
  podcastImage: {
    width: 130,
    height: 130,
    borderRadius: 4,
    marginBottom: 8,
  },
  podcastInfo: {
    gap: 4,
  },
  podcastTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  podcastSubtitle: {
    fontSize: 12,
    color: "#999",
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  genreCard: {
    width: "47%",
    height: 80,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  genreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
