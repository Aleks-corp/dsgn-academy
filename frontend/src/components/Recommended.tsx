"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchRecommended } from "@/redux/videos/video.thunk";
import { IVideo } from "@/types/videos.type";
import VerticalVideoCard from "./videos/VerticalVideoCard";

export default function RecommendedList() {
  const dispatch = useAppDispatch();
  const pageRef = useRef(1);
  const [recommended, setRecommended] = useState<IVideo[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchRecommended({ limit: 10, recommended: true })).then((res) => {
      if (res?.payload?.videos) setRecommended(res.payload.videos);
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchRecommended({ limit, page: pageRef.current, recommended: true })
    ).then((res) => {
      if (res?.payload?.videos) {
        setRecommended(res.payload.videos);
        setTotal(res.payload.total);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && recommended.length < (total ?? Infinity)) {
        pageRef.current += 1;
        dispatch(
          fetchRecommended({ limit, page: pageRef.current, recommended: true })
        ).then((res) => {
          if (res?.payload?.videos) {
            setRecommended((prev) => [...prev, ...res.payload.videos]);
          }
        });
      }
    });

    const current = loaderRef.current;
    observer.observe(current);
    return () => current && observer.unobserve(current);
  }, [dispatch, recommended.length, total]);

  if (!recommended || recommended.length === 0) {
    return null;
  }

  return (
    <div className="max-h-[660px] w-full min-w-[390px] max-w-[390px] xxl:max-w-[460px] rounded-xl shadow">
      <h2 className="text-xl font-medium leading-7 tracking-thinest px-3 py-3">
        Рекомендовані відео
      </h2>
      <div className="flex flex-col max-h-[600px] px-3 pb-3 overflow-y-auto no-scrollbar rounded-xl">
        {recommended.map((video, idx) => (
          <VerticalVideoCard key={video._id + idx} video={video} />
        ))}
      </div>
      <div ref={loaderRef} className="h-10" />
    </div>
  );
}
