"use client";

import { IShort } from "@/types/shorts.type";
import ShortsCard from "@/components/shorts/ShortsCard";
import { VideoCardsSkeleton } from "@/components/skeleton/VideoCardSkeleton";

export default function ShortsSection({
  shorts,
  isLoadingShorts,
}: {
  shorts: IShort[];
  isLoadingShorts: boolean;
}) {
  return (
    <section className="w-full">
      <div className="flex flex-wrap gap-4">
        {shorts.length !== 0 &&
          shorts.map((short) => <ShortsCard short={short} key={short._id} />)}
      </div>
      <div className="grid gap-4 mx-auto grid-cols-1 justify-items-center">
        {isLoadingShorts && <VideoCardsSkeleton />}
      </div>
    </section>
  );
}
