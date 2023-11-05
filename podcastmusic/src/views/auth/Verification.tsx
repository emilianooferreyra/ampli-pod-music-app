import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import AuthFormContainer from '@components/AuthFormContainer';
import Link from '@ui/Link';
import OTPField from '@ui/OTPField';
import Button from '@ui/Button';

const otpFields = new Array(6).fill('');

const Verification = () => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const inputRef = useRef<TextInput>(null);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    if (value === 'Backspace') {
      // moves to the previous only if the field is empty
      if (!newOtp[index]) {
        setActiveOtpIndex(index - 1);
      }
      newOtp[index] = '';
    } else {
      // update otp and move to the next
      setActiveOtpIndex(index + 1);
      newOtp[index] = value;
      setOtp(newOtp);
    }
    setOtp([...newOtp]);
  };

  const handleSubmit = () => {};

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };

  return (
    <AuthFormContainer heading="Please look at your email.">
      <View style={styles.inputOTPcontainer}>
        {otpFields.map((_, index) => {
          return (
            <OTPField
              ref={activeOtpIndex === index ? inputRef : null}
              key={index}
              placeholder="-"
              onKeyPress={({nativeEvent}) => {
                handleChange(nativeEvent.key, index);
              }}
              onChangeText={handlePaste}
              keyboardType="numeric"
              value={otp[index] || ''}
            />
          );
        })}
      </View>
      <Button title="Submit" onPress={handleSubmit} />
      <View style={styles.linkContainer}>
        <Link title="Re-send OTP" onPress={() => {}} />
      </View>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  inputOTPcontainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default Verification;
