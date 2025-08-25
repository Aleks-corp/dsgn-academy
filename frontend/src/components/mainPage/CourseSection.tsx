"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectCourses } from "@/selectors/courses.selector";
import CoursesCard from "../courses/CoursesCard";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export default function CoursesSection() {
  const courses = useAppSelector(selectCourses);
  const width = useWindowWidth();

  const isBelow1600 = width < 1560;
  const isBelow1280 = width < 1200;

  // якщо <1600 → обрізаємо до 3
  const visibleCourses =
    isBelow1600 && courses.length > 3
      ? courses.slice(0, 3)
      : courses.slice(0, 4);

  // якщо <1280 і курсів >3 → скрол
  const enableScroll = isBelow1280 && courses.length > 3;
  return (
    <section className="w-full mt-4">
      <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
        Курси
      </h2>
      <div
        className={`
          grid grid-cols-1 gap-3 
          xl:grid-cols-3 2xl:grid-cols-4
          xl:justify-items-stretch
          ${
            enableScroll
              ? "max-xl:flex max-xl:overflow-x-auto no-scrollbar"
              : ""
          }
        `}
      >
        {courses && courses.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">
            Курси ще не додані
          </div>
        ) : (
          (enableScroll ? courses : visibleCourses).map((course) => (
            <CoursesCard course={course} key={course._id} />
          ))
        )}
      </div>
    </section>
  );
}
