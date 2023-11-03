import {SafeAreaView, StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import React from 'react';
import colors from '@utils/colors';
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';

const signupSchema = yup.object({
  name: yup
    .string()
    .trim('Name is missing!')
    .min(3, 'Invalid name!')
    .required('Name is required'),
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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Password is too weak!',
    )
    .required('Password is required!'),
});

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Form
        onSubmit={values => console.log(values)}
        initialValues={initialValues}
        validationSchema={signupSchema}>
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            label="Name"
            placeholder="Name"
            containerStyle={styles.spacerBottom}
          />
          <AuthInputField
            name="email"
            label="Email"
            placeholder="Username or email address"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.spacerBottom}
          />
          <AuthInputField
            name="password"
            label="Password"
            placeholder="Password"
            autoCapitalize="none"
            secureTextEntry
            containerStyle={styles.spacerBottom}
          />
          <SubmitBtn title="Sign Up" />
        </View>
      </Form>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 15, // padding in the x direction (left and right)
  },
  spacerBottom: {
    marginBottom: 15,
  },
});

export default SignUp;
