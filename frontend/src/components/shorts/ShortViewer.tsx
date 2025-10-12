"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import ViewNavButtons from "./ViewerNavButtons";
import { useCanWatchVideo } from "@/hooks/useCanWatchVideo";
import RestrictedShort from "../RestrictedShort";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectShorts,
  selectTotalShorts,
} from "@/redux/selectors/shorts.selector";
import { fetchShorts } from "@/redux/shorts/shorts.thunk";
import VideoPlayer from "./ShortVideo";

type Props = {
  initialId: string;
};

export default function ShortsViewer({ initialId }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const canWatch = useCanWatchVideo();

  const shorts = useAppSelector(selectShorts);
  const totalShorts = useAppSelector(selectTotalShorts);

  const pageRef = useRef(shorts.length > 0 ? Math.ceil(shorts.length / 10) : 1);

  // активний індекс
  const initialIndex = shorts.findIndex((s) => s._id === initialId);
  const [currentSlide, setCurrentSlide] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🟢 1. Початкова догрузка (align до 10)
  useEffect(() => {
    if (!shorts.length && !totalShorts) return router.push("/shorts");

    const count = shorts.length;
    const target = Math.ceil(count / 10) * 10;

    if (count < target && count < totalShorts) {
      pageRef.current = Math.ceil(count / 10);
      dispatch(fetchShorts({ limit: 10, page: pageRef.current }));
    } else if (count === target && count < totalShorts) {
      pageRef.current = Math.ceil(count / 10) + 1;
      dispatch(fetchShorts({ limit: 10, page: pageRef.current }));
    } else {
      pageRef.current = Math.ceil(count / 10);
    }
  }, [shorts.length, totalShorts, dispatch, router]);

  // 🟢 keen-slider
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    vertical: true,
    slides: { perView: 1, spacing: 0 },
    rubberband: true,
    initial: Math.max(0, initialIndex),
    slideChanged(s) {
      if (shorts.length === 0) return;

      const idx = s.track.details.rel;
      setCurrentSlide(idx);

      const id = shorts[idx]?._id;
      if (id) history.replaceState(null, "", `/shorts/${id}`);

      // якщо залишилось <5 і ще є що тягнути → догружаємо
      if (idx >= shorts.length - 5 && shorts.length < totalShorts) {
        pageRef.current += 1;
        dispatch(fetchShorts({ limit: 10, page: pageRef.current }));
      }
    },
  });

  // 🟢 оновлення слайдера після догрузки
  useEffect(() => {
    requestAnimationFrame(() => slider.current?.update());
  }, [shorts, slider]);

  // бекдроп-клік — закрити
  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current) router.push("/shorts");
  };

  if (!shorts.length) return null;

  return (
    <div
      ref={containerRef}
      onClick={onBackdropClick}
      className="fixed inset-0 z-[9999] bg-black h-full tabx:bg-background backdrop-blur-sm flex items-center justify-center pb-5 md:py-0"
    >
      <ViewNavButtons
        onPrev={() => slider.current?.prev()}
        onNext={() => slider.current?.next()}
        onClose={() => router.push("/shorts")}
      />

      <div
        ref={sliderRef}
        className="relative keen-slider h-full w-full max-w-[calc(100vh/16*9)]"
      >
        {shorts.map((s, i) => {
          const isActive = i === currentSlide;
          const isNear = Math.abs(i - currentSlide) < 1;

          return (
            <div
              key={s._id}
              data-index={i}
              className="h-full w-full keen-slider__slide flex items-center justify-center aspect-[9/16]"
            >
              {isNear ? (
                canWatch || s.free ? (
                  <VideoPlayer
                    short={s}
                    active={isActive}
                    muted={muted}
                    setMuted={setMuted}
                  />
                ) : (
                  <div className="relative h-full w-full bg-black overflow-hidden">
                    <Image
                      src={s.cover}
                      alt={s.title}
                      width={576}
                      height={1024}
                      className="h-full object-cover"
                    />
                    <div className="absolute inset-0 backdrop-blur-[48px]">
                      <RestrictedShort />
                    </div>
                  </div>
                )
              ) : (
                <div className="h-full w-full bg-black" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
