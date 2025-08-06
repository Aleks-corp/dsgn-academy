export interface ICourseVideo {
  url: string;
  description?: string;
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  category: string[];
  author?: string;
  level?: string;
  videos: ICourseVideo[];
  cover?: string;
  favoritedBy: string[];
  watchedBy: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
