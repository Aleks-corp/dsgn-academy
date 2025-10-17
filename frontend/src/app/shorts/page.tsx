"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchShorts,
  fetchShortsCount,
  fetchTopShortTags,
} from "@/redux/shorts/shorts.thunk";
import { clearShorts } from "@/redux/shorts/shortsSlice";
import {
  selectIsLoadingShorts,
  selectShorts,
  selectShortsError,
  selectShortsTopTags,
  selectTotalShorts,
} from "@/selectors/shorts.selector";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import InProgressComponent from "@/components/notFound/InProgress";
import FilterShortsSection from "@/components/shorts/FilterSection";
import ShortsSection from "@/components/shorts/ShortsSection";
import NotFoundComponent from "@/components/notFound/NotFound";

export default function ShortsPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const isLoadingShorts = useAppSelector(selectIsLoadingShorts);
  const shorts = useAppSelector(selectShorts);
  const error = useAppSelector(selectShortsError);
  const totalShorts = useAppSelector(selectTotalShorts);
  const topTags = useAppSelector(selectShortsTopTags);
  const pageRef = useRef(1);
  const { width } = useWindowWidth();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // колонки → скільки грузити
  const rowsLimit = Math.floor(
    width < 1024 ? (width - 23) / 206 : (width - 303) / 206
  );
  const initialLimit = rowsLimit * 2;

  const activeTag = searchParams.get("filter") || ""; // наше єдине фільтро-поле

  // 1) первинні дані: топ-теги і total
  useEffect(() => {
    if (!topTags?.length) dispatch(fetchTopShortTags({ limit: 20 }));
    if (totalShorts == null) dispatch(fetchShortsCount());
  }, [dispatch, topTags?.length, totalShorts]);

  // 2) перше завантаження шортсів при зміні тега/колонок
  useEffect(() => {
    pageRef.current = 1;
    dispatch(
      fetchShorts({
        limit: initialLimit,
        tag: activeTag,
        page: pageRef.current,
        tagsMode: "any",
      })
    );
    return () => {
      dispatch(clearShorts());
    };
  }, [dispatch, activeTag, initialLimit]);

  // 3) infinite-scroll через IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          shorts.length < (totalShorts ?? Infinity) &&
          !isLoadingShorts
        ) {
          // наступна сторінка по курсору
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          dispatch(
            fetchShorts({
              limit: initialLimit,
              tag: activeTag,
              page: nextPage,
              tagsMode: "any",
            })
          );
        }
      },
      { threshold: 1 }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [
    dispatch,
    isLoadingShorts,
    shorts.length,
    totalShorts,
    initialLimit,
    activeTag,
  ]);

  if (shorts.length === 0 && !isLoadingShorts && !error) {
    return (
      <InProgressComponent
        title="Розділ"
        desc="А поки можна переглянути інші відео."
      />
    );
  }

  if (error && !isLoadingShorts && shorts.length === 0) {
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
