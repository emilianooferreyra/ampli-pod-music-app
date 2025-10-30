import colors from '@/constants/colors';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PulseAnimationContainer from './PulseAnimationContainer';

interface AudioListLoadingUIProps {
  items?: number;
}

export const AudioListLoadingUI: React.FC<AudioListLoadingUIProps> = ({
  items = 8,
}) => {
  const dummyData = new Array(items).fill('');

  return (
    <PulseAnimationContainer>
      <View>
        {dummyData.map((_, index) => {
          return <View key={index} style={styles.dummyListItem} />;
        })}
      </View>
    </PulseAnimationContainer>
  );
};

const styles = StyleSheet.create({
  dummyListItem: {
    height: 50,
    width: '100%',
    backgroundColor: colors.GRAY_700,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default AudioListLoadingUI;
