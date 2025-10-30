import { create } from 'zustand';

interface PlaylistModalState {
  visible: boolean;
  selectedListId?: string;
  isPrivate?: boolean;
  allowPlaylistAudioRemove?: boolean;
}

interface PlaylistModalStore extends PlaylistModalState {
  setVisible: (visible: boolean) => void;
  setSelectedListId: (id: string) => void;
  setIsPrivate: (isPrivate: boolean) => void;
  setAllowPlaylistAudioRemove: (allow: boolean) => void;
  reset: () => void;
}

export const usePlaylistModalStore = create<PlaylistModalStore>((set) => ({
  visible: false,
  selectedListId: undefined,
  isPrivate: undefined,
  allowPlaylistAudioRemove: undefined,

  setVisible: (visible) => set({ visible }),
  setSelectedListId: (id) => set({ selectedListId: id }),
  setIsPrivate: (isPrivate) => set({ isPrivate }),
  setAllowPlaylistAudioRemove: (allow) => set({ allowPlaylistAudioRemove: allow }),
  reset: () => set({
    visible: false,
    selectedListId: undefined,
    isPrivate: undefined,
    allowPlaylistAudioRemove: undefined,
  }),
}));
