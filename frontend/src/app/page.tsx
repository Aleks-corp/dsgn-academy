"use client";
// import { Youtube, ChevronRight } from "lucide-react";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchCourses } from "@/redux/courses/course.thunk";
import { fetchVideos } from "@/redux/videos/video.thunk";
import HeroSection from "@/components/mainPage/HeroSection";
import CoursesSection from "@/components/mainPage/CourseSection";
import VideosSection from "@/components/mainPage/VideoSection";
import FilterSection from "@/components/videos/FilterSection";
import { withAlphaGuard } from "@/components/guards&providers/WithAlphaGuard";

function HomePage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCourses({ limit: 3 }));
    dispatch(fetchVideos({ limit: 3 }));
  }, [dispatch]);

  return (
    <div className="flex flex-col w-full mx-auto">
      <HeroSection />
      <FilterSection />
      <CoursesSection />
      <VideosSection />
    </div>
  );
}
export default withAlphaGuard(HomePage);
// export default HomePage;
