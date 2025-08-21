export interface IShort {
  _id: string;
  title: string;
  description: string;
  filter: string[];
  category: string[];
  video: string;
  cover: string;
  duration: string;
  free: boolean;
  recommended: boolean;
  level?: string;
  favoritedBy?: string[];
  watchedBy?: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
