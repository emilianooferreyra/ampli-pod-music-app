import colors from '@/constants/colors';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedStrokeProps {
  delay: number;
  height: number;
}

export const AnimatedStroke: React.FC<AnimatedStrokeProps> = ({
  delay,
  height,
}) => {
  const sharedValue = useSharedValue(5);

  const heightStyle = useAnimatedStyle(() => ({
    height: sharedValue.value,
  }));

  useEffect(() => {
    sharedValue.value = withDelay(
      delay,
      withRepeat(withTiming(height, { duration: 600 }), -1, true)
    );
  }, []);

  return <Animated.View style={[styles.stroke, heightStyle]} />;
};

const styles = StyleSheet.create({
  stroke: {
    width: 4,
    backgroundColor: colors.ACCENT,
    marginRight: 5,
    borderRadius: 2,
  },
});

export default AnimatedStroke;
