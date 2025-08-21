"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchVideoById, fetchRecommended } from "@/redux/videos/video.thunk";
import {
  selectIsLoadingVideos,
  selectVideo,
} from "@/redux/selectors/videos.selectors";
import Loader from "@/components/loaders/LoaderCircle";
import NotFoundComponent from "@/components/notFound/NotFound";
import { clearVideo } from "@/redux/videos/videoSlice";
import Image from "next/image";
import Vimeo from "@u-wave/react-vimeo";
import Link from "next/link";
import { withAlphaGuard } from "@/components/guards&providers/WithAlphaGuard";

type RecommendedVideo = {
  _id: string;
  title: string;
  cover: string;
  duration: string;
};

function VideoPage() {
  const dispatch = useAppDispatch();
  const [recommended, setRecommended] = useState<RecommendedVideo[]>([]);
  const [isReady, setIsReady] = useState(false);
  const { id } = useParams();
  const isLoading = useAppSelector(selectIsLoadingVideos);
  const video = useAppSelector(selectVideo);

  useEffect(() => {
    dispatch(fetchVideoById(id as string));
    return () => {
      dispatch(clearVideo());
    };
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchRecommended({ limit: 5, recommended: true })).then(
      (response) => setRecommended(response.payload.videos)
    );
  }, [dispatch]);

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
    <div className="flex flex-col lg:flex-row gap-8 w-full mx-auto max-w-[1440px] px-4 py-6">
      {/* Ліва частина */}
      <div className="flex-1">
        <div className="aspect-video w-full rounded-lg overflow-hidden">
          {!isReady && (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={video.cover}
                alt={video.title}
                width={752}
                height={423}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Vimeo
            key={video.video}
            video={video.video}
            responsive
            pip
            speed
            autoplay={false}
            width="100%"
            height="100%"
            playsInline
            onReady={() => setIsReady(true)}
          />
        </div>

        <h1 className="mt-4 text-xl font-semibold">{video.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{video.duration}</p>
        <p className="mt-4 text-sm whitespace-pre-line text-muted-foreground">
          {video.description}
        </p>
      </div>

      {/* Права частина — рекомендації */}
      <aside className="w-full lg:w-[360px] flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4">Рекомендовані</h2>
        <div className="flex flex-col gap-4">
          {recommended &&
            recommended.length !== 0 &&
            recommended.map((rec) => (
              <Link
                type="button"
                href={`/videos/${rec._id}`}
                key={rec._id}
                className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded-md"
              >
                <div className="w-40 h-24 flex-shrink-0 bg-muted rounded overflow-hidden">
                  <Image
                    src={rec.cover}
                    alt={rec.title}
                    width={295}
                    height={166}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-snug line-clamp-2">
                    {rec.title}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {rec.duration}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </aside>
    </div>
  );
}
export default withAlphaGuard(VideoPage);
// export default VideoPage
