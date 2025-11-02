import { useNavigation } from "@react-navigation/native";
import colors from "@/constants/colors";
import type { FC } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { ArrowLeft } from "lucide-react-native";

interface Props {
  title: string;
}

const AppHeader: FC<Props> = ({ title }) => {
  const { goBack, canGoBack } = useNavigation();

  if (!canGoBack()) return null;

  return (
    <View style={styles.container}>
      <Pressable onPress={goBack}>
        <ArrowLeft size={24} color={colors.TEXT_PRIMARY} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.BACKGROUND_SECONDARY,
    height: 45,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AppHeader;
