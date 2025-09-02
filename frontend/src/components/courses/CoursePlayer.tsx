"use client";

import { useState } from "react";

import SafeImage from "@/components/SafeImage";
import { ICourseVideo } from "@/types/courses.type";
import Restricted from "../Restricted";
import VidstackPlayer from "../VideoVidstack";
import VidstackPlayerYoutube from "../VideoVidstackYoutube";

export default function CoursePlayer({
  selectedVideo,
  canWatch,
}: {
  selectedVideo: ICourseVideo;
  canWatch: boolean;
}) {
  const [original, setOriginal] = useState(false);

  return (
    <div className="relative aspect-video w-auto px-0 max-h-[80vh] bg-black object-contain rounded-xl overflow-hidden mb-5">
      {!original ? (
        !canWatch ? (
          <>
            <SafeImage
              src={selectedVideo.cover}
              alt={selectedVideo.title}
              width={752}
              height={423}
              className="w-full h-full object-cover rounded-xl overflow-hidden"
            />
            <div className="absolute top-0 botom-0 right-0 left-0 w-full backdrop-blur-[48px] h-full">
              <Restricted
                originalUrl={selectedVideo.originalUrl}
                original={original}
                setOriginal={setOriginal}
              />
            </div>
          </>
        ) : (
          <VidstackPlayer
            title={selectedVideo.title}
            cover={selectedVideo.cover}
            video={selectedVideo.url}
          />
        )
      ) : selectedVideo.originalUrl ? (
        <VidstackPlayerYoutube
          title={selectedVideo.title}
          cover={selectedVideo.cover}
          originalUrl={selectedVideo.originalUrl}
          className="absolute top-0 left-0 w-3xs aspect-video"
        />
      ) : null}
    </div>
  );
}
