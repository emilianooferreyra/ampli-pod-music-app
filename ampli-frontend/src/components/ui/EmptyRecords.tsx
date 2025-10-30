import colors from '@/constants/colors';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface EmptyRecordsProps {
  title: string;
}

export const EmptyRecords: React.FC<EmptyRecordsProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

export default EmptyRecords;
