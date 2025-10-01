"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  type MediaProviderAdapter,
  isVimeoProvider,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

type Props = {
  title: string;
  cover?: string | null;
  video: string;
  className?: string;
  containerClassName?: string;
  initialTime?: number;
  onProgress?: (time: number) => void; // 🔹 callback
  onEndedCb?: () => void;
};

export default function VidstackPlayer({
  title,
  cover,
  video,
  className,
  containerClassName,
  initialTime = 0,
  onProgress,
  onEndedCb,
}: Props) {
  const provider = "vimeo";
  const ref = useRef<MediaPlayerInstance>(null);
  const volume = parseFloat(localStorage.getItem("player-volume") || "0.25");

  const src = useMemo(() => {
    if (provider === "vimeo" && video) return `${video}`;
  }, [provider, video]);

  function onProviderChange(adapter: MediaProviderAdapter | null) {
    if (!adapter) return;
    if (isVimeoProvider(adapter)) {
      Object.assign(adapter, {
        title: false,
        portrait: false,
      });
      return;
    }
  }

  const lastTime = useRef(0);
  const progressCb = useRef<((time: number) => void) | null>(null);
  const handleTimeUpdate = () => {
    lastTime.current = ref.current?.currentTime ?? 0;
  };

  useEffect(() => {
    progressCb.current = onProgress ?? null;
  }, [onProgress]);

  useEffect(() => {
    if (ref.current && initialTime > 0) {
      ref.current.currentTime = initialTime;
    }
  }, [initialTime]);

  const handleSaveProgress = () => {
    const current = ref.current?.currentTime ?? 0;
    onProgress?.(Math.floor(current));
  };

  useEffect(() => {
    return () => {
      const current = Math.floor(lastTime.current);
      console.log("unmount");
      if (current > 0) {
        progressCb.current?.(current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      const current = Math.floor(lastTime.current);
      if (current > 0) {
        progressCb.current?.(current);
      }
    };
  }, [video]);

  return (
    <div className={`w-full rounded-4xl ${containerClassName ?? ""}`}>
      <MediaPlayer
        ref={ref}
        src={src}
        title={title}
        onProviderChange={onProviderChange}
        poster={cover ?? undefined}
        volume={volume}
        onTimeUpdate={handleTimeUpdate}
        onPause={handleSaveProgress}
        onEnded={() => {
          handleSaveProgress();
          onEndedCb?.();
        }}
        onVolumeChange={(e) => {
          localStorage.setItem("player-volume", String(e.volume));
        }}
        preload="auto"
        controls
        playsInline
        className={`yt-fix ${className ?? ""}`}
        keyShortcuts={{
          togglePaused: "k Space",
          toggleMuted: "m",
          toggleFullscreen: "f",
          togglePictureInPicture: "i",
          toggleCaptions: "c",
          seekBackward: ["j", "J", "ArrowLeft"],
          seekForward: ["l", "L", "ArrowRight"],
          volumeUp: "ArrowUp",
          volumeDown: "ArrowDown",
          speedUp: ">",
          slowDown: "<",
        }}
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
}
