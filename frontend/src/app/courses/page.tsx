"use client";

// import { Youtube, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";

import { fetchCourses } from "@/redux/courses/course.thunk";
import { selectCourses } from "@/redux/selectors/courses.selector";

import CoursesSection from "@/components/courses/CoursesSection";
import NotFoundComponent from "@/components/notFound/NotFound";

import { withAlphaGuard } from "@/components/guards&providers/WithAlphaGuard";

function CoursesPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const courses = useAppSelector(selectCourses);

  useEffect(() => {
    const query = {
      category: searchParams.get("category") || "",
      limit: 9,
    };
    dispatch(fetchCourses(query));
  }, [dispatch, searchParams]);

  if (courses.length === 0) {
    return <NotFoundComponent />;
  }
  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* <FilterSection /> */}
      <CoursesSection />
    </div>
  );
}
export default withAlphaGuard(CoursesPage);
// export default CoursesPage;
