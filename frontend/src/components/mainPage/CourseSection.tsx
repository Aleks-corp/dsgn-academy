"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { selectCourses } from "@/selectors/courses.selector";

export default function CoursesSection() {
  const courses = useAppSelector(selectCourses);
  return (
    <section className="px-5 py-2">
      <h2 className="text-xl font-bold mb-4">Курси</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {courses && courses.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">
            Курси ще не додані
          </div>
        ) : (
          courses.map((course) => (
            <Link key={course._id} href={`/courses/${course._id}`}>
              <div className="relative rounded-3xl p-2 shadow-sm bg-white hover:shadow-lg transition group overflow-hidden flex flex-col w-full">
                {course.videos[0].cover && (
                  <>
                    <Image
                      src={course.videos[0].cover}
                      alt={course.title}
                      width={400}
                      height={180}
                      className="relative w-full h-[180px] object-cover rounded-2xl z-7"
                    />
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#B3B3B3] w-[90%] h-[175px] z-5 rounded-2xl" />
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#E6E6E6] w-[80%] h-[170px] z-3 rounded-2xl" />
                  </>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-bold text-lg mb-2">{course.title}</div>
                  <div className="text-sm text-gray-500 flex-1">
                    {course.description}
                  </div>

                  <div className="mt-2 text-xs text-right text-gray-400">
                    {course.videos.length} уроків
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
