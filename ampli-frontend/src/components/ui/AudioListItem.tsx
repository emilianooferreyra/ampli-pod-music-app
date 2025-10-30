import colors from '@/constants/colors';
import React from 'react';
import { View, StyleSheet, Pressable, Image, Text } from 'react-native';
import type { AudioData } from '@/types/audio';
import PlayAnimation from './PlayAnimation';

interface AudioListItemProps {
  audio: AudioData;
  onPress?: () => void;
  onLongPress?: () => void;
  isPlaying?: boolean;
}

export const AudioListItem: React.FC<AudioListItemProps> = ({
  audio,
  isPlaying = false,
  onPress,
  onLongPress,
}) => {
  const getSource = (poster?: string) => {
    return poster ? { uri: poster } : require('@/assets/music.png');
  };

  return (
    <Pressable
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.listItem}
    >
      <View>
        <Image source={getSource(audio.poster)} style={styles.poster} />
        <PlayAnimation visible={isPlaying} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {audio.title}
        </Text>
        <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
          {audio.owner.name}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    backgroundColor: colors.GRAY_800,
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
  titleContainer: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  poster: {
    width: 50,
    height: 50,
    backgroundColor: colors.GRAY_700,
  },
  title: {
    color: colors.TEXT_PRIMARY,
    fontWeight: '700',
    fontSize: 13,
  },
  owner: {
    color: colors.SECONDARY,
    fontWeight: '700',
    fontSize: 11,
  },
});

export default AudioListItem;
