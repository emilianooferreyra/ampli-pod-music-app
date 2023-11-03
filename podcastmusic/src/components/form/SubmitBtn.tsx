import Button from '@ui/Button';
import {useFormikContext} from 'formik';
import React from 'react';

interface Props {
  title: string;
}

const SubmitBtn = (props: Props) => {
  const {handleSubmit} = useFormikContext();

  return <Button onPress={handleSubmit} title={props.title} />;
};

export default SubmitBtn;
