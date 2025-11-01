import { FC, ReactNode } from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';
import colors from '@/constants/colors';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
}

const AppModal: FC<Props> = ({
  visible,
  onRequestClose,
  children,
  animationType = 'slide',
  transparent = true,
}) => {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <View style={styles.contentContainer}>{children}</View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    backgroundColor: colors.BACKGROUND_SECONDARY,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '50%',
  },
});

export default AppModal;
