import {StyleSheet, Text, View} from 'react-native';
import colors from 'src/constants/colors';

interface Props {
  progress: number;
}

const Progress = ({progress}: Props) => {
  return (
    <View>
      <Text style={styles.title}>{`${progress}%`}</Text>
      <View style={[styles.progressBar, {width: `${progress}%`}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.SECONDARY,
    borderRadius: 5,
  },
});

export default Progress;
