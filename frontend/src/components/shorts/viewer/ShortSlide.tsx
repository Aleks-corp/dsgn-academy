"use client";

import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { useEffect } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchShortById } from "@/redux/shorts/shorts.thunk";
import { selectShortByIdFromCache } from "@/redux/selectors/shorts.selector";
import { Lock } from "lucide-react";

export default function ShortSlide({
  id,
  preloadNext,
}: {
  id: string;
  preloadNext?: boolean;
}) {
  void preloadNext;
  const dispatch = useAppDispatch();
  const short = useAppSelector((s) => selectShortByIdFromCache(s, id));

  useEffect(() => {
    if (!short) dispatch(fetchShortById(id));
  }, [dispatch, id, short]);

  if (!short) {
    return (
      <div className="h-full w-full grid place-items-center">
        <div className="animate-pulse text-sm text-muted-foreground">
          Завантаження…
        </div>
      </div>
    );
  }

  const poster = short.cover;
  const src = short.video;

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-black">
      <div className="w-full h-full max-w-[620px]">
        <MediaPlayer
          src={src}
          autoplay
          muted
          loop
          playsInline
          className="h-full w-full"
          poster={poster}
        >
          <MediaProvider />
          <Poster className="vds-poster" />
          <DefaultVideoLayout icons={defaultLayoutIcons} />
        </MediaPlayer>
      </div>

      {/* Overlay info */}
      <div className="absolute bottom-6 left-4 right-24 text-white drop-shadow-md">
        <h3 className="text-lg font-semibold mb-1">{short.title}</h3>
        {short.description && (
          <p className="text-sm opacity-90 line-clamp-3">{short.description}</p>
        )}
        <div className="mt-2 flex gap-2 flex-wrap">
          {short.tags?.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-xs bg-white/10 border border-white/20 rounded-full px-2 py-0.5"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Premium overlay */}
      {!short.free && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] grid place-items-center">
          <div className="flex items-center gap-2 text-white bg-black/40 rounded-xl px-3 py-2">
            <Lock size={16} />
            <span className="text-sm">Доступно з Преміум</span>
          </div>
        </div>
      )}
    </div>
  );
}
