import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { Bell } from "lucide-react-native";
import { getGreetingByTime } from "@/lib/time";

// Temporary placeholder data - expanded
const moodChips = [
  {
    id: "1",
    title: "Japanese Street Pop 00s",
    color: "#FF6B35",
  },
  {
    id: "2",
    title: "Throwback Rock Music 90s",
    color: "#6C3EDB",
  },
  {
    id: "3",
    title: "Chill Vibes",
    color: "#4ECDC4",
  },
  {
    id: "4",
    title: "Workout Energy",
    color: "#E74C3C",
  },
];

const forYou = [
  {
    id: "1",
    title: "Because You Listened...",
    color: "#B794F6",
  },
  {
    id: "2",
    title: "Your Daily Mix",
    color: "#2952E8",
  },
  {
    id: "3",
    title: "New Releases For You",
    color: "#FF6B35",
  },
];

const hitsMusic = [
  {
    id: "1",
    title: "Indonesia Hot Hits",
    color: "#E74C3C",
  },
  {
    id: "2",
    title: "Soft Pop Hits",
    color: "#6C3EDB",
  },
  {
    id: "3",
    title: "Anime Hot",
    color: "#E91E63",
  },
];

const moodbooster = [
  { id: "1", color: "#FF6B35" },
  { id: "2", color: "#6C3EDB" },
  { id: "3", color: "#E91E63" },
];

export default function HomeScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleProfilePress = () => {
    navigation.openDrawer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreetingByTime()}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Bell size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: "#FF6B35" }]}
              onPress={handleProfilePress}
              activeOpacity={0.7}
            >
              <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "700" }}>
                E
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mood Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodChipsScroll}
        >
          {moodChips.map((chip) => (
            <TouchableOpacity
              key={chip.id}
              style={styles.moodChip}
              activeOpacity={0.7}
            >
              <View
                style={[styles.moodChipImage, { backgroundColor: chip.color }]}
              />
              <Text style={styles.moodChipText} numberOfLines={2}>
                {chip.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Playlist Banner */}
        <TouchableOpacity style={styles.playlistBanner} activeOpacity={0.7}>
          <View style={[styles.bannerImage, { backgroundColor: "#FF6B35" }]} />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerText}>
              Playlist music that accompanies you on the way home
            </Text>
          </View>
        </TouchableOpacity>

        {/* For You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For You 💎</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forYouScroll}
          >
            {forYou.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.forYouCard}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.forYouImageContainer,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.forYouTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Hits Music Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hits Music 🎹</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hitsScroll}
          >
            {hitsMusic.map((item) => (
              <TouchableOpacity key={item.id} style={styles.hitCard}>
                <View
                  style={[
                    styles.hitImageContainer,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.hitTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Moodbooster Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Moodbooster 🔥</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodboosterScroll}
          >
            {moodbooster.map((item) => (
              <TouchableOpacity key={item.id} style={styles.moodboosterCard}>
                <View
                  style={[
                    styles.moodboosterImage,
                    { backgroundColor: item.color },
                  ]}
                />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#A0A0A0",
    textAlign: "center",
  },
  moodChipsScroll: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  moodChip: {
    backgroundColor: "#2A2A2A",
    borderRadius: 4,
    padding: 0,
    paddingLeft: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: 250,
    overflow: "hidden",
  },
  moodChipImage: {
    width: 65,
    height: 65,
  },
  moodChipText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    lineHeight: 18,
  },
  playlistBanner: {
    flexDirection: "row",
    backgroundColor: "#2952E8",
    marginHorizontal: 14,
    marginLeft: 80,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 54,
    height: 80,
    padding: 6,
  },
  bannerImage: {
    width: 90,
    height: 110,
    borderRadius: 2,
    marginLeft: -65,
    transform: [{ rotate: "4deg" }],
  },
  bannerContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: "center",
  },
  bannerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  bannerMenu: {
    padding: 8,
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
    color: "#999",
    fontWeight: "500",
  },
  forYouScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  forYouCard: {
    width: 150,
  },
  forYouImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  forYouTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  hitsScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  hitCard: {
    width: 150,
  },
  hitImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  hitImage: {
    width: "100%",
    height: "100%",
  },
  hitTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  moodboosterScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  moodboosterCard: {
    width: 150,
    height: 150,
    borderRadius: 4,
    overflow: "hidden",
  },
  moodboosterImage: {
    width: "100%",
    height: "100%",
  },
});
