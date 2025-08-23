"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchVideoById } from "@/redux/videos/video.thunk";
import {
  selectIsLoadingVideos,
  selectVideo,
} from "@/redux/selectors/videos.selectors";
import Loader from "@/components/loaders/LoaderCircle";
import NotFoundComponent from "@/components/notFound/NotFound";
import { clearVideo } from "@/redux/videos/videoSlice";
import { withAlphaGuard } from "@/guards&providers/WithAlphaGuard";
import VideoPlayer from "@/components/videos/VideoPlayer";
import RecommendedList from "@/components/Recommended";

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
    return (
      <div className="w-20 h-20 mt-10">
        <Loader />
      </div>
    );
  }

  if (!video) {
    return <NotFoundComponent />;
  }
  return (
    <div className="flex flex-col lg:flex-row justify-center gap-8 smx-auto">
      {/* Ліва частина */}
      <VideoPlayer />
      {/* Права частина — рекомендації */}
      <RecommendedList />
    </div>
  );
}
export default withAlphaGuard(VideoPage);
// export default VideoPage
