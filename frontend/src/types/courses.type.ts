export interface ICourseVideo {
  title: string;
  description: string;
  url: string;
  cover: string;
  duration: string;
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  category: string[];
  videos: ICourseVideo[];
  favoritedBy: string[];
  watchedBy: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AddCourse {
  title: string;
  description: string;
  category: string[];
  videos: ICourseVideo[];
  publishedAt?: Date;
}
