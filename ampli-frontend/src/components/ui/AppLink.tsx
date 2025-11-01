import { FC } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import colors from '@/constants/colors';

interface Props {
  title: string;
  onPress?: () => void;
}

const AppLink: FC<Props> = ({ title, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.link}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  link: {
    color: colors.ACCENT,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default AppLink;
