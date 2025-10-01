"use client";

import { useEffect, useState } from "react";
import { clearBookmarkedShorts } from "@/redux/shorts/shortsSlice";
import { clearBookmarkedVideos } from "@/redux/videos/videoSlice";
import { clearBookmarkedCourses } from "@/redux/courses/courseSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/selectors/auth.selectors";

import BookmarkedVideos from "@/components/bookmarks/BookmarkedVideos";
import BookmarkedCourses from "@/components/bookmarks/BookmarkedCourses";
import { withUserGuard } from "@/guards/WithUserGuard";

function ProfileBookmarkPage() {
  const profile = useAppSelector(selectUser);
  const [selectedTab, setSelectedTab] = useState<"videos" | "courses">(
    "videos"
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearBookmarkedVideos());
      dispatch(clearBookmarkedCourses());
      dispatch(clearBookmarkedShorts());
    };
  }, [dispatch]);

  if (!profile) {
    return null;
  }

  return (
    <div className="w-full flex flex-col">
      <nav className="relative flex gap-2.5 mb-5 z-10">
        {[
          { id: "videos", label: "Відео" },
          { id: "courses", label: "Курси" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
            className="relative flex items-center justify-center gap-2 px-[10px] py-[11px] text-foreground
             font-inter text-sm font-semibold leading-4 tracking-thin cursor-pointer transition-colors"
          >
            {tab.label}
            {selectedTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-[4px] bg-[#0170FD]" />
            )}
          </button>
        ))}
      </nav>

      {selectedTab === "videos" && <BookmarkedVideos />}
      {selectedTab === "courses" && <BookmarkedCourses />}
    </div>
  );
}
export default withUserGuard(ProfileBookmarkPage);
