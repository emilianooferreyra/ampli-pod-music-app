import colors from '@utils/colors';
import {Pressable, StyleSheet, Text} from 'react-native';

interface Props {
  title: string;
  onPress?(): void;
  active?: boolean;
}

const Link = ({title, onPress, active}: Props) => {
  return (
    <Pressable onPress={onPress} style={{opacity: active ? 1 : 0.4}}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.CONTRAST,
  },
});

export default Link;
