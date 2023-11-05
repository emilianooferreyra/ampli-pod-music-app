import colors from '@utils/colors';
import {forwardRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  ref: any;
}

const OTPField = forwardRef<TextInput, Props>((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      style={[styles.OTPInput, props.style]}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
    />
  );
});

const styles = StyleSheet.create({
  OTPInput: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderColor: colors.CONTRAST,
    borderWidth: 2,
    textAlign: 'center',
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 0,
    marginBottom: 20,
  },
});

export default OTPField;
