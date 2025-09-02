"use client";

import { useMemo, useRef } from "react";
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
  video?: string | null;
  className?: string;
};

export default function VidstackPlayer({
  title,
  cover,
  video,
  className,
}: Props) {
  const provider = "vimeo";
  const ref = useRef<MediaPlayerInstance>(null);

  const src = useMemo(() => {
    if (provider === "vimeo" && video) return `${video}`;
  }, [provider, video]);

  function onProviderChange(
    adapter: MediaProviderAdapter | null
    // _evt: MediaProviderChangeEvent
  ) {
    if (!adapter) return;
    if (isVimeoProvider(adapter)) {
      Object.assign(adapter, {
        title: false,
        portrait: false,
      });
      return;
    }
  }

  return (
    <div className="w-full rounded-4xl">
      <MediaPlayer
        ref={ref}
        src={src}
        title={title}
        onProviderChange={onProviderChange}
        poster={cover ?? undefined}
        volume={0.25}
        controls
        playsInline
        className={`yt-fix ${className ?? ""}`}
        keyShortcuts={{
          // Space-separated list.
          togglePaused: "k Space",
          toggleMuted: "m",
          toggleFullscreen: "f",
          togglePictureInPicture: "i",
          toggleCaptions: "c",
          // Array.
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
