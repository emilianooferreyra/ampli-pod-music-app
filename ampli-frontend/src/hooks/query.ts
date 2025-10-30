import { useQuery } from '@tanstack/react-query';
import type { AudioData, CompletePlaylist, History, Playlist } from '@/types/audio';
import type { PublicProfile } from '@/types/user';
import { getClient } from '@/api/client';
import { useNotificationStore } from '@/store';
import catchAsyncError from '@/api/catchError';

// ========== LATEST AUDIOS ==========
const fetchLatest = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['latest-uploads'],
    queryFn: () => fetchLatest(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
  });
};

// ========== RECOMMENDED AUDIOS ==========
const fetchRecommended = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get('/profile/recommended');
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['recommended'],
    queryFn: () => fetchRecommended(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
  });
};

// ========== PLAYLISTS ==========
const fetchPlaylist = async (pageNo = 0): Promise<Playlist[]> => {
  const client = await getClient();
  const { data } = await client.get(`/playlist/by-profile?limit=10&pageNo=${pageNo}`);
  return data.playlist;
};

export const useFetchPlaylist = () => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['playlist'],
    queryFn: () => fetchPlaylist(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
  });
};

// ========== UPLOADS BY PROFILE ==========
const fetchUploadsByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get('/profile/uploads');
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['uploads-by-profile'],
    queryFn: () => fetchUploadsByProfile(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
  });
};

// ========== FAVORITES ==========
const fetchFavorites = async (pageNo = 0): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get(`/favorite?pageNo=${pageNo}`);
  return data.audios;
};

export const useFetchFavorite = () => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['favorite'],
    queryFn: () => fetchFavorites(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
  });
};

// ========== HISTORIES ==========
const fetchHistories = async (pageNo = 0): Promise<History[]> => {
  const client = await getClient();
  const { data } = await client.get(`/history?limit=15&pageNo=${pageNo}`);
  return data.histories;
};

export const useFetchHistories = () => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['histories'],
    queryFn: () => fetchHistories(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
  });
};

// ========== RECENTLY PLAYED ==========
const fetchRecentlyPlayed = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get('/history/recently-played');
  return data.audios;
};

export const useFetchRecentlyPlayed = () => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['recently-played'],
    queryFn: () => fetchRecentlyPlayed(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
  });
};

// ========== RECOMMENDED PLAYLISTS ==========
const fetchRecommendedPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const { data } = await client.get('/profile/auto-generated-playlist');
  return data.playlist;
};

export const useFetchRecommendedPlaylist = () => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['recommended-playlist'],
    queryFn: () => fetchRecommendedPlaylist(),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
  });
};

// ========== IS FAVORITE ==========
const fetchIsFavorite = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const { data } = await client.get(`/favorite/is-fav?audioId=${id}`);
  return data.result;
};

export const useFetchIsFavorite = (id: string) => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['favorite', id],
    queryFn: () => fetchIsFavorite(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
    enabled: !!id,
  });
};

// ========== PUBLIC PROFILE ==========
const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const client = await getClient();
  const { data } = await client.get(`/profile/info/${id}`);
  return data.profile;
};

export const useFetchPublicProfile = (id: string) => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => fetchPublicProfile(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
    enabled: !!id,
  });
};

// ========== PUBLIC UPLOADS ==========
const fetchPublicUploads = async (id: string): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get(`/profile/uploads/${id}`);
  return data.audios;
};

export const useFetchPublicUploads = (id: string) => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['uploads', id],
    queryFn: () => fetchPublicUploads(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
    enabled: !!id,
  });
};

// ========== PUBLIC PLAYLISTS ==========
const fetchPublicPlaylist = async (id: string): Promise<Playlist[]> => {
  const client = await getClient();
  const { data } = await client.get(`/profile/playlist/${id}`);
  return data.playlist;
};

export const useFetchPublicPlaylist = (id: string) => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: () => fetchPublicPlaylist(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
    enabled: !!id,
  });
};

// ========== PLAYLIST AUDIOS ==========
const fetchPlaylistAudios = async (
  id: string,
  isPrivate: boolean
): Promise<CompletePlaylist> => {
  const endpoint = isPrivate
    ? `/profile/private-playlist-audios/${id}`
    : `/profile/playlist-audios/${id}`;
  const client = await getClient();
  const { data } = await client.get(endpoint);
  return data.list;
};

export const useFetchPlaylistAudios = (id: string, isPrivate: boolean) => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['playlist-audios', id],
    queryFn: () => fetchPlaylistAudios(id, isPrivate),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
    enabled: !!id,
  });
};

// ========== IS FOLLOWING ==========
const fetchIsFollowing = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const { data } = await client.get(`/profile/is-following/${id}`);
  return data.status;
};

export const useFetchIsFollowing = (id: string) => {
  const { addNotification } = useNotificationStore();
  return useQuery({
    queryKey: ['is-following', id],
    queryFn: () => fetchIsFollowing(id),
    onError(err: any) {
      const errorMessage = catchAsyncError(err);
      addNotification(errorMessage, 'error');
    },
    enabled: !!id,
  });
};
