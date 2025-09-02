"use client";

// import { useRef } from "react";
import {
  MediaPlayer,
  // MediaPlayerInstance,
  MediaProvider,
  // useMediaStore,
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
}: Props) {
  // const player = useRef<MediaPlayerInstance>(null);
  // const { paused } = useMediaStore(player);
  const id = toYouTubeId(originalUrl);

  const src = id ? `youtube/${id}` : undefined;

  return (
    <div className="w-full">
      <MediaPlayer
        key={src}
        src={src}
        title={title}
        // controls
        poster={cover ?? undefined}
        volume={0.25}
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
