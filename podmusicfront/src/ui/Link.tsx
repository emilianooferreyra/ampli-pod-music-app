import colors from 'src/constants/colors';
import {StyleSheet, Pressable, Text} from 'react-native';

interface Props {
  title: string;
  onPress?(): void;
  active?: boolean;
}

const Link = ({title, active = true, onPress}: Props) => {
  return (
    <Pressable
      onPress={active ? onPress : null}
      style={{opacity: active ? 1 : 0.4}}>
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
