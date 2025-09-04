"use client";

import ShortsCard from "../shorts/ShortsCard";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { VideoCardsSkeleton } from "../skeleton/VideoCardSkeleton";
import { IShort } from "@/types/shorts.type";

export default function ShortsSection({
  shorts,
  isLoadingShorts,
}: {
  shorts: IShort[];
  isLoadingShorts: boolean;
}) {
  const { width } = useWindowWidth();

  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  const arr = [];
  for (let index = 0; index < cols; index++) {
    arr.push(index);
  }
  return (
    <section className="w-full">
      {/* <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
        Останні відео
      </h2> */}
      <div
        // className={`grid gap-4 mx-auto
        //   ${cols === 1 ? "grid-cols-1 justify-items-center" : ""}
        //   ${cols === 2 ? "grid-cols-2 justify-items-stretch" : ""}
        //   ${cols === 3 ? "grid-cols-3 justify-items-stretch" : ""}
        //   ${cols === 4 ? "grid-cols-4 justify-items-stretch" : ""}
        // `}
        className="flex flex-wrap gap-4"
      >
        {shorts.length !== 0 &&
          shorts.map((short) => <ShortsCard short={short} key={short._id} />)}
      </div>
      <div
        className={`grid gap-4 mx-auto
          ${cols === 1 ? "grid-cols-1 justify-items-center" : ""}
          ${cols === 2 ? "grid-cols-2 justify-items-stretch" : ""}
          ${cols === 3 ? "grid-cols-3 justify-items-stretch" : ""}
          ${cols === 4 ? "grid-cols-4 justify-items-stretch" : ""}
        `}
      >
        {isLoadingShorts && arr.map((i) => <VideoCardsSkeleton key={i} />)}
      </div>
    </section>
  );
}
