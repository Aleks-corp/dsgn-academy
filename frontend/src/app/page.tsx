"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import HeroSection from "@/components/mainPage/HeroSection";
import CoursesSection from "@/components/mainPage/CourseSection";
import VideosSection from "@/components/videos/VideoSection";
import FilterSection from "@/components/videos/FilterSection";
import { fetchVideos } from "@/redux/videos/video.thunk";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  selectIsLoadingVideos,
  selectVideos,
  selectVideosError,
} from "@/redux/selectors/videos.selectors";

import { useWindowWidth } from "@/hooks/useWindowWidth";
import NotFoundComponent from "@/components/notFound/NotFound";
import { VideoCardsSkeleton } from "@/components/skeleton/VideoCardSkeleton";
import { fetchCourses } from "@/redux/courses/course.thunk";

interface FetchVideosResponse {
  total: number;
  videos: unknown[];
}

function HomePage() {
  const dispatch = useAppDispatch();
  const videos = useAppSelector(selectVideos);
  const isLoadingVideo = useAppSelector(selectIsLoadingVideos);
  const error = useAppSelector(selectVideosError);
  const width = useWindowWidth();
  const [total, setTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 👇 тримаємо сторінку в ref, щоб уникнути зайвих ререндерів
  const pageRef = useRef(1);

  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  const initialLimit = cols * 3;
  const loadMoreCount = cols * 2;

  const makeQuery = useCallback(
    (page: number, limit: number) => ({
      page,
      limit,
    }),
    []
  );

  // перший запит
  useEffect(() => {
    pageRef.current = 1;
    setIsLoading(true);
    dispatch(fetchCourses({ limit: 5 }));
    dispatch(fetchVideos(makeQuery(1, initialLimit))).then((res) => {
      const payload = (res as { payload?: FetchVideosResponse }).payload;
      if (payload?.total) setTotal(payload.total);
      setIsLoading(false);
    });
  }, [dispatch, makeQuery, initialLimit]);

  // інфініт-скрол
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !isLoading &&
          videos.length < (total ?? Infinity)
        ) {
          setIsLoading(true);
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          dispatch(fetchVideos(makeQuery(nextPage, loadMoreCount))).finally(
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
  }, [dispatch, videos.length, total, makeQuery, loadMoreCount, isLoading]);

  if (isLoadingVideo && !pageRef.current) {
    const arr = [];
    for (let index = 0; index < cols * 2; index++) {
      arr.push(index);
    }
    return (
      <div className="flex justify-center flex-wrap gap-5">
        {arr.map((i) => (
          <VideoCardsSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <NotFoundComponent />;
  }

  return (
    <div className="flex flex-col w-full mx-auto">
      <HeroSection />
      <FilterSection />
      <CoursesSection />
      {videos.length !== 0 && (
        <VideosSection videos={videos} isLoadingVideo={isLoadingVideo} />
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
}
export default HomePage;
