export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  publishedAt: string;
  podcastId: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentEpisode: Episode | null;
  currentTime: number;
  duration: number;
  volume: number;
}

export type Theme = "light" | "dark" | "system";
