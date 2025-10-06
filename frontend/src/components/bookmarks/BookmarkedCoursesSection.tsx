"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectBookmarkedCourses,
  selectTotalHits,
} from "@/selectors/courses.selector";
import { fetchBookMarkedCourses } from "@/redux/courses/course.thunk";
import { useEffect, useRef, useState } from "react";
import CoursesCard from "../courses/CoursesCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export default function BookmarkedCoursesSection() {
  const dispatch = useAppDispatch();
  const bookmarkedCourses = useAppSelector(selectBookmarkedCourses);
  const [isLoading, setIsLoading] = useState(false);
  const total = useAppSelector(selectTotalHits);
  const { width } = useWindowWidth();

  const limit =
    width >= 1024
      ? Math.ceil((width - 300) / 350) % 2 !== 0
        ? Math.ceil((width - 300) / 350) + 1
        : Math.ceil((width - 300) / 350)
      : Math.ceil((width - 32) / 300) % 2 !== 0
      ? Math.ceil((width - 32) / 300) + 1
      : Math.ceil((width - 32) / 300);

  const pageRef = useRef(limit / 2);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchBookMarkedCourses({ page: 1, limit: limit })).finally(() =>
      setIsLoading(false)
    );
  }, [dispatch, limit]);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const loadMore = () => {
    if (isLoading || (total && bookmarkedCourses.length >= total)) return;
    setIsLoading(true);
    pageRef.current += 1;
    dispatch(
      fetchBookMarkedCourses({ page: pageRef.current, limit: 2 })
    ).finally(() => setIsLoading(false));
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleScroll = (target: HTMLDivElement) => {
    const { scrollLeft, clientWidth, scrollWidth } = target;
    setAtStart(scrollLeft <= limit);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);

    if (scrollLeft + clientWidth >= scrollWidth - 150) {
      loadMore();
    }
  };
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    }
  }, [bookmarkedCourses]);

  return (
    <section className="w-full mt-4">
      <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
        Збережені курси
      </h2>

      <div className="relative">
        {width >= 740 && (
          <>
            <button
              type="button"
              aria-label="scroll back"
              onClick={() => scrollBy(-350)}
              className={`absolute top-1/2 -translate-y-1/2 -left-8 border-scroll cursor-pointer w-16 h-72 xl:h-80 z-150 rotate-0 rounded-3xl overflow-hidden transition-opacity duration-100 ${
                atStart ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 z-110 p-2 w-10 h-10 btn-scroll shadow-btns-scroll rounded-full">
                <ChevronLeft size={24} />
              </div>
            </button>

            <button
              type="button"
              aria-label="scroll forward"
              onClick={() => scrollBy(350)}
              className={`absolute top-1/2 -translate-y-1/2 -right-8 border-scroll cursor-pointer w-16 h-72 xl:h-80 z-150 rotate-0 rounded-3xl overflow-hidden transition-opacity duration-100 ${
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
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth p-4"
          onScroll={(e) => handleScroll(e.currentTarget)}
        >
          {bookmarkedCourses.length !== 0 &&
            bookmarkedCourses.map((course) => (
              <CoursesCard course={course} path="main" key={course._id} />
            ))}
          {bookmarkedCourses.length === 0 && isLoading && (
            <h3 className="font-medium text-sm leading-7 tracking-thinest text-muted mb-10">
              Збережених курсів поки немає
            </h3>
          )}
        </div>
      </div>
    </section>
  );
}
