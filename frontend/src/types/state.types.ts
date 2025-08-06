import { IUser } from "./users.type";
import { ICourse } from "./courses.type";
import { IVideo } from "./videos.type";

export interface State {
  courses: CourseState;
  videos: VideoState;
  auth: AuthState;
  //     admin: AdminState;
  test: TestState;
}

export interface CourseState {
  courses: ICourse[];
  totalHits: number;
  currentFilter: string;
  selectedCourse: ICourse | null;
  isLoading: boolean;
  error: string;
  courseToEdit: ICourse | null;
}

export interface VideoState {
  videos: IVideo[];
  totalHits: number;
  currentFilter: string;
  selectedVideo: IVideo | null;
  isLoading: boolean;
  error: string;
  videoToEdit: IVideo | null;
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
  totalVideos: number;
  unpublVideos: IVideo[];
  unpublVideo: IVideo | null;
  totalCources: number;
  unpublCources: IVideo[];
  unpublCource: IVideo | null;
  isLoading: boolean;
  isLoadingUpdate: boolean;
  isLoadingCheck: boolean;
  isLoadingMore: boolean;
  error: string;
}

export interface TestState {
  isAlpha: boolean;
  isTester: boolean;
  error: string;
  isLoading: boolean;
  timer: number | null;
}
