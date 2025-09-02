"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchShorts,
  fetchShortsCount,
  fetchShortsNext,
  fetchTopShortTags,
} from "@/redux/shorts/shorts.thunk";
import {
  selectIsLoadingShorts,
  selectShorts,
  selectShortsError,
  selectShortsNextCursor,
  selectShortsTopTags,
  selectTotalShorts,
} from "@/redux/selectors/shorts.selector";

import Loader from "@/components/loaders/LoaderCircle";
import InProgressComponent from "@/components/notFound/InProgress";
import FilterShortsSection from "@/components/shorts/FilterSection";
import ShortsSection from "@/components/shorts/ShortsSection";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useSearchParams } from "next/navigation";
import NotFoundComponent from "@/components/notFound/NotFound";

export default function ShortsPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const isLoadingShorts = useAppSelector(selectIsLoadingShorts);
  const shorts = useAppSelector(selectShorts);
  const error = useAppSelector(selectShortsError);
  const nextCursor = useAppSelector(selectShortsNextCursor);
  const totalShorts = useAppSelector(selectTotalShorts);
  const topTags = useAppSelector(selectShortsTopTags);

  const { width } = useWindowWidth();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // колонки → скільки грузити
  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  const initialLimit = cols * 3;

  const activeTag = searchParams.get("filter") || ""; // наше єдине фільтро-поле

  // 1) первинні дані: топ-теги і total
  useEffect(() => {
    if (!topTags?.length) dispatch(fetchTopShortTags({ limit: 20 }));
    if (totalShorts == null) dispatch(fetchShortsCount());
  }, [dispatch, topTags?.length, totalShorts]);

  // 2) перше завантаження шортсів при зміні тега/колонок
  useEffect(() => {
    dispatch(
      fetchShorts({
        limit: initialLimit,
        tag: activeTag,
        cursor: "",
        tagsMode: "any",
      })
    );
  }, [dispatch, activeTag, initialLimit]);

  // 3) infinite-scroll через IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;

    const onIntersect: IntersectionObserverCallback = (entries) => {
      const first = entries[0];
      if (first.isIntersecting && nextCursor && !isLoadingShorts) {
        // наступна сторінка по курсору
        dispatch(fetchShortsNext());
      }
    };

    const observer = new IntersectionObserver(onIntersect, { threshold: 1 });
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [dispatch, nextCursor, isLoadingShorts]);

  if (isLoadingShorts) {
    return (
      <div className="w-20 h-20 mt-10">
        <Loader />
      </div>
    );
  }

  if (shorts.length === 0 && !isLoadingShorts) {
    return (
      <InProgressComponent
        title="Розділ"
        desc="А поки можна переглянути інші відео."
      />
    );
  }
  if (shorts.length === 0 && error && !isLoadingShorts) {
    return <NotFoundComponent />;
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      <FilterShortsSection />
      {shorts.length !== 0 && (
        <ShortsSection shorts={shorts} isLoadingShorts={isLoadingShorts} />
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
}
