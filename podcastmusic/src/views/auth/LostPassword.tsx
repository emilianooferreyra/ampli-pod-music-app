import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import React from 'react';
import colors from '@utils/colors';
import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import Link from '@ui/Link';
import Icon from 'react-native-vector-icons/Entypo';
import AuthFormContainer from '@components/AuthFormContainer';

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Invalid email!')
    .required('Email is required!'),
});

const initialValues = {
  email: '',
};

const LostPassword = () => {
  return (
    <Form
      onSubmit={values => console.log(values)}
      initialValues={initialValues}
      validationSchema={lostPasswordSchema}>
      <AuthFormContainer
        heading="Forget Password!"
        subHeading="Oops, did you forget your password? Don't worry, we'll help you get back in.">
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

          <SubmitBtn title="Send link" />
          <View style={styles.linkContainer}>
            <Link title="Sign up" onPress={() => {}} />
            <Link title="Sign in" onPress={() => {}} />
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

export default LostPassword;
