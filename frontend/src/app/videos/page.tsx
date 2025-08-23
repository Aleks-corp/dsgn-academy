"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";

import VideosSection from "@/components/videos/VideoSection";
import FilterSection from "@/components/videos/FilterSection";
import { fetchVideos } from "@/redux/videos/video.thunk";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectVideos } from "@/redux/selectors/videos.selectors";
import NotFoundComponent from "@/components/notFound/NotFound";
import { withAlphaGuard } from "@/guards&providers/WithAlphaGuard";
import { useWindowWidth } from "@/lib/useWindowWidth";

// тип відповіді від бекенду
interface FetchVideosResponse {
  total: number;
  videos: unknown[]; // можна конкретизувати якщо є тип відео
}

function VideosPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const videos = useAppSelector(selectVideos);

  const width = useWindowWidth();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // визначаємо кількість колонок
  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;

  const initialLimit = cols * 3; // перший запит = 3 ряди
  const loadMoreCount = cols * 2; // довантаження = 2 ряди

  // стабільна функція для формування query
  const makeQuery = useCallback(
    (page: number, limit: number) => ({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      filter: searchParams.get("filter") || "",
      free: searchParams.get("free") === "" ? true : false,
      recommended: searchParams.get("recommended") === "" ? true : false,
      page,
      limit,
    }),
    [searchParams]
  );

  // перший запит при завантаженні або зміні ширини
  useEffect(() => {
    setPage(1);
    dispatch(fetchVideos(makeQuery(1, initialLimit))).then((res) => {
      const payload = (res as { payload?: FetchVideosResponse }).payload;
      if (payload?.total) {
        setTotal(payload.total);
      }
    });
  }, [dispatch, makeQuery, initialLimit]);

  // інфініт скрол
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && videos.length < (total ?? Infinity)) {
          const nextPage = page + 1;
          setPage(nextPage);
          dispatch(fetchVideos(makeQuery(nextPage, loadMoreCount)));
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [dispatch, page, videos.length, total, makeQuery, loadMoreCount]);

  if (videos.length === 0) {
    return <NotFoundComponent />;
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      <FilterSection />
      <VideosSection videos={videos} />
      <div ref={loaderRef} className="h-10" />
    </div>
  );
}

export default withAlphaGuard(VideosPage);

// function VideosPage() {
//   const dispatch = useAppDispatch();
//   const searchParams = useSearchParams();
//   const videos = useAppSelector(selectVideos);

//   const width = useWindowWidth();
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState<number | null>(null);
//   const loaderRef = useRef<HTMLDivElement | null>(null);

//   // визначаємо кількість колонок
//   const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;

//   const initialLimit = cols * 3; // перший запит = 3 ряди
//   const loadMoreCount = cols * 2; // довантаження = 2 ряди

//   // формуємо query з URL
//   const makeQuery = (page: number, limit: number) => ({
//     search: searchParams.get("search") || "",
//     category: searchParams.get("category") || "",
//     filter: searchParams.get("filter") || "",
//     free: searchParams.get("free") === "" ? true : false,
//     recommended: searchParams.get("recommended") === "" ? true : false,
//     page,
//     limit,
//   });

//   // перший запит при завантаженні або зміні ширини
//   useEffect(() => {
//     setPage(1);
//     dispatch(fetchVideos(makeQuery(1, initialLimit))).then((res: any) => {
//       if (res?.payload?.total) setTotal(res.payload.total);
//     });
//   }, [dispatch, searchParams, cols]);

//   // інфініт скрол
//   useEffect(() => {
//     if (!loaderRef.current) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const first = entries[0];
//         if (first.isIntersecting && videos.length < (total ?? Infinity)) {
//           const nextPage = page + 1;
//           setPage(nextPage);
//           dispatch(fetchVideos(makeQuery(nextPage, loadMoreCount)));
//         }
//       },
//       { threshold: 1 }
//     );

//     const current = loaderRef.current;
//     if (current) observer.observe(current);

//     return () => {
//       if (current) observer.unobserve(current);
//     };
//   }, [page, dispatch, videos.length, total, cols, makeQuery, loadMoreCount]);

//   if (videos.length === 0) {
//     return <NotFoundComponent />;
//   }

//   return (
//     <div className="flex flex-col gap-8 w-full mx-auto">
//       <FilterSection />
//       <VideosSection videos={videos} />
//       {/* Тригер підвантаження */}
//       <div ref={loaderRef} className="h-10" />
//     </div>
//   );
// }
// export default withAlphaGuard(VideosPage);
// export default VideosPage;
