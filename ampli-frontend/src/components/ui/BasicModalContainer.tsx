import colors from '@/constants/colors';
import React, { ReactNode } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';

interface BasicModalContainerProps {
  visible?: boolean;
  onRequestClose?: () => void;
  children: ReactNode;
}

export const BasicModalContainer: React.FC<BasicModalContainerProps> = ({
  visible,
  children,
  onRequestClose,
}) => {
  return (
    <Modal onRequestClose={onRequestClose} visible={visible} transparent>
      <View style={styles.modalContainer}>
        <Pressable onPress={onRequestClose} style={styles.backdrop} />
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
    zIndex: -1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modal: {
    width: '90%',
    maxHeight: '50%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.BACKGROUND,
  },
});

export default BasicModalContainer;
