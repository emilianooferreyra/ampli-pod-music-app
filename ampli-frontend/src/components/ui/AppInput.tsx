import type { FC } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import colors from "@/constants/colors";

interface Props {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  label?: string;
  [key: string]: any;
}

const AppInput: FC<Props> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  error,
  label,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor={colors.TEXT_SECONDARY}
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multilineInput,
        ]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.TEXT_PRIMARY,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.BACKGROUND_TERTIARY,
    borderWidth: 1,
    borderColor: colors.BORDER_LIGHT,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.TEXT_PRIMARY,
    height: 40,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  inputError: {
    borderColor: colors.ERROR,
  },
  errorText: {
    color: colors.ERROR,
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppInput;
