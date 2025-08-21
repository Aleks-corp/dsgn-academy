"use client";

// import { Youtube, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";

import VideosSection from "@/components/videos/VideoSection";
import FilterSection from "@/components/videos/FilterSection";
import { fetchVideos } from "@/redux/videos/video.thunk";
import { useEffect } from "react";
import { selectVideos } from "@/redux/selectors/videos.selectors";
import NotFoundComponent from "@/components/notFound/NotFound";
import { withAlphaGuard } from "@/components/guards&providers/WithAlphaGuard";

function VideosPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const videos = useAppSelector(selectVideos);

  useEffect(() => {
    const query = {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      filter: searchParams.get("filter") || "",
      free: searchParams.get("free") === "" ? true : false,
      recommended: searchParams.get("recommended") === "" ? true : false,
    };
    dispatch(fetchVideos(query));
  }, [dispatch, searchParams]);

  if (videos.length === 0) {
    return <NotFoundComponent />;
  }
  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      <FilterSection />
      <VideosSection />
    </div>
  );
}
export default withAlphaGuard(VideosPage);
// export default VideosPage;
