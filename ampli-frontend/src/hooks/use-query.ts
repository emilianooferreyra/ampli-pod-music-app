import { useQuery } from "@tanstack/react-query";
import type {
  AudioData,
  CompletePlaylist,
  History,
  Playlist,
} from "@/types/audio";
import type { PublicProfile } from "@/types/user";
import { getClient } from "@/api/client";

const fetchLatest = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get("/audio/latest");
  return data.audios;
};

export const useFetchLatestAudios = () => {
  return useQuery({
    queryKey: ["latest-uploads"],
    queryFn: () => fetchLatest(),
  });
};

const fetchRecommended = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get("/profile/recommended");
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  return useQuery({
    queryKey: ["recommended"],
    queryFn: () => fetchRecommended(),
  });
};

const fetchPlaylist = async (pageNo = 0): Promise<Playlist[]> => {
  const client = await getClient();
  const { data } = await client.get(
    `/playlist/by-profile?limit=10&pageNo=${pageNo}`
  );
  return data.playlist;
};

export const useFetchPlaylist = () => {
  return useQuery({
    queryKey: ["playlist"],
    queryFn: () => fetchPlaylist(),
  });
};

const fetchUploadsByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get("/profile/uploads");
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  return useQuery({
    queryKey: ["uploads-by-profile"],
    queryFn: () => fetchUploadsByProfile(),
  });
};

const fetchFavorites = async (pageNo = 0): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get(`/favorite?pageNo=${pageNo}`);
  return data.audios;
};

export const useFetchFavorite = () => {
  return useQuery({
    queryKey: ["favorite"],
    queryFn: () => fetchFavorites(),
  });
};

const fetchHistories = async (pageNo = 0): Promise<History[]> => {
  const client = await getClient();
  const { data } = await client.get(`/history?limit=15&pageNo=${pageNo}`);
  return data.histories;
};

export const useFetchHistories = () => {
  return useQuery({
    queryKey: ["histories"],
    queryFn: () => fetchHistories(),
  });
};

const fetchRecentlyPlayed = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get("/history/recently-played");
  return data.audios;
};

export const useFetchRecentlyPlayed = () => {
  return useQuery({
    queryKey: ["recently-played"],
    queryFn: () => fetchRecentlyPlayed(),
  });
};

const fetchRecommendedPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const { data } = await client.get("/profile/auto-generated-playlist");
  return data.playlist;
};

export const useFetchRecommendedPlaylist = () => {
  return useQuery({
    queryKey: ["recommended-playlist"],
    queryFn: () => fetchRecommendedPlaylist(),
  });
};

const fetchIsFavorite = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const { data } = await client.get(`/favorite/is-fav?audioId=${id}`);
  return data.result;
};

export const useFetchIsFavorite = (id: string) => {
  return useQuery({
    queryKey: ["favorite", id],
    queryFn: () => fetchIsFavorite(id),
    enabled: !!id,
  });
};

const fetchPublicProfile = async (id: string): Promise<PublicProfile> => {
  const client = await getClient();
  const { data } = await client.get(`/profile/info/${id}`);
  return data.profile;
};

export const useFetchPublicProfile = (id: string) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchPublicProfile(id),
    enabled: !!id,
  });
};

const fetchPublicUploads = async (id: string): Promise<AudioData[]> => {
  const client = await getClient();
  const { data } = await client.get(`/profile/uploads/${id}`);
  return data.audios;
};

export const useFetchPublicUploads = (id: string) => {
  return useQuery({
    queryKey: ["uploads", id],
    queryFn: () => fetchPublicUploads(id),
    enabled: !!id,
  });
};

const fetchPublicPlaylist = async (id: string): Promise<Playlist[]> => {
  const client = await getClient();
  const { data } = await client.get(`/profile/playlist/${id}`);
  return data.playlist;
};

export const useFetchPublicPlaylist = (id: string) => {
  return useQuery({
    queryKey: ["playlist", id],
    queryFn: () => fetchPublicPlaylist(id),
    enabled: !!id,
  });
};

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
  return useQuery({
    queryKey: ["playlist-audios", id],
    queryFn: () => fetchPlaylistAudios(id, isPrivate),
    enabled: !!id,
  });
};

const fetchIsFollowing = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const { data } = await client.get(`/profile/is-following/${id}`);
  return data.status;
};

export const useFetchIsFollowing = (id: string) => {
  return useQuery({
    queryKey: ["is-following", id],
    queryFn: () => fetchIsFollowing(id),
    enabled: !!id,
  });
};
