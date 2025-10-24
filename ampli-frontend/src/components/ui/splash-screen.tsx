import { View, StyleSheet } from "react-native";
import SplashLogo from "@assets/SplashLogo.svg";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <SplashLogo />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
});
