"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { fetchBookMarkedCourses } from "@/redux/courses/course.thunk";
import {
  selectBookmarkedCourses,
  selectIsLoadingCourses,
} from "@/selectors/courses.selector";
import { useWindowWidth } from "@/hooks/useWindowWidth";

import CoursesSection from "@/components/courses/CoursesSection";
import NotFoundComponent from "@/components/notFound/NotFound";
import { VideoCardsSkeleton } from "@/components/skeleton/VideoCardSkeleton";
import { selectVideosError } from "@/redux/selectors/videos.selectors";

interface FetchCourseResponse {
  total: number;
  courses: unknown[];
}

function BookmarkedCourses() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector(selectBookmarkedCourses);
  const isLoadingVideo = useAppSelector(selectIsLoadingCourses);
  const error = useAppSelector(selectVideosError);
  const { width } = useWindowWidth();
  const [total, setTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const pageRef = useRef(1);

  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  const initialLimit = cols * 3;
  const loadMoreCount = cols * 2;

  useEffect(() => {
    pageRef.current = 1;
    setIsLoading(true);
    dispatch(fetchBookMarkedCourses({ page: 1, limit: initialLimit })).then(
      (res) => {
        const payload = (res as { payload?: FetchCourseResponse }).payload;
        if (payload?.total) setTotal(payload.total);
        setIsLoading(false);
      }
    );
  }, [dispatch, initialLimit]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !isLoading &&
          courses.length < (total ?? Infinity)
        ) {
          setIsLoading(true);
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          dispatch(
            fetchBookMarkedCourses({ page: nextPage, limit: loadMoreCount })
          ).finally(() => setIsLoading(false));
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [dispatch, total, loadMoreCount, isLoading, courses.length]);

  if (isLoadingVideo && !pageRef.current) {
    return (
      <div className="flex justify-center flex-wrap gap-5">
        <VideoCardsSkeleton />
        <VideoCardsSkeleton />
        <VideoCardsSkeleton />
        <VideoCardsSkeleton />
      </div>
    );
  }
  if (error && !isLoadingVideo && courses.length === 0) {
    return <NotFoundComponent />;
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      <CoursesSection courses={courses} isAddHeader={false} />
      <div ref={loaderRef} className="h-20" />
    </div>
  );
}
export default BookmarkedCourses;
