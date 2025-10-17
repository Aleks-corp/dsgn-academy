"use client";

import { useState, useEffect, useRef } from "react";
import { IShort } from "@/types/shorts.type";
import MaskIcon from "@/components/MaskIcon";

type VideoPlayerProps = {
  short: IShort;
  muted: boolean;
  setMuted: (m: boolean) => void;
  active: boolean;
};

export default function VideoPlayer({
  short,
  muted,
  setMuted,
  active,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // запуск/зупинка коли активний слайд
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [active, short]);

  // оновлюємо прогрес
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const update = () => setProgress(v.currentTime);
    v.addEventListener("timeupdate", update);
    v.addEventListener("loadedmetadata", () => setDuration(v.duration));

    return () => {
      v.removeEventListener("timeupdate", update);
    };
  }, [short]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      if (v.readyState >= 2) {
        v.play().catch((err) => console.warn("Play blocked", err));
      } else {
        const once = () => {
          v.play().catch((err) => console.warn("Play blocked", err));
          v.removeEventListener("canplay", once);
        };
        v.addEventListener("canplay", once);
        v.load(); // на iOS часто треба викликати load() вручну
      }
      setPlaying(true);
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 600);
    } else {
      v.pause();
      setPlaying(false);
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 600);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const time = Number(e.target.value);
    v.currentTime = time;
    setProgress(time);
  };

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        poster={short.cover}
        onClick={togglePlay}
        autoPlay={active}
        muted={muted}
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        controls={false}
        className="absolute inset-0 h-full w-full object-cover outline-none"
      >
        <source src={short.files.link} type={short.files.type || "video/mp4"} />
      </video>

      {/* Центрована іконка Play/Pause */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 animate-fade">
          {playing ? (
            <MaskIcon
              src="/icons/media-icons/play.svg"
              className="w-16 h-16 text-white"
            />
          ) : (
            <MaskIcon
              src="/icons/media-icons/pause.svg"
              className="w-16 h-16 text-white"
            />
          )}
        </div>
      )}

      {/* Звук */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute top-3 right-3 z-10 rounded-full bg-black/50 p-2 text-white cursor-pointer"
      >
        {muted ? (
          <MaskIcon
            src="/icons/media-icons/volume-slash.svg"
            className="w-6 h-6"
          />
        ) : (
          <MaskIcon
            src="/icons/media-icons/volume-high.svg"
            className="w-6 h-6"
          />
        )}
      </button>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent " />
      <div className="absolute top-3 left-3 right-3 text-white drop-shadow md:left-5 md:right-5">
        <h2 className="text-lg md:text-xl font-semibold line-clamp-2">
          {short.title}
        </h2>
        {short.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 opacity-90">
            {short.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] md:text-xs bg-white/15 px-2 py-0.5 rounded-full"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Прогрес-бар */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-0">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={progress}
          onChange={handleSeek}
          className="w-full accent-accent cursor-pointer border-0 outline-0"
        />
      </div>
    </div>
  );
}
