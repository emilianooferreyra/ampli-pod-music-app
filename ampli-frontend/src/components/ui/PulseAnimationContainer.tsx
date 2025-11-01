import React, { type ReactNode, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface PulseAnimationContainerProps {
  children: ReactNode;
}

export const PulseAnimationContainer: React.FC<
  PulseAnimationContainerProps
> = ({ children }) => {
  const opacitySharedValue = useSharedValue(1);

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacitySharedValue.value,
    };
  });

  useEffect(() => {
    opacitySharedValue.value = withRepeat(
      withTiming(0.3, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  return <Animated.View style={opacityStyle}>{children}</Animated.View>;
};

export default PulseAnimationContainer;
