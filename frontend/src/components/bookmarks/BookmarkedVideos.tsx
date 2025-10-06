"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import VideosSection from "@/components/videos/VideoSection";
import { fetchBookMarkedVideos } from "@/redux/videos/video.thunk";
import { useEffect, useRef, useState } from "react";
import {
  selectBookmarkedVideos,
  selectIsLoadingVideos,
  selectTotalHits,
} from "@/selectors/videos.selectors";

import { useWindowWidth } from "@/hooks/useWindowWidth";

function BookmarkedVideos() {
  const dispatch = useAppDispatch();
  const videos = useAppSelector(selectBookmarkedVideos);
  const isLoadingVideo = useAppSelector(selectIsLoadingVideos);
  const { width } = useWindowWidth();
  const total = useAppSelector(selectTotalHits);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const pageRef = useRef(1);

  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  const initialLimit = cols * 3;
  const loadMoreCount = cols * 2;

  useEffect(() => {
    pageRef.current = 1;
    setIsLoading(true);
    dispatch(fetchBookMarkedVideos({ page: 1, limit: initialLimit })).finally(
      () => setIsLoading(false)
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
          videos.length < (total ?? Infinity)
        ) {
          setIsLoading(true);
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          dispatch(
            fetchBookMarkedVideos({ page: nextPage, limit: loadMoreCount })
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
  }, [dispatch, videos.length, total, loadMoreCount, isLoading]);

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {videos.length !== 0 && (
        <VideosSection
          videos={videos}
          isLoadingVideo={isLoadingVideo}
          isAddHeader={false}
        />
      )}
      {videos.length === 0 && !isLoading && (
        <h3 className="font-medium text-sm leading-7 tracking-thinest text-muted ml-4">
          Збережених відео поки немає
        </h3>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
}

export default BookmarkedVideos;
