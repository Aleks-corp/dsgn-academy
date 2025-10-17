"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectVideos } from "@/selectors/videos.selectors";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import VideosCard from "@/components/videos/VideosCard";

export default function VideosSection() {
  const videos = useAppSelector(selectVideos);
  const { width } = useWindowWidth();

  let visibleCount = 4;
  if (width <= 1560) visibleCount = 3;
  if (width <= 1200) visibleCount = 4;
  if (width <= 630) visibleCount = 3;

  const visibleVideos =
    videos.length > visibleCount ? videos.slice(0, visibleCount) : videos;
  return (
    <section className="w-full mt-4">
      <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
        Останні відео
      </h2>
      <div
        className={`grid gap-3 mx-auto
          ${width <= 630 ? "grid grid-cols-1 justify-items-center" : ""}
          ${
            width > 630 && width <= 1200
              ? "grid-cols-2 justify-items-stretch"
              : ""
          }
          ${
            width > 1200 && width <= 1560
              ? "grid-cols-3 justify-items-stretch"
              : ""
          }
          ${width > 1560 ? "grid-cols-4 justify-items-stretch" : ""}
        `}
      >
        {visibleVideos.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">
            Відео ще не додані
          </div>
        ) : (
          visibleVideos.map((video) => (
            <VideosCard video={video} key={video._id} />
          ))
        )}
      </div>
    </section>
  );
}
