"use client";

import { useEffect, useRef } from "react";
import {
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import "@/styles/youtube.css";

type Props = {
  title: string;
  cover?: string | null;
  originalUrl: string;
  className?: string;
  initialTime?: number;
  onProgress?: (time: number) => void;
};

function toYouTubeId(input: string) {
  return (
    input.match(/[?&]v=([\w-]{11})/)?.[1] ||
    input.match(/youtu\.be\/([\w-]{11})/)?.[1] ||
    (/^[\w-]{11}$/.test(input) ? input : "")
  );
}

export default function VidstackPlayerYoutube({
  title,
  cover,
  originalUrl,
  className,
  initialTime = 0,
  onProgress,
}: Props) {
  const ref = useRef<MediaPlayerInstance>(null);
  const id = toYouTubeId(originalUrl);
  const src = id ? `youtube/${id}` : undefined;

  // встановлюємо стартовий час
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
    const handleSaveProgress = () => {
      const current = ref.current?.currentTime ?? 0;
      onProgress?.(Math.floor(current));
    };
    const interval = setInterval(handleSaveProgress, 30000);
    return () => clearInterval(interval);
  }, [onProgress]);

  return (
    <div className="w-full">
      <MediaPlayer
        ref={ref}
        key={src}
        src={src}
        title={title}
        poster={cover ?? undefined}
        volume={0.25}
        onPause={handleSaveProgress}
        onEnded={handleSaveProgress}
        playsInline
        className={`yt-fix ${className ?? ""}`}
      >
        <MediaProvider />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          slots={{
            title: null,
            captionButton: null,
            captions: null,
            googleCastButton: null,
            airPlayButton: null,
            settingsMenu: null,
          }}
        />
      </MediaPlayer>
    </div>
  );
}
