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
import Icon2 from 'react-native-vector-icons/Ionicons';
import AuthFormContainer from '@components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamsList} from '@src/@types/navigation';
import client from 'src/api/client';
import {FormikHelpers} from 'formik';

const signupSchema = yup.object({
  name: yup
    .string()
    .trim('Name is missing!')
    .min(3, 'Invalid name!')
    .required('Name is required!'),
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Invalid email!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim('Password is missing!')
    .min(8, 'Password is too short!')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Password is too simple!',
    )
    .required('Password is required!'),
});

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp = () => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamsList>>();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    actions.setSubmitting(true);
    try {
      // we want to send these information to our api
      const {data} = await client.post('/auth/create', {...values});
      navigation.navigate('Verification', {userInfo: data.user});
    } catch (error) {
      console.log('Sign up error: ', error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signupSchema}>
      <AuthFormContainer
        heading="Welcome"
        subHeading="Let's get started by creatingn your account.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            label="Name"
            placeholder="Name"
            containerStyle={styles.spacer}
            rightIcon={
              <Icon2 name="person" color={colors.CONTRAST} size={16} />
            }
          />
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
          <SubmitBtn title="Sign Up" />
          <View style={styles.linkContainer}>
            <Link
              title="Forgot password?"
              onPress={() => {
                navigation.navigate('LostPassword');
              }}
            />
            <Link
              title="Sign in"
              onPress={() => {
                navigation.navigate('SignIn');
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
    marginBottom: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SignUp;
