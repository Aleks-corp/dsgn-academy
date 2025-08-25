"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCourse } from "@/redux/courses/courseSlice";
import { fetchCourseById } from "@/redux/courses/course.thunk";
import {
  selectIsLoadingCourses,
  selectCourse,
} from "@/selectors/courses.selector";

import NotFoundComponent from "@/components/notFound/NotFound";

import { VideoCardSkeleton } from "@/components/skeleton/VideoCardSkeleton";
import CoursePlayer from "@/components/courses/CoursePlayer";
import RecommendedList from "@/components/Recommended";
import CoursePlayList from "@/components/courses/CoursePlayList";

import CourseDescription from "@/components/courses/CourseDescription";
import { useCanWatchVideo } from "@/hooks/useCanWatchVideo";
import { selectVideosError } from "@/redux/selectors/videos.selectors";

function CoursePage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isLoading = useAppSelector(selectIsLoadingCourses);
  const course = useAppSelector(selectCourse);
  const canWatch = useCanWatchVideo();
  const error = useAppSelector(selectVideosError);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchCourseById(id as string));
    return () => {
      dispatch(clearCourse());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <>
        <VideoCardSkeleton />
        <VideoCardSkeleton />
      </>
    );
  }

  if (error) {
    return <NotFoundComponent />;
  }
  if (!course) {
    return null;
  }

  return (
    <div className="mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 px-4 lg:px-8 justify-items-center max-w-[1500px]">
      <div className="flex flex-col w-full max-w-[900px]">
        <div className="relative w-full">
          <CoursePlayer
            canWatch={canWatch || selectedVideoIndex === 0}
            selectedVideo={course.videos[selectedVideoIndex]}
          />
        </div>

        <div className="mt-4">
          <CourseDescription
            course={course}
            selectedVideoIndex={selectedVideoIndex}
          />
        </div>

        <div className="lg:hidden mt-4">
          <div className="flex gap-3">
            <CoursePlayList
              course={course}
              selectedVideoIndex={selectedVideoIndex}
              setSelectedVideoIndex={setSelectedVideoIndex}
            />
          </div>
        </div>

        <div className="lg:hidden">
          <RecommendedList />
        </div>
      </div>

      <div className="hidden lg:flex flex-col">
        <div className="flex-1 max-h-[600px] rounded-xl shadow p-3 overflow-x-auto mb-4 no-scrollbar">
          <CoursePlayList
            course={course}
            selectedVideoIndex={selectedVideoIndex}
            setSelectedVideoIndex={setSelectedVideoIndex}
          />
        </div>

        <RecommendedList />
      </div>
    </div>
  );
}
export default CoursePage;
