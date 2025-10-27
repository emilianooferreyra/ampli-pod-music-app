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
import { Search, Flame, TrendingUp, Sparkles, Music } from "lucide-react-native";

const browseCategories = [
  {
    id: "1",
    title: "New Releases",
    icon: "✨",
    color: "#FF6B6B",
    description: "Latest hits",
  },
  {
    id: "2",
    title: "Charts",
    icon: "📈",
    color: "#4ECDC4",
    description: "Top trending",
  },
  {
    id: "3",
    title: "Mood & Genres",
    icon: "🎵",
    color: "#A78BFA",
    description: "By vibe",
  },
  {
    id: "4",
    title: "Popular Artists",
    icon: "⭐",
    color: "#FBBF24",
    description: "Fan favorites",
  },
];

const newReleases = [
  { id: "1", title: "Midnight Jazz", subtitle: "The Quartet", image: "https://picsum.photos/100/100?random=10" },
  { id: "2", title: "Electric Dreams", subtitle: "Synth Wave", image: "https://picsum.photos/100/100?random=11" },
  { id: "3", title: "Indie Vibes", subtitle: "Alt Rock", image: "https://picsum.photos/100/100?random=12" },
];

const charts = [
  { id: "1", title: "Global Top 50", rank: "🔥", image: "https://picsum.photos/100/100?random=13" },
  { id: "2", title: "Pop Rising", rank: "📈", image: "https://picsum.photos/100/100?random=14" },
  { id: "3", title: "Hip Hop Heat", rank: "🎤", image: "https://picsum.photos/100/100?random=15" },
];

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search music, artists, moods..."
            placeholderTextColor="#999"
          />
        </View>

        {/* Browse Categories */}
        <Text style={styles.sectionTitle}>Browse</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {browseCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDesc}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Releases Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Releases 🆕</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsScroll}
          >
            {newReleases.map((item) => (
              <TouchableOpacity key={item.id} style={styles.itemCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                />
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Charts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Charts 📊</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsScroll}
          >
            {charts.map((item) => (
              <TouchableOpacity key={item.id} style={styles.itemCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                />
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.rank}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    backgroundColor: "#2A2A2A",
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  categoryCard: {
    width: 140,
    height: 140,
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  categoryDesc: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
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
  seeAll: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  itemsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  itemCard: {
    width: 130,
  },
  itemImage: {
    width: 130,
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});
