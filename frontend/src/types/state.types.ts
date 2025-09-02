import { IUser } from "@/types/users.type";
import { ICourse } from "@/types/courses.type";
import { IVideo } from "@/types/videos.type";
import { IShort, TagsMode, TopTagItem } from "@/types/shorts.type";

export interface State {
  courses: CourseState;
  videos: VideoState;
  shorts: ShortState;
  auth: AuthState;
  admin: AdminState;
  // test: TestState;
}

export interface CourseState {
  courses: ICourse[];
  totalHits: number;
  totalCourses: number | undefined;
  currentFilter: string;
  selectedCourse: ICourse | null;
  isLoading: boolean;
  error: string;
  courseToEdit: ICourse | null;
}

export interface VideoState {
  videos: IVideo[];
  totalHits: number;
  categories: {
    category: string;
    count: number;
  }[];
  filters: {
    filter: string;
    count: number;
  }[];
  selectedCategory: string | null;
  totalVideos: number | undefined;
  totalFree: number | undefined;
  currentFreeFilter: boolean;
  selectedVideo: IVideo | null;
  isLoading: boolean;
  error: string;
  videoToEdit: IVideo | null;
}

export interface ShortState {
  shorts: IShort[];
  totalShorts: number | undefined;
  nextCursor: string | null;
  isLoading: boolean;
  error: string | null;
  selected: IShort | null;
  sequence: string[];
  seqCursor: string | null;
  topTags: TopTagItem[];
  // filters
  activeTags: string[];
  tagsMode: TagsMode;
  limit: number;
}

export interface AuthState {
  token: string;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  isLogining: boolean;
  error: string;
  profile: IUser | null;
}

export interface AdminState {
  folowers: IUser[];
  totalFolowers: number;
  isLoading: boolean;
  isLoadingUpdate: boolean;
  isLoadingCheck: boolean;
  isLoadingMore: boolean;
  error: string;
}

// export interface TestState {
//   isAlpha: boolean;
//   isTester: boolean;
//   error: string;
//   isLoading: boolean;
//   timer: number | null;
// }
