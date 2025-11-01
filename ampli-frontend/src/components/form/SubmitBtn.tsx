import AppButton from '@/components/ui/AppButton';
import { useFormikContext } from 'formik';
import { FC } from 'react';
import { StyleSheet } from 'react-native';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = (props) => {
  const { handleSubmit, isSubmitting } = useFormikContext();
  return (
    <AppButton
      loading={isSubmitting}
      onPress={handleSubmit}
      title={props.title}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default SubmitBtn;
