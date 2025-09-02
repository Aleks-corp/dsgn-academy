"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useInView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSequence, fetchShortById } from "@/redux/shorts/shorts.thunk";
import {
  selectShortsSequence,
  selectShortsSeqCursor,
  selectIsLoadingShorts,
} from "@/redux/selectors/shorts.selector";
import ShortSlide from "./ShortSlide";
import NavButtons from "./ViewerNavButtons";

interface Props {
  shortId: string;
  tag?: string;
}

export default function ShortsViewer({ shortId, tag }: Props) {
  const dispatch = useAppDispatch();
  const sequence = useAppSelector(selectShortsSequence);
  const seqCursor = useAppSelector(selectShortsSeqCursor);
  const isLoading = useAppSelector(selectIsLoadingShorts);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    loop: false,
    dragFree: false,
    skipSnaps: false,
    containScroll: "trimSnaps",
  });

  // ✅ окремий DOM-ref для viewport елемента
  const viewportElRef = useRef<HTMLDivElement | null>(null);
  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewportElRef.current = node;
      emblaRef(node);
    },
    [emblaRef]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    dispatch(fetchShortById(shortId));
    dispatch(fetchSequence({ limit: 200, tag, cursor: "", tagsMode: "any" }));
  }, [dispatch, shortId, tag]);

  useEffect(() => {
    if (!sequence || sequence.length === 0 || !emblaApi) return;
    let idx = sequence.indexOf(shortId);
    if (idx === -1) idx = 0;
    setActiveIndex(idx);
    emblaApi.scrollTo(idx, true);
    setBootstrapped(true);
  }, [sequence, shortId, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!bootstrapped) return;
    if (sequence.length === 0) return;
    const nearEnd = activeIndex >= sequence.length - 3;
    if (nearEnd && seqCursor && !isLoading) {
      dispatch(
        fetchSequence({ limit: 200, cursor: seqCursor, tag, tagsMode: "any" })
      );
    }
  }, [
    activeIndex,
    sequence.length,
    seqCursor,
    isLoading,
    dispatch,
    tag,
    bootstrapped,
  ]);

  // ✅ wheel через viewportElRef, без emblaRef.current
  const wheelLock = useRef(false);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (wheelLock.current) return;
      wheelLock.current = true;
      setTimeout(() => (wheelLock.current = false), 300);
      if (e.deltaY > 10) emblaApi?.scrollNext();
      else if (e.deltaY < -10) emblaApi?.scrollPrev();
    };
    const node = viewportElRef.current;
    if (!node) return;
    node.addEventListener("wheel", onWheel, { passive: true });
    return () => node.removeEventListener("wheel", onWheel);
  }, [emblaApi]);

  const goPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const goNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const slideIds = useMemo(() => {
    if (!sequence?.length) return [shortId];
    return sequence.indexOf(shortId) === -1 ? [shortId, ...sequence] : sequence;
  }, [sequence, shortId]);

  return (
    <div className="h-full w-full relative">
      <div className="embla h-full" ref={setViewportRef}>
        <div className="embla__container h-full flex flex-col">
          {slideIds.map((id, i) => (
            <div
              key={id}
              className="embla__slide h-full min-h-full flex-[0_0_100%]"
            >
              <SlideAutoplayWrapper active={i === activeIndex}>
                <ShortSlide id={id} preloadNext={i === activeIndex} />
              </SlideAutoplayWrapper>
            </div>
          ))}
        </div>
      </div>
      <NavButtons onPrev={goPrev} onNext={goNext} />
    </div>
  );
}

function SlideAutoplayWrapper({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  const { ref } = useInView({ threshold: 0.7 });
  return (
    <div ref={ref} data-active={active} className="h-full w-full">
      {children}
    </div>
  );
}
