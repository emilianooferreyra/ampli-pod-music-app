import {Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '@utils/colors';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  busy?: boolean;
}
const Button = ({title, busy, onPress}: Props) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {!busy ? <Text style={styles.title}>{title}</Text> : <Loader />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: colors.SECONDARY,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default Button;
