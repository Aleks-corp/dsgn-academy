"use client";

import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import type { ICourse } from "@/types/courses.type";
import { durationStringToString } from "@/lib/duration.utils";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import SafeImage from "../SafeImage";
import { Play } from "lucide-react";
import { useDragScroll } from "@/hooks/useDragScroll";

type Iprops = {
  course: ICourse;
  selectedVideoIndex: number;
  setSelectedVideoIndex: Dispatch<SetStateAction<number>>;
};

export default function CoursePlayList({
  course,
  selectedVideoIndex,
  setSelectedVideoIndex,
}: Iprops) {
  const width = useWindowWidth();
  const scrollBind = useDragScroll();
  if (width >= 1024) {
    return (
      <div className="w-full lg:min-w-[300px] lg:max-w-[350px] xl:max-w-[400px] xxl:max-w-[460px]">
        <h2 className="text-xl font-medium leading-7 tracking-thinest mb-3 line-clamp-2">
          {course.title}
        </h2>
        <div className="flex flex-col">
          {course.videos.map((video, idx) => (
            <button
              type="button"
              onClick={() => setSelectedVideoIndex(idx)}
              key={course._id + idx}
              className="flex w-full text-start gap-2 cursor-pointer rounded-xl hover:bg-muted-background p-1.5 transition-all duration-300"
            >
              <div className="flex items-center">
                <p className="flex justify-center items-center text-muted font-medium text-xs leading-[14px] tracking-thiner">
                  {selectedVideoIndex === idx ? (
                    <Play
                      size={14}
                      strokeWidth={1.5}
                      absoluteStrokeWidth
                      color="#7b7b7b"
                      fill="#7b7b7b"
                    />
                  ) : (
                    idx + 1
                  )}
                </p>
              </div>
              <div className="relative max-w-44 flex-shrink-0 bg-muted rounded-xl overflow-hidden">
                <SafeImage
                  src={video.cover}
                  alt={video.title}
                  width={200}
                  height={120}
                  className="w-full h-full rounded-xl object-cover"
                />
                <div className="absolute bottom-1.5 right-1.5 px-1 py-[1px] bg-[#00000080] rounded-md backdrop-blur-sm text-white font-inter text-xs leading-5 tracking-tighter z-7">
                  {durationStringToString(video.duration)}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium leading-5 tracking-thin w-full line-clamp-3">
                  {video.title}
                </p>
                <p className="text-xs font-medium text-muted leading-4 tracking-thin line-clamp-1 ">
                  {course.category.join(", ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <h2 className="text-xl font-medium leading-7 tracking-thinest">
        {course.title}
      </h2>
      <div
        {...scrollBind}
        className=" flex gap-3 overflow-x-auto no-scrollbar p-4"
      >
        {course.videos.length !== 0 &&
          course.videos.map((video, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 min-w-[250px] max-w-[350px]"
            >
              <button
                type="button"
                onClick={() => {
                  if (idx !== selectedVideoIndex) {
                    setSelectedVideoIndex(idx);
                  }
                }}
                key={course._id + idx}
                className="flex gap-2 cursor-pointer rounded-xl hover:bg-muted-background p-1.5 transition-all duration-300"
              >
                <div className="relative flex flex-col max-w-[370px] min-w-[250px] p-2 rounded-3xl bg-white overflow-hidden hover:shadow-card-video transition-all duration-400">
                  <div className="relative w-full h-full rounded-2xl">
                    <SafeImage
                      src={video.cover}
                      alt={video.title}
                      width={200}
                      height={120}
                      className="w-full h-auto rounded-xl object-cover"
                    />
                    {selectedVideoIndex === idx && (
                      <div className="absolute bottom-0 right-0 w-24 h-full flex flex-col justify-center items-center rounded-r-2xl  bg-[#00000030] backdrop-blur-md z-2">
                        <Play
                          size={24}
                          strokeWidth={1.5}
                          absoluteStrokeWidth
                          color="#ffffff"
                        />
                      </div>
                    )}
                    {course.category.map((c, idx) => {
                      return (
                        <div
                          key={idx}
                          className={`absolute top-2 right-${
                            (idx * 8 + 8) / 4
                          } flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm z-2`}
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
                    <div className="absolute bottom-1.5 right-1.5 px-1 py-[1px] bg-[#00000080] rounded-md backdrop-blur-sm text-white font-inter text-xs leading-5 tracking-tighter z-7">
                      {durationStringToString(video.duration)}
                    </div>
                  </div>
                  <div className="flex flex-col py-1">
                    <span className="font-medium leading-5 tracking-thin text-sm  line-clamp-3">
                      {video.title}
                    </span>
                    {/* <span className="font-medium text-xs leading-4 tracking-thin line-clamp-1 text-muted">
                  {c.filter.join(", ")}
                </span> */}
                  </div>
                </div>
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
