import colors from '@utils/colors';
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';

interface Props {
  color?: string;
}

const Loader = ({color = colors.CONTRAST}: Props) => {
  const rotation = useSharedValue(0);
  const transform = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360), -1);
  }, []);

  return (
    <Animated.View style={transform}>
      <Icon name="loading1" size={24} color={color} />
    </Animated.View>
  );
};

export default Loader;
