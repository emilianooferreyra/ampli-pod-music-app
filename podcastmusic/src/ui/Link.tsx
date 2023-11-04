import colors from '@utils/colors';
import {Pressable, StyleSheet, Text} from 'react-native';

interface Props {
  title: string;
  onPress?(): void;
}

const Link = ({title, onPress}: Props) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
  },
});

export default Link;
