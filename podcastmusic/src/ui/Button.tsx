import {Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '@utils/colors';

interface Props {
  title: string;
  onPress?(): void;
}
const Button = ({title, onPress}: Props) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
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
