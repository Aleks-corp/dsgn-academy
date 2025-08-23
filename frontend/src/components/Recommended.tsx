"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRecommended } from "@/redux/videos/video.thunk";
import { selectVideo } from "@/redux/selectors/videos.selectors";
import Image from "next/image";
import Link from "next/link";
import FilterRecommended from "./Filters";
import { durationStringToString } from "@/lib/duration.utils";
import ScrollRow from "@/lib/scrollRow";

type RecommendedVideo = {
  _id: string;
  title: string;
  cover: string;
  duration: string;
  filter: string[];
};

export default function RecommendedList() {
  const dispatch = useAppDispatch();
  const [recommended, setRecommended] = useState<RecommendedVideo[]>([]);
  const video = useAppSelector(selectVideo);
  const [active, setActive] = useState("");

  useEffect(() => {
    dispatch(
      fetchRecommended({ limit: 10, recommended: true, filter: active })
    ).then((response) => setRecommended(response.payload.videos));
  }, [active, dispatch]);

  if (!video) {
    return null;
  }

  return (
    <aside className="w-full lg:w-[350px] xl:w-[400px] xxl:w-[460px]">
      <h2 className="text-xl font-medium leading-7 tracking-thinest mb-3">
        Рекомендовані відео
      </h2>
      <ScrollRow>
        <FilterRecommended active={active} setActive={setActive} />
      </ScrollRow>

      <div className="flex flex-col mt-3">
        {recommended &&
          recommended.length !== 0 &&
          recommended.map((rec) => (
            <Link
              type="button"
              href={`/videos/${rec._id}`}
              key={rec._id}
              className="flex gap-2 cursor-pointer rounded-xl hover:bg-muted-background p-1.5 transition-all duration-300"
            >
              <div className="relative max-w-44 flex-shrink-0 bg-muted rounded-xl overflow-hidden">
                <Image
                  src={rec.cover}
                  alt={rec.title}
                  width={200}
                  height={120}
                  className="w-full h-full rounded-xl object-cover"
                />
                <div className="absolute bottom-1.5 right-1.5 px-1 py-[1px] bg-[#00000080] rounded-md backdrop-blur-sm text-white font-inter text-xs leading-5 tracking-tighter">
                  {durationStringToString(video.duration)}
                </div>
              </div>
              <div className="flex flex-col py-1">
                <span className="font-medium leading-5 tracking-thin text-sm  line-clamp-3">
                  {rec.title}
                </span>
                <span className="font-medium text-xs leading-4 tracking-thin line-clamp-1 text-muted">
                  {rec.filter.join(", ")}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </aside>
  );
}
