// hooks/useVimeoGA.ts
"use client";

import { useRef } from "react";
import { gaEvent } from "@/lib/ga.tag";

interface VideoMeta {
  video_id: string;
  video_title: string;
}

export function useVimeoGA(meta: VideoMeta) {
  const startedRef = useRef(false);
  const milestonesRef = useRef<{
    25?: boolean;
    50?: boolean;
    75?: boolean;
    100?: boolean;
  }>({});
  const durationRef = useRef<number>(0);

  function handleReady() {}

  function handlePlay() {
    if (!startedRef.current) {
      startedRef.current = true;
      gaEvent("video_play", { ...meta });
    }
  }

  function handleEnd({ seconds }: { seconds: number }) {
    if (!milestonesRef.current[100]) {
      milestonesRef.current[100] = true;
      gaEvent("video_complete", {
        ...meta,
        progress_pct: 100,
        duration_s: Math.round(durationRef.current || seconds || 0),
      });
    }
  }

  return {
    handleReady,
    handlePlay,
    handleEnd,
  };
}
