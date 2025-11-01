import type { FC } from "react";
import { Pressable, StyleSheet, Text, ActivityIndicator } from "react-native";
import colors from "@/constants/colors";

interface Props {
  title: string;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  [key: string]: any;
}

const AppButton: FC<Props> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.BLACK : colors.ACCENT}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`text_${variant}`],
            styles[`text_${size}`],
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  primary: {
    backgroundColor: colors.ACCENT,
  },
  secondary: {
    backgroundColor: colors.BACKGROUND_SECONDARY,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.ACCENT,
  },
  disabled: {
    opacity: 0.5,
  },
  size_small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  size_medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  size_large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  text: {
    fontWeight: "600",
  },
  text_primary: {
    color: colors.BLACK,
  },
  text_secondary: {
    color: colors.TEXT_PRIMARY,
  },
  text_outline: {
    color: colors.ACCENT,
  },
  text_small: {
    fontSize: 12,
  },
  text_medium: {
    fontSize: 14,
  },
  text_large: {
    fontSize: 16,
  },
});

export default AppButton;
