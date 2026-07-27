"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUnpublishedVideos } from "@/redux/videos/video.thunk";
import { clearVideos } from "@/redux/videos/videoSlice";
import {
  selectIsLoadingVideos,
  selectVideos,
  selectTotalHits,
  selectVideosError,
} from "@/selectors/videos.selectors";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { withAdminGuard } from "@/guards/WithAdminGuard";
import VideosSection from "@/components/videos/VideoSection";
import NotFoundComponent from "@/components/notFound/NotFound";

function UnpublishedVideosPage() {
  const dispatch = useAppDispatch();
  const videos = useAppSelector(selectVideos);
  const total = useAppSelector(selectTotalHits);
  const isLoadingVideo = useAppSelector(selectIsLoadingVideos);
  const error = useAppSelector(selectVideosError);
  const { width } = useWindowWidth();
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const pageRef = useRef(1);

  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  const initialLimit = cols * 3;
  const loadMoreCount = cols * 2;

  const makeQuery = useCallback(
    (page: number, limit: number) => ({ page, limit }),
    []
  );

  useEffect(() => {
    pageRef.current = 1;
    setIsLoading(true);
    dispatch(fetchUnpublishedVideos(makeQuery(1, initialLimit))).finally(() =>
      setIsLoading(false)
    );
    return () => {
      dispatch(clearVideos());
    };
  }, [dispatch, makeQuery, initialLimit]);

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
            fetchUnpublishedVideos(makeQuery(nextPage, loadMoreCount))
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
  }, [dispatch, videos.length, total, makeQuery, loadMoreCount, isLoading]);

  if (error && !isLoadingVideo && videos.length === 0) {
    return <NotFoundComponent />;
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      <h1 className="font-medium text-2xl leading-8 tracking-thinest">
        Неопубліковані відео
      </h1>
      {videos.length !== 0 && (
        <VideosSection
          videos={videos}
          isLoadingVideo={isLoadingVideo}
          isAddHeader={false}
        />
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
}

export default withAdminGuard(UnpublishedVideosPage);
