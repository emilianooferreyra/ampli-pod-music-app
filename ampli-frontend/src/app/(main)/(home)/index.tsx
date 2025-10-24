import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.paragraph}>Welcome to Ampli Pod Music App</Text>

      <Link href="/public-profile/123" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Public Profile Example</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/profile" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to Your Profile</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 16,
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  paragraph: {
    textAlign: "center",
    fontSize: 16,
    color: "#A0A0A0",
  },
  button: {
    backgroundColor: "#B794F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});
