"use client";

import Image from "next/image";
import Link from "next/link";
import { IVideo } from "@/types/videos.type";
import { durationStringToString } from "@/lib/duration.utils";

export default function VideosCard({ video }: { video: IVideo }) {
  return (
    <Link key={video._id} href={`/videos/${video._id}`}>
      <div className="relative flex flex-col max-w-[370px] min-w-[260px] p-2 rounded-3xl bg-white overflow-hidden hover:shadow-card-video transition-all duration-300">
        <Image
          src={video.cover}
          alt={video.title}
          width={354}
          height={200}
          className="relative w-full h-auto object-cover rounded-2xl"
        />
        {video.category.map((c, idx) => {
          return (
            <div
              key={idx}
              className={`absolute top-4 right-${
                (idx * 16 + 16) / 4
              } flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm`}
            >
              <Image
                src={`/icons/${c}.svg`}
                alt={c.charAt(0).toUpperCase() + c.slice(1)}
                width={16}
                height={16}
                className="object-contain w-auto h-4"
              />
            </div>
          );
        })}
        {!video.free && (
          <div className="absolute top-11 right-4 flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm">
            <Image
              src={`/icons/crown.svg`}
              alt="Crown"
              width={16}
              height={16}
              className="object-contain w-auto h-4"
            />
          </div>
        )}
        <div className="absolute bottom-22 right-4 px-1 py-[1px] bg-[#00000080] rounded-md backdrop-blur-sm text-white font-inter text-xs leading-5 tracking-tighter">
          {durationStringToString(video.duration)}
        </div>

        <div className="px-3 pt-3 py-1 flex-1 flex flex-col gap-1">
          <p className="font-medium text-[15px] min-h-9 leading-[18px] tracking-thin line-clamp-2">
            {video.title.split("_").join(" ")}
          </p>
          <p className="font-medium text-[12px] leading-4 tracking-thin line-clamp-1 text-muted">
            {video.filter.join(", ")}
          </p>
        </div>
      </div>
    </Link>
  );
}
