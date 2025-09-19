"use client";

import Image from "next/image";
import Link from "next/link";
import { durationStringToString } from "@/lib/duration.utils";
import SafeImage from "../SafeImage";
import { IShort } from "@/types/shorts.type";

export default function ShortsCard({ short }: { short: IShort }) {
  return (
    <Link key={short._id} href={`/shorts/${short._id}`}>
      <div className="relative flex flex-col w-[190px] min-w-[180px] p-2 rounded-3xl bg-white overflow-hidden hover:shadow-card-video transition-all duration-400">
        <div className="relative w-full h-full aspect-9/16 rounded-2xl">
          <SafeImage
            src={short.cover}
            alt={short.title}
            width={480}
            height={270}
            className="relative w-auto h-full object-cover rounded-2xl"
          />
          {!short.free && (
            <div className="absolute top-2 right-2 flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm">
              <Image
                src={`/icons/crown.svg`}
                alt="Crown"
                width={16}
                height={16}
                className="object-contain w-4 h-4"
              />
            </div>
          )}
          {short.duration && (
            <div className="absolute bottom-2 right-2 px-1 py-[1px] bg-[#00000080] rounded-md backdrop-blur-sm text-white font-inter text-xs leading-5 tracking-tighter">
              {durationStringToString(short.duration)}
            </div>
          )}
        </div>

        <div className="px-3 pt-3 py-1 flex-1 flex flex-col gap-1">
          <p className="font-medium text-[15px] leading-[18px] tracking-thin line-clamp-2">
            {short.title.split("_").join(" ")}
          </p>
          <p className="font-medium text-[12px] leading-4 tracking-thin line-clamp-1 text-muted">
            {short.tags.slice(0, 2).join(", ")}
          </p>
        </div>
      </div>
    </Link>
  );
}
