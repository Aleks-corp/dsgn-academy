"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchVideoById } from "@/redux/videos/video.thunk";
import {
  selectIsLoadingVideos,
  selectVideo,
} from "@/redux/selectors/videos.selectors";

import { clearVideo } from "@/redux/videos/videoSlice";
import { withAlphaGuard } from "@/guards&providers/WithAlphaGuard";
import VideoPlayer from "@/components/videos/VideoPlayer";
import RecommendedList from "@/components/Recommended";
// import NotFoundComponent from "@/components/notFound/NotFound";
import { VideoCardSkeleton } from "@/components/skeleton/VideoCardSkeleton";

function VideoPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isLoading = useAppSelector(selectIsLoadingVideos);
  const video = useAppSelector(selectVideo);

  useEffect(() => {
    dispatch(fetchVideoById(id as string));
    return () => {
      dispatch(clearVideo());
    };
  }, [dispatch, id]);

  if (isLoading) {
    // return null;
    return <VideoCardSkeleton />;
  }

  // if (!video) {
  //   return <NotFoundComponent />;
  // }
  return (
    <div className="flex flex-col lg:flex-row justify-center gap-8 smx-auto">
      {/* Ліва частина */}
      {video && <VideoPlayer video={video} />}
      {/* Права частина — рекомендації */}
      <RecommendedList />
    </div>
  );
}
export default withAlphaGuard(VideoPage);
// export default VideoPage
