"use client";

import Image from "next/image";
import Link from "next/link";
import { ICourse } from "@/types/courses.type";
import { ListVideo } from "lucide-react";
import SafeImage from "../SafeImage";
import { categoriesConst } from "@/constants/categories.constant";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/selectors/auth.selectors";
import { toggleBookmarkedCourse } from "@/redux/courses/course.thunk";
import { toggleCourseBookMarked } from "@/redux/courses/courseSlice";

export default function CoursesCard({
  course,
  path,
}: {
  course: ICourse;
  path?: string;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleBookmarkClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleBookmarkedCourse(course._id));
    dispatch(toggleCourseBookMarked(course._id));
  };
  const videosWatchedProgress = (course: ICourse) =>
    course.videos.reduce((acc, v) => {
      if (v.watched) {
        const time = v.watched.progress / parseInt(v.duration);
        return time + acc;
      }
      return acc;
    }, 0);

  return (
    <Link key={course._id} href={`/courses/${course._id}`}>
      <div
        className={`relative flex flex-col ${
          path === "main"
            ? "xl:w-[350px] w-[300px] hover:shadow-card-course"
            : "max-w-[560px] min-w-[290px] hover:shadow-card-video"
        }  p-2 rounded-3xl bg-white overflow-hidden transition-all duration-400`}
      >
        <div className="relative w-full h-full rounded-2xl">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <SafeImage
              src={course.videos[0].cover}
              alt={course.title}
              width={354}
              height={200}
              className="relative w-full h-auto backdrop-blur-md object-cover rounded-2xl overflow-hidden z-1"
            />
            {user && videosWatchedProgress(course) !== 0 && (
              <div className="absolute bottom-0 left-0 w-full h-1.5 z-5">
                <div className="w-full h-0.5 bg-[#0F0F0F] opacity-20" />
                <div className="w-full h-1 bg-[#A8A8A8]">
                  <div
                    className="h-1 bg-accent"
                    style={{
                      width: `${
                        (videosWatchedProgress(course) / course.videos.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
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
          {course.category.map((c, idx) => {
            return (
              <div
                key={idx}
                className={`absolute top-2 right-${
                  (idx * 8 + 8) / 4
                } flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm z-3`}
              >
                <Image
                  src={`/icons/${c}.svg`}
                  alt={c.charAt(0).toUpperCase() + c.slice(1)}
                  width={16}
                  height={16}
                  className="object-contain w-4 h-4"
                />
              </div>
            );
          })}
          <div className="absolute top-9 right-2 flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm z-3">
            <Image
              src={`/icons/crown.svg`}
              alt="Crown"
              width={16}
              height={16}
              className="object-contain w-4 h-4"
            />
          </div>
        </div>

        <div className="px-3 pt-6 py-1 flex-1 flex flex-col gap-1">
          <p className="font-medium text-[15px] leading-[18px] tracking-thin line-clamp-2">
            {course.title}
          </p>
          <div className="flex justify-between">
            <p className="font-medium text-[12px] leading-4 tracking-thin line-clamp-1 text-muted">
              {course.category.map((c) => categoriesConst[c] || c).join(", ")}
            </p>
            {user && (
              <button
                type="button"
                onClick={handleBookmarkClick}
                className="flex items-center justify-center w-8 h-8 p-1.5 rounded-lg hover:bg-muted-background transition cursor-pointer"
              >
                {course.bookmarked ? (
                  <BsBookmarkFill size={16} color="var(--foreground)" />
                ) : (
                  <BsBookmark
                    style={{ strokeWidth: 0.5 }}
                    size={16}
                    color="var(--muted)"
                  />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
