"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import { fetchCourses } from "@/redux/courses/course.thunk";
import { clearCourses } from "@/redux/courses/courseSlice";
import {
  selectCourses,
  selectCoursesError,
  selectIsLoadingCourses,
} from "@/selectors/courses.selector";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import CoursesSection from "@/components/courses/CoursesSection";
import NotFoundComponent from "@/components/notFound/NotFound";
import { VideoCardsSkeleton } from "@/components/skeleton/VideoCardSkeleton";

interface FetchCourseResponse {
  total: number;
  courses: unknown[];
}

function CoursesPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const courses = useAppSelector(selectCourses);
  const isLoadingVideo = useAppSelector(selectIsLoadingCourses);
  const error = useAppSelector(selectCoursesError);
  const { width } = useWindowWidth();
  const [total, setTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const pageRef = useRef(1);

  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  const initialLimit = cols * 3;
  const loadMoreCount = cols * 2;

  const makeQuery = useCallback(
    (page: number, limit: number) => ({
      category: searchParams.get("category") || "",
      page,
      limit,
    }),
    [searchParams]
  );

  useEffect(() => {
    pageRef.current = 1;
    setIsLoading(true);
    dispatch(fetchCourses(makeQuery(1, initialLimit))).then((res) => {
      const payload = (res as { payload?: FetchCourseResponse }).payload;
      if (payload?.total) setTotal(payload.total);
      setIsLoading(false);
    });
    return () => {
      dispatch(clearCourses());
    };
  }, [dispatch, initialLimit, makeQuery]);

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
          dispatch(fetchCourses(makeQuery(nextPage, loadMoreCount))).finally(
            () => setIsLoading(false)
          );
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [dispatch, total, makeQuery, loadMoreCount, isLoading, courses.length]);

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
      {/* <FilterSection /> */}
      <CoursesSection courses={courses} />
      <div ref={loaderRef} className="h-20" />
    </div>
  );
}
export default CoursesPage;
