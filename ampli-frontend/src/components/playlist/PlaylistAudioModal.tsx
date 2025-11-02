import colors from '@/constants/colors';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ListRenderItem,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {
  RectButton,
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AudioData, CompletePlaylist } from '@/types/audio';
import { getClient } from '@/api/client';
import { useFetchPlaylistAudios } from "@/hooks/use-query";
import { useAudioController } from "@/hooks/use-audio-controller";
import { usePlayerStore, usePlaylistModalStore, useNotificationStore } from '@/store';
import AppModal from '@/components/ui/AppModal';
import AudioListItem from '@/components/ui/AudioListItem';
import AudioListLoadingUI from '@/components/ui/AudioListLoadingUI';
import EmptyRecords from '@/components/ui/EmptyRecords';
import { Trash2 } from 'lucide-react-native';

const removeAudioFromPlaylist = async (id: string, playlistId: string) => {
  const client = await getClient();
  await client.delete(`/playlist?playlistId=${playlistId}&resId=${id}`);
};

export const PlaylistAudioModal: React.FC = () => {
  const { visible, selectedListId, isPrivate, allowPlaylistAudioRemove } =
    usePlaylistModalStore();
  const { currentTrack } = usePlayerStore();
  const { onAudioPress } = useAudioController();
  const { setVisible } = usePlaylistModalStore();
  const { addNotification } = useNotificationStore();

  const { data, isLoading } = useFetchPlaylistAudios(
    selectedListId || '',
    isPrivate || false
  );

  const queryClient = useQueryClient();
  const [removing, setRemoving] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async ({ id, playlistId }: { id: string; playlistId: string }) =>
      removeAudioFromPlaylist(id, playlistId),
    onMutate: (variable: { id: string; playlistId: string }) => {
      queryClient.setQueryData<CompletePlaylist>(
        ['playlist-audios', selectedListId],
        (oldData) => {
          if (!oldData) return { title: '', id: '', audios: [] };

          const audios = oldData.audios.filter(
            (item) => item.id !== variable.id
          );

          return { ...oldData, audios };
        }
      );
    },
    onError: (error: any) => {
      addNotification(
        error?.message || 'Error al remover audio',
        'error'
      );
    },
  });

  const handleClose = () => {
    setVisible(false);
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.swipeableContainer, { transform: [{ scale }] }]}>
        <View style={styles.deleteButtonContent}>
          <Trash2 size={20} color={colors.WHITE} />
          <Text style={styles.deleteButtonText}>
            {removing ? 'Removing...' : 'Remove'}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderItem: ListRenderItem<AudioData> = ({ item }) => {
    if (allowPlaylistAudioRemove) {
      return (
        <Swipeable
          onSwipeableOpen={() => {
            deleteMutation.mutate({
              id: item.id,
              playlistId: selectedListId || '',
            });
            setRemoving(false);
          }}
          onSwipeableWillOpen={() => {
            setRemoving(true);
          }}
          renderRightActions={renderRightActions}
        >
          <RectButton onPress={() => onAudioPress(item, data?.audios || [])}>
            <AudioListItem
              audio={item}
              isPlaying={currentTrack?.id === item.id}
            />
          </RectButton>
        </Swipeable>
      );
    } else {
      return (
        <AudioListItem
          audio={item}
          isPlaying={currentTrack?.id === item.id}
          onPress={() => onAudioPress(item, data?.audios || [])}
        />
      );
    }
  };

  return (
    <GestureHandlerRootView>
      <AppModal visible={visible} onRequestClose={handleClose}>
        <View style={styles.container}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.ACCENT} />
          ) : (
            <>
              <Text style={styles.title}>{data?.title}</Text>
              <FlatList
                contentContainerStyle={styles.flatlist}
                data={data?.audios}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                  <EmptyRecords title="No audios in this playlist" />
                }
                scrollEnabled={true}
              />
            </>
          )}
        </View>
      </AppModal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  flatlist: {
    paddingBottom: 50,
  },
  title: {
    color: colors.TEXT_PRIMARY,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    marginBottom: 10,
  },
  swipeableContainer: {
    backgroundColor: colors.ERROR,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
    marginBottom: 15,
    borderRadius: 5,
  },
  deleteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: colors.WHITE,
    fontWeight: '600',
    fontSize: 12,
  },
});

export default PlaylistAudioModal;
