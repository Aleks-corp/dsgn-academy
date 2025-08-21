"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Vimeo from "@u-wave/react-vimeo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCourse } from "@/redux/courses/courseSlice";
import { fetchCourseById } from "@/redux/courses/course.thunk";
import { fetchRecommended } from "@/redux/videos/video.thunk";
import {
  selectIsLoadingCourses,
  selectCourse,
} from "@/selectors/courses.selector";
import Loader from "@/components/loaders/LoaderCircle";
import NotFoundComponent from "@/components/notFound/NotFound";
import SafeImage from "@/components/SafeImage";
import { PlayIcon } from "lucide-react";

import { withAlphaGuard } from "@/components/guards&providers/WithAlphaGuard";

type RecommendedVideo = {
  _id: string;
  title: string;
  cover: string;
  duration: string;
};

function CoursePage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isLoading = useAppSelector(selectIsLoadingCourses);
  const course = useAppSelector(selectCourse);

  const [recommended, setRecommended] = useState<RecommendedVideo[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchCourseById(id as string));
    return () => {
      dispatch(clearCourse());
    };
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchRecommended({ limit: 5, recommended: true })).then(
      (response) => setRecommended(response.payload.videos)
    );
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="w-20 h-20 mt-10">
        <Loader />
      </div>
    );
  }

  if (!course) {
    return <NotFoundComponent />;
  }
  const currentVideo = course.videos[selectedVideoIndex];
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-4 w-full mx-auto max-w-[1440px] py-6">
        {/* Ліва частина */}
        <div className="flex-1">
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            {!isReady && (
              <div className="relative w-full h-full flex items-center justify-center">
                <SafeImage
                  src={currentVideo.cover}
                  alt={currentVideo.title}
                  width={752}
                  height={423}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-20 h-20">
                  <Loader />
                </div>
              </div>
            )}
            {currentVideo.url && (
              <Vimeo
                key={currentVideo.url}
                video={currentVideo.url}
                responsive
                pip
                speed
                autoplay={false}
                width="100%"
                height="100%"
                playsInline
                onReady={() => setIsReady(true)}
              />
            )}
          </div>

          <h1 className="mt-4 text-xl font-semibold">{course.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentVideo.duration}
          </p>
          <p className="mt-4 text-sm whitespace-pre-line text-muted-foreground">
            {currentVideo.description}
          </p>
        </div>
        <aside className="font-inter w-full lg:w-[400px] max-h-[500px] flex flex-col border-[1px] border-muted-background rounded-xl bg-white overflow-hidden">
          <div className="py-3 pr-5 pl-8">
            <h2 className="text-lg font-bold">{course.title}</h2>
            <div>
              {course.category.map((c, i) => (
                <p className="flex gap-1 text-muted text-sm" key={i}>
                  {c}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col overflow-y-auto max-h-[70vh]">
            {course.videos.map((video, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsReady(false);
                  setSelectedVideoIndex(index);
                }}
                className={`flex gap-2 px-2 py-1 text-left transition cursor-pointer hover:bg-muted-background ${
                  index === selectedVideoIndex ? "bg-muted-background" : ""
                }`}
              >
                <div className="flex justify-center items-center">
                  {index === selectedVideoIndex ? (
                    <PlayIcon
                      size={16}
                      strokeWidth={1}
                      fill="#7B7B7B"
                      color="#7B7B7B"
                    />
                  ) : (
                    <p className="w-4 text-center text-muted text-sm">
                      {index + 1}
                    </p>
                  )}
                </div>
                <div className="relative w-24 h-14 rounded-md">
                  <SafeImage
                    src={video.cover}
                    alt={video.title}
                    width={96}
                    height={56}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute bottom-0 right-0 p-1">
                    {video.duration}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {video.description}
                  </span>
                </div>
              </button>
            ))}
            {/* {course.videos.map((video, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsReady(false);
                  setSelectedVideoIndex(index);
                }}
                className={`flex gap-2 px-2 py-1 text-left transition hover:bg-muted-background ${
                  index === selectedVideoIndex ? "bg-muted-background" : ""
                }`}
              >
                <div className="flex justify-center items-center">
                  {index === selectedVideoIndex ? (
                    <PlayIcon
                      size={18}
                      strokeWidth={1}
                      fill="#7B7B7B"
                      color="#7B7B7B"
                    />
                  ) : (
                    <p className="w-4.5 text-center">{index + 1}</p>
                  )}
                </div>
                <SafeImage
                  src={video.cover}
                  alt={video.title}
                  width={96}
                  height={56}
                  className="w-24 h-14 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {video.duration}
                  </span>
                </div>
              </button>
            ))}
            {course.videos.map((video, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsReady(false);
                  setSelectedVideoIndex(index);
                }}
                className={`flex gap-2 px-2 py-1 text-left transition hover:bg-muted-background ${
                  index === selectedVideoIndex ? "bg-muted-background" : ""
                }`}
              >
                <div className="flex justify-center items-center">
                  {index === selectedVideoIndex ? (
                    <PlayIcon
                      size={18}
                      strokeWidth={1}
                      fill="#7B7B7B"
                      color="#7B7B7B"
                    />
                  ) : (
                    <p className="w-4.5 text-center">{index + 1}</p>
                  )}
                </div>
                <SafeImage
                  src={video.cover}
                  alt={video.title}
                  width={96}
                  height={56}
                  className="w-24 h-14 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {video.duration}
                  </span>
                </div>
              </button>
            ))}
            {course.videos.map((video, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsReady(false);
                  setSelectedVideoIndex(index);
                }}
                className={`flex gap-2 px-2 py-1 text-left transition hover:bg-muted-background ${
                  index === selectedVideoIndex ? "bg-muted-background" : ""
                }`}
              >
                <div className="flex justify-center items-center">
                  {index === selectedVideoIndex ? (
                    <PlayIcon
                      size={18}
                      strokeWidth={1}
                      fill="#7B7B7B"
                      color="#7B7B7B"
                    />
                  ) : (
                    <p className="w-4.5 text-center">{index + 1}</p>
                  )}
                </div>
                <SafeImage
                  src={video.cover}
                  alt={video.title}
                  width={96}
                  height={56}
                  className="w-24 h-14 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {video.duration}
                  </span>
                </div>
              </button>
            ))}
            {course.videos.map((video, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsReady(false);
                  setSelectedVideoIndex(index);
                }}
                className={`flex gap-2 px-2 py-1 text-left transition hover:bg-muted-background ${
                  index === selectedVideoIndex ? "bg-muted-background" : ""
                }`}
              >
                <div className="flex justify-center items-center">
                  {index === selectedVideoIndex ? (
                    <PlayIcon
                      size={18}
                      strokeWidth={1}
                      fill="#7B7B7B"
                      color="#7B7B7B"
                    />
                  ) : (
                    <p className="w-4.5 text-center">{index + 1}</p>
                  )}
                </div>
                <SafeImage
                  src={video.cover}
                  alt={video.title}
                  width={96}
                  height={56}
                  className="w-24 h-14 object-cover rounded-md"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {video.duration}
                  </span>
                </div>
              </button>
            ))} */}
          </div>
        </aside>
      </div>
      <div className="w-full flex justify-end">
        <aside className="w-full lg:w-[400px]">
          <h2 className="text-lg font-semibold mb-4">Рекомендовані</h2>
          <div className="flex flex-col gap-4">
            {recommended &&
              recommended.length !== 0 &&
              recommended.map((rec) => (
                <Link
                  type="button"
                  href={`/videos/${rec._id}`}
                  key={rec._id}
                  className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded-md"
                >
                  <div className="w-40 h-24 flex-shrink-0 bg-muted rounded overflow-hidden">
                    <SafeImage
                      src={rec.cover}
                      alt={rec.title}
                      width={295}
                      height={166}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-snug line-clamp-2">
                      {rec.title}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {rec.duration}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
export default withAlphaGuard(CoursePage);
// export default CoursePage;
