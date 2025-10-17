"use client";

import { useWindowWidth } from "@/hooks/useWindowWidth";
import { IVideo } from "@/types/videos.type";
import { VideoCardsSkeleton } from "@/components/skeleton/VideoCardSkeleton";
import VideosCard from "@/components/videos/VideosCard";

export default function VideosSection({
  videos,
  isLoadingVideo,
  isAddHeader = true,
}: {
  videos: IVideo[];
  isLoadingVideo: boolean;
  isAddHeader?: boolean;
}) {
  const { width } = useWindowWidth();

  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  const arr = [];
  for (let index = 0; index < cols; index++) {
    arr.push(index);
  }
  return (
    <section className="w-full">
      {isAddHeader && (
        <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
          Останні відео
        </h2>
      )}
      <div
        className={`grid gap-4 mx-auto
          ${cols === 1 ? "grid-cols-1 justify-items-center" : ""}
          ${cols === 2 ? "grid-cols-2 justify-items-stretch" : ""}
          ${cols === 3 ? "grid-cols-3 justify-items-stretch" : ""}
          ${cols === 4 ? "grid-cols-4 justify-items-stretch" : ""}
        `}
      >
        {videos.length !== 0 &&
          videos.map((video) => <VideosCard video={video} key={video._id} />)}
      </div>
      <div
        className={`grid gap-4 mx-auto
          ${cols === 1 ? "grid-cols-1 justify-items-center" : ""}
          ${cols === 2 ? "grid-cols-2 justify-items-stretch" : ""}
          ${cols === 3 ? "grid-cols-3 justify-items-stretch" : ""}
          ${cols === 4 ? "grid-cols-4 justify-items-stretch" : ""}
        `}
      >
        {isLoadingVideo && arr.map((i) => <VideoCardsSkeleton key={i} />)}
      </div>
    </section>
  );
}
