import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamsList} from 'src/@types/navigation';
import AuthFormContainer from '@components/AuthFormContainer';
import Link from '@ui/Link';
import OTPField from '@ui/OTPField';
import Button from '@ui/Button';
import client from 'src/api/client';
import colors from '@utils/colors';

type Props = NativeStackScreenProps<AuthStackParamsList, 'Verification'>;

const otpFields = new Array(6).fill('');

const Verification = ({route}: Props) => {
  const navigation = useNavigation<NavigationProp<AuthStackParamsList>>();
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [countDown, setcountDown] = useState(60);
  const [canSendNewOptRequest, setCanSendNewOptRequest] = useState(false);

  const {userInfo} = route.params;

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
    }
    setOtp([...newOtp]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };

  const isValidOtp = otp.every(value => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) {
      return;
    }
    setSubmitting(true);

    try {
      const {data} = await client.post('/auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });
      // navigate back to sign in
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('Error inside Verification:', error);
    }
    setSubmitting(false);
  };

  const requestForOTP = async () => {
    setcountDown(60);
    setCanSendNewOptRequest(false);
    try {
      await client.post('/auth/re-verify-email', {userId: userInfo.id});
    } catch (error) {
      console.log('Requesting for new OTP: ', error);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (canSendNewOptRequest) {
      return;
    }

    const intervalId = setInterval(() => {
      setcountDown(oldCountDown => {
        if (oldCountDown <= 0) {
          setCanSendNewOptRequest(true);
          clearInterval(intervalId);

          return 0;
        }
        return oldCountDown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [canSendNewOptRequest]);

  return (
    <AuthFormContainer heading="Please look at your email.">
      <View style={styles.inputContainer}>
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
      <Button busy={submitting} title="Submit" onPress={handleSubmit} />
      <View style={styles.linkContainer}>
        {countDown > 0 ? (
          <Text style={styles.countDown}>{countDown} sec</Text>
        ) : null}
        <Link
          active={canSendNewOptRequest}
          title="Re-send OTP"
          onPress={requestForOTP}
        />
      </View>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  linkContainer: {
    width: '100%',
    marginTop: 20,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});

export default Verification;
