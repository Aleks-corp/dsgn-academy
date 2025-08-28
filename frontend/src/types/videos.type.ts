export interface IVideo {
  _id: string;
  title: string;
  description: string;
  filter: string[];
  category: string[];
  video: string;
  originalVideo?: string;
  cover: string;
  duration: string;
  free: boolean;
  recommended: boolean;
  favoritedBy?: string[];
  watchedBy?: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddVideo {
  title: string;
  description: string;
  filter: string[];
  category: string[];
  video: string;
  originalVideo?: string;
  cover: string;
  duration: string;
  free: boolean;
  recommended: boolean;
  publishedAt?: string;
}
