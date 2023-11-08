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
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamsList} from '@src/@types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Invalid email!')
    .required('Email is required!'),
});

interface InitialValues {
  email: string;
}

const initialValues = {
  email: '',
};

const handleSubmit = async (
  values: InitialValues,
  actions: FormikHelpers<InitialValues>,
) => {
  actions.setSubmitting(true);
  try {
    // we want to send these information to our api
    const {data} = await client.post('/auth/forget-password', {...values});
    console.log(data);
  } catch (error) {
    console.log('Lost password  error: ', error);
  }
  actions.setSubmitting(false);
};

const LostPassword = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamsList>>();

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={lostPasswordSchema}>
      <AuthFormContainer
        heading="Forget Password!"
        subHeading="Oops, did you forget your password? Don't worry, we'll help you get back in.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.spacerButtom}
            rightIcon={<Icon name="email" color={colors.CONTRAST} size={16} />}
          />

          <SubmitBtn title="Send link" />
          <View style={styles.linkContainer}>
            <Link
              title="Sign up"
              onPress={() => {
                navigation.navigate('SignUp');
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
  spacerButtom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default LostPassword;
