import { View, Text } from "react-native";

export default function NewsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#1a1a1a", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "#FFF", fontSize: 24 }}>Novedades</Text>
      <Text style={{ color: "#999", marginTop: 8 }}>Coming soon</Text>
    </View>
  );
}
