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
import { withAlphaGuard } from "@/guards/WithAlphaGuard";
import VideoPlayer from "@/components/videos/VideoPlayer";
import RecommendedList from "@/components/Recommended";
// import NotFoundComponent from "@/components/notFound/NotFound";
import { VideoCardSkeleton } from "@/components/skeleton/VideoCardSkeleton";
import { useCanWatchVideo } from "@/hooks/useCanWatchVideo";

function VideoPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isLoading = useAppSelector(selectIsLoadingVideos);
  const video = useAppSelector(selectVideo);
  const canWatch = useCanWatchVideo();

  useEffect(() => {
    dispatch(fetchVideoById(id as string));
    return () => {
      dispatch(clearVideo());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return <VideoCardSkeleton />;
  }

  if (!video) {
    return null;
    // return <NotFoundComponent />;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-8 smx-auto">
      {video && <VideoPlayer canWatch={video.free || canWatch} video={video} />}

      <RecommendedList />
    </div>
  );
}
export default withAlphaGuard(VideoPage);
// export default VideoPage
