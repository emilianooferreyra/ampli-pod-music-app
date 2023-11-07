import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import React, {useState} from 'react';
import colors from '@utils/colors';
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import Link from '@ui/Link';
import Icon from 'react-native-vector-icons/Entypo';
import AuthFormContainer from '@components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamsList} from '@src/@types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';

const signinSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Invalid email!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim('Password is missing!')
    .min(8, 'Password is too short!')
    .required('Password is required!'),
});

interface SignInUserInfo {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

const SignIn = () => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamsList>>();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: SignInUserInfo,
    actions: FormikHelpers<SignInUserInfo>,
  ) => {
    actions.setSubmitting(true);
    try {
      // we want to send these information to our api
      const {data} = await client.post('/auth/sign-in', {...values});
      console.log(data);
    } catch (error) {
      console.log('Sign in error:', error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signinSchema}>
      <AuthFormContainer heading="Welcome back">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            label="Email"
            placeholder="Username or email address"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.spacer}
            rightIcon={<Icon name="email" color={colors.CONTRAST} size={16} />}
          />
          <AuthInputField
            name="password"
            label="Password"
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={styles.spacer}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePasswordView}
          />
          <SubmitBtn title="Sign in" />
          <View style={styles.linkContainer}>
            <Link
              title="Forgot password?"
              onPress={() => {
                navigation.navigate('LostPassword');
              }}
            />
            <Link
              title="Sign up"
              onPress={() => {
                navigation.navigate('SignUp');
              }}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  spacer: {
    marginBottom: 15,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SignIn;
