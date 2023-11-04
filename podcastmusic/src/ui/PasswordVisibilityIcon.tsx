import colors from '@utils/colors';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';

interface Props {
  privateIcon: boolean;
}

const PasswordVisibilityIcon = ({privateIcon}: Props) => {
  return privateIcon ? (
    <Icon name="eye" color={colors.CONTRAST} size={16} />
  ) : (
    <Icon name="eye-with-line" color={colors.CONTRAST} size={16} />
  );
};

export default PasswordVisibilityIcon;
