"use client";

import { SetStateAction, Dispatch, useState } from "react";

import SafeImage from "@/components/SafeImage";
import { ICourseVideo } from "@/types/courses.type";
import Restricted from "../Restricted";
import VidstackPlayer from "../VideoVidstack";
import VidstackPlayerYoutube from "../VideoVidstackYoutube";
import getInitialTime from "@/lib/getInitialTime";
import { updateWatchedCourse } from "@/redux/courses/course.thunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/selectors/auth.selectors";
import { setCourseVideoProgress } from "@/redux/courses/courseSlice";
import { useRouter } from "next/navigation";
import Button from "../buttons/Button";

export default function CoursePlayer({
  selectedVideo,
  canWatch,
  nextVideoIdx,
  courseId,
  setSelectedVideoIndex,
}: {
  selectedVideo: ICourseVideo;
  canWatch: boolean;
  courseId: string;
  nextVideoIdx?: number;
  setSelectedVideoIndex: Dispatch<SetStateAction<number>>;
}) {
  const [original, setOriginal] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const [showNextBtn, setShowNextBtn] = useState(false);
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
            initialTime={
              selectedVideo.watched
                ? getInitialTime(
                    selectedVideo.duration,
                    selectedVideo.watched.progress
                  )
                : 0
            }
            onProgress={(time) => {
              if (user && selectedVideo._id) {
                dispatch(
                  setCourseVideoProgress({
                    courseId: courseId,
                    videoId: selectedVideo._id,
                    currentTime: time,
                  })
                );
                dispatch(
                  updateWatchedCourse({
                    courseId: courseId,
                    videoId: selectedVideo._id,
                    currentTime: time,
                  })
                );
              }
            }}
            onEndedCb={() => setShowNextBtn(true)}
          />
        )
      ) : selectedVideo.originalUrl ? (
        <VidstackPlayerYoutube
          title={selectedVideo.title}
          cover={selectedVideo.cover}
          originalUrl={selectedVideo.originalUrl}
          initialTime={
            selectedVideo.watched
              ? getInitialTime(
                  selectedVideo.duration,
                  selectedVideo.watched.progress
                )
              : 0
          }
          onProgress={(time) => {
            if (user && selectedVideo._id) {
              dispatch(
                setCourseVideoProgress({
                  courseId: courseId,
                  videoId: selectedVideo._id,
                  currentTime: time,
                })
              );
              dispatch(
                updateWatchedCourse({
                  courseId: courseId,
                  videoId: selectedVideo._id,
                  currentTime: time,
                })
              );
            }
          }}
          onEndedCb={() => setShowNextBtn(true)}
          className="absolute top-0 left-0 w-3xs aspect-video"
        />
      ) : null}
      {showNextBtn && (
        <div className="absolute bottom-16 right-4">
          {nextVideoIdx ? (
            <Button
              text="Наступне відео"
              onClick={() => {
                setSelectedVideoIndex(nextVideoIdx);
                setShowNextBtn(false);
              }}
              type="button"
            />
          ) : (
            <Button
              text="До всіх курсів"
              onClick={() => router.push("/courses")}
              type="button"
            />
          )}
        </div>
      )}
    </div>
  );
}
