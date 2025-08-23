"use client";

import Image from "next/image";
import Link from "next/link";
import { ICourse } from "@/types/courses.type";
import { ListVideo } from "lucide-react";

export default function CoursesCard({ course }: { course: ICourse }) {
  return (
    <Link key={course._id} href={`/courses/${course._id}`}>
      <div className="relative flex flex-col max-w-[370px] min-w-[290px] p-2 rounded-3xl bg-white overflow-hidden hover:shadow-card-video">
        <div className="relative w-full h-full rounded-2xl">
          <Image
            src={course.videos[0].cover}
            alt={course.title}
            width={354}
            height={200}
            className="relative w-full h-auto object-cover rounded-2xl overflow-hidden z-1"
          />
          <div className="absolute bottom-0 right-0 w-24 h-full flex flex-col justify-center items-center rounded-r-2xl  bg-[#00000030] backdrop-blur-md z-2">
            <p className="flex justify-center items-center text-white font-medium text-2xl leading-8 tracking-tighter">
              {course.videos.length}
            </p>
            <ListVideo
              size={24}
              strokeWidth={2}
              absoluteStrokeWidth
              color="#ffffff"
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#E6E6E6] w-[77%] h-[77%] z-0 rounded-2xl" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#B3B3B3] w-[88%] h-[88%] z-0 rounded-2xl" />
        </div>
        {course.category.map((c, idx) => {
          return (
            <div
              key={idx}
              className={`absolute top-4 right-${
                (idx * 16 + 16) / 4
              } flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm z-3`}
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

        <div className="absolute top-11 right-4 flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm z-3">
          <Image
            src={`/icons/crown.svg`}
            alt="Crown"
            width={16}
            height={16}
            className="object-contain w-auto h-4"
          />
        </div>

        <div className="px-3 pt-3 py-1 flex-1 flex flex-col gap-1">
          <p className="font-medium text-[15px] min-h-9 leading-[18px] tracking-thin line-clamp-2">
            {course.title.split("_").join(" ")}
          </p>
          <p className="font-medium text-[12px] leading-4 tracking-thin line-clamp-1 text-muted">
            {course.category.join(", ")}
          </p>
        </div>
      </div>
    </Link>
  );
}
