export interface IVideo {
  _id: string;
  title: string;
  description: string;
  category: string[];
  author?: string;
  level?: string;
  video: string;
  cover?: string;
  favoritedBy: string[];
  watchedBy: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
