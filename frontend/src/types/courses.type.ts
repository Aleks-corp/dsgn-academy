export interface ICourseVideo {
  _id?: string;
  title: string;
  description: string;
  url: string;
  originalUrl?: string;
  cover: string;
  duration: string;
  watched?: { progress: number };
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  category: string[];
  videos: ICourseVideo[];
  bookmarked?: boolean;
  likedBy?: {
    count: number;
    isLiked: boolean;
  };
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
