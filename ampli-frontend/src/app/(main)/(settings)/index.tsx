import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  User,
  Bell,
  Music2,
  Download,
  Play,
  LogOut,
  ChevronRight,
} from "lucide-react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [autoDownload, setAutoDownload] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...");
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.header}></Text>

        {/* Settings Options */}
        <View style={styles.section}>
          {/* Your Account */}
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <User size={24} color="#FFFFFF" />
              <Text style={styles.optionText}>Your account</Text>
            </View>
            <ChevronRight size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Bell size={24} color="#FFFFFF" />
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <ChevronRight size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Audio Quality */}
          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Music2 size={24} color="#FFFFFF" />
              <View>
                <Text style={styles.optionText}>Audio quality</Text>
                <Text style={styles.optionSubtext}>320kbps(Full HD)</Text>
              </View>
            </View>
            <ChevronRight size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Auto Downloading */}
          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Download size={24} color="#FFFFFF" />
              <Text style={styles.optionText}>Auto downloading</Text>
            </View>
            <Switch
              value={autoDownload}
              onValueChange={setAutoDownload}
              trackColor={{ false: "#767577", true: "#B794F6" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Autoplay */}
          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Play size={24} color="#FFFFFF" />
              <Text style={styles.optionText}>Autoplay</Text>
            </View>
            <Switch
              value={autoplay}
              onValueChange={setAutoplay}
              trackColor={{ false: "#767577", true: "#B794F6" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Log Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <View style={styles.optionLeft}>
              <LogOut size={24} color="#FFFFFF" />
              <Text style={styles.optionText}>Log Out</Text>
            </View>
            <ChevronRight size={24} color="#FFFFFF" />
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  optionSubtext: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
