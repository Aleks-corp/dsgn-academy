"use client";

import { useState } from "react";
// import { useAppSelector } from "@/redux/hooks";

import Vimeo from "@u-wave/react-vimeo";
// import { selectUser } from "@/redux/selectors/auth.selectors";
import SafeImage from "@/components/SafeImage";
// import { PlayIcon } from "lucide-react";
import { ICourseVideo } from "@/types/courses.type";
import Restricted from "../Restricted";

export default function CoursePlayer({
  selectedVideo,
  canWatch,
}: {
  selectedVideo: ICourseVideo;
  canWatch: boolean;
}) {
  //   const profile = useAppSelector(selectUser);
  const [isReady, setIsReady] = useState(false);

  const isBlocked = true;
  console.log("🚀 ~ isBlocked:", isBlocked);

  return (
    <div className="relative aspect-video w-auto px-5 lg:px-0 max-h-[80vh] bg-black object-contain rounded-xl overflow-hidden mb-5">
      {!isReady && (
        <div className="w-full h-full flex items-center justify-center">
          <SafeImage
            src={selectedVideo.cover}
            alt={selectedVideo.title}
            width={752}
            height={423}
            className="w-full h-full object-cover rounded-xl overflow-hidden"
          />
        </div>
      )}
      {!canWatch ? (
        <>
          <SafeImage
            src={selectedVideo.cover}
            alt={selectedVideo.title}
            width={752}
            height={423}
            className="w-full h-full object-cover rounded-xl overflow-hidden"
          />
          {!canWatch && (
            <div className="absolute top-0 botom-0 right-0 left-0 w-full backdrop-blur-[48px] h-full">
              <Restricted />
            </div>
          )}
        </>
      ) : (
        <Vimeo
          key={selectedVideo.url}
          video={selectedVideo.url}
          responsive
          pip
          speed
          autoplay={false}
          width="100%"
          height="100%"
          playsInline
          onReady={() => setIsReady(true)}
          className="aspect-video"
        />
      )}
    </div>
  );
}
