import { View, StyleSheet, Text } from "react-native";
import colors from "@/constants/colors";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ampli</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.BACKGROUND,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.ACCENT,
  },
});
