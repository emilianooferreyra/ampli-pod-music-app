import colors from 'src/constants/colors';
import {TextInputProps, StyleSheet, TextInput} from 'react-native';

interface Props extends TextInputProps {}

const Input = (props: Props) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
      style={[styles.input, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    height: 45,
    borderRadius: 5,
    color: colors.CONTRAST,
    padding: 10,
  },
});

export default Input;
