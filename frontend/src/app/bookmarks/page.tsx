"use client";

import { useEffect } from "react";
import { clearBookmarkedVideos } from "@/redux/videos/videoSlice";
import { clearBookmarkedCourses } from "@/redux/courses/courseSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/selectors/auth.selectors";

import { withUserGuard } from "@/guards/WithUserGuard";
import FilterSection from "@/components/videos/FilterSection";
import BookmarkedCoursesSection from "@/components/bookmarks/BookmarkedCoursesSection";
import BookmarkedVideosSection from "@/components/bookmarks/BookmarkedVideosSection";

function ProfileBookmarkPage() {
  const profile = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearBookmarkedVideos());
      dispatch(clearBookmarkedCourses());
    };
  }, [dispatch]);

  if (!profile) {
    return null;
  }

  return (
    <div className="w-full flex flex-col">
      <FilterSection />
      <BookmarkedCoursesSection />
      <BookmarkedVideosSection />
    </div>
  );
}
export default withUserGuard(ProfileBookmarkPage);
