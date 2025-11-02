import AudioListModal from '@/components/ui/AudioListModal';
import type { FC } from 'react';
import { usePlayerStore } from '@/store';
import { useAudioController } from "@/hooks/use-audio-controller";

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const CurrentAudioList: FC<Props> = ({ visible, onRequestClose }) => {
  const { playlist } = usePlayerStore();
  const { onAudioPress } = useAudioController();

  return (
    <AudioListModal
      visible={visible}
      onRequestClose={onRequestClose}
      header="Audios on the way"
      data={playlist}
      onItemPress={onAudioPress}
    />
  );
};

export default CurrentAudioList;
