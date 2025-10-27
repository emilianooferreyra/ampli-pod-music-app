import { View, StyleSheet } from "react-native";
import AmpliIcon from "@assets/ampli-app-icon.svg";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <AmpliIcon width={100} height={100} />
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
