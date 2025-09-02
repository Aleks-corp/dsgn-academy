"use client";

import { useWindowWidth } from "@/hooks/useWindowWidth";
import CoursesCard from "./CoursesCard";
import { ICourse } from "@/types/courses.type";

export default function CoursesSection({ courses }: { courses: ICourse[] }) {
  const { width } = useWindowWidth();

  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;
  return (
    <section className="px-5 pb-2">
      <h2 className="text-xl font-bold mb-4">Курси</h2>
      <div
        className={`grid gap-4 mx-auto
          ${cols === 1 ? "grid-cols-1 justify-items-center" : ""}
          ${cols === 2 ? "grid-cols-2 justify-items-stretch" : ""}
          ${cols === 3 ? "grid-cols-3 justify-items-stretch" : ""}
          ${cols === 4 ? "grid-cols-4 justify-items-stretch" : ""}
        `}
      >
        {courses.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">
            Курсів поки що немає
          </div>
        ) : (
          courses.map((course) => (
            <CoursesCard key={course._id} course={course} />
          ))
        )}
      </div>
    </section>
  );
}
