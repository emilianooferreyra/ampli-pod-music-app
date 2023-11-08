import {Pressable, StyleSheet, Text, ViewStyle, StyleProp} from 'react-native';
import React from 'react';
import colors from '@utils/colors';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  busy?: boolean;
  styleCustom?: StyleProp<ViewStyle>;
}
const Button = ({title, busy, styleCustom, onPress}: Props) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, styleCustom]}>
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
    borderRadius: 30,
    backgroundColor: colors.SECONDARY,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default Button;
