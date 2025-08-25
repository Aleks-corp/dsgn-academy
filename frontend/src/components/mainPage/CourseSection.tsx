"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCourses } from "@/selectors/courses.selector";
import { fetchCourses } from "@/redux/courses/course.thunk";
import { useEffect, useRef, useState } from "react";
import CoursesCard from "../courses/CoursesCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ICourse } from "@/types/courses.type";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { unwrapResult } from "@reduxjs/toolkit";

interface CoursesPayload {
  courses: ICourse[];
  total: number;
  page: number;
}

export default function CoursesSection() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector(selectCourses);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const pageRef = useRef(1);

  const width = useWindowWidth();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchCourses({ page: 1, limit: 5 }))
      .then(unwrapResult)
      .then((payload: CoursesPayload) => {
        setIsLoading(false);
        if (payload.total) setTotal(payload.total);
      });
  }, [dispatch]);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const loadMore = () => {
    if (isLoading || (total && courses.length >= total)) return;
    setIsLoading(true);
    pageRef.current += 1;
    dispatch(fetchCourses({ page: pageRef.current, limit: 2 })).finally(() =>
      setIsLoading(false)
    );
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleScroll = (target: HTMLDivElement) => {
    const { scrollLeft, clientWidth, scrollWidth } = target;
    setAtStart(scrollLeft <= 5);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);

    if (scrollLeft + clientWidth >= scrollWidth - 50) {
      loadMore();
    }
  };

  return (
    <section className="w-full mt-4 relative">
      <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
        Курси
      </h2>

      <div className="relative -z-0">
        {width >= 740 && (
          <>
            <button
              type="button"
              onClick={() => scrollBy(-350)}
              className={`absolute top-1/2 -translate-y-1/2 -left-8 border-scroll cursor-pointer w-16 h-72 xl:h-80 z-150 rotate-0 rounded-3xl overflow-hidden ${
                atStart ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 z-110 p-2 w-10 h-10 btn-scroll shadow-btns-scroll rounded-full">
                <ChevronLeft size={24} />
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollBy(350)}
              className={`absolute top-1/2 -translate-y-1/2 -right-8 border-scroll cursor-pointer w-16 h-72 xl:h-80 z-150 rotate-0 rounded-3xl overflow-hidden ${
                atEnd ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div
                className={`absolute left-0.5 top-1/2 -translate-y-1/2 z-110 p-2 w-10 h-10 btn-scroll shadow-btns-scroll rounded-full`}
              >
                <ChevronRight size={24} />
              </div>
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth"
          onScroll={(e) => handleScroll(e.currentTarget)}
        >
          {courses.map((course) => (
            <CoursesCard course={course} key={course._id} />
          ))}
        </div>
      </div>
    </section>
  );
}
