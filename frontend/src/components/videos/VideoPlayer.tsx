"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import Image from "next/image";
import { selectIsAdmin, selectUser } from "@/redux/selectors/auth.selectors";
import Button from "@/components/buttons/Button";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";
import { PiThreadsLogoFill } from "react-icons/pi";
import { ChevronUp, Edit } from "lucide-react";
import { IVideo } from "@/types/videos.type";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import Restricted from "../Restricted";
import Link from "next/link";
import { useParams } from "next/navigation";
import moment from "moment";
import VidstackPlayer from "../VideoVidstack";
import VidstackPlayerYoutube from "../VideoVidstackYoutube";
import getInitialTime from "@/lib/getInitialTime";
import { updateWatchedVideo } from "@/redux/videos/video.thunk";
import { setVideoProgress } from "@/redux/videos/videoSlice";

export default function VideoPlayer({
  video,
  canWatch,
}: {
  video: IVideo;
  canWatch: boolean;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [expanded, setExpanded] = useState(false);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { id: videoId } = useParams();
  const [original, setOriginal] = useState(false);

  const { width } = useWindowWidth();

  if (!video) {
    return null;
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = video.title;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share canceled:", err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Посилання скопійовано!");
    }
  };

  const socialLinks = {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`,
    threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(
      `${shareText} ${shareUrl}`
    )}`,
  };

  return (
    <div className="flex flex-col max-w-[calc((100vh-116px)/9*16)]">
      <div className="relative aspect-[16/9] w-auto max-h-[calc(100vh-116px)] rounded-xl overflow-hidden bg-background mb-5">
        {!original ? (
          !canWatch ? (
            <>
              <Image
                src={video.cover}
                alt={video.title}
                width={752}
                height={423}
                priority
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 botom-0 right-0 left-0 w-full backdrop-blur-[48px] h-full">
                <Restricted
                  originalUrl={video.originalVideo}
                  original={original}
                  setOriginal={setOriginal}
                />
              </div>
            </>
          ) : (
            <VidstackPlayer
              title={video.title}
              cover={video.cover}
              video={video.video as string}
              initialTime={
                video.watched
                  ? getInitialTime(video.duration, video.watched.progress)
                  : 0
              }
              onProgress={(time) => {
                if (user) {
                  dispatch(
                    setVideoProgress({ videoId: video._id, currentTime: time })
                  );
                  dispatch(
                    updateWatchedVideo({
                      videoId: video._id,
                      currentTime: time,
                    })
                  );
                }
              }}
            />
          )
        ) : (
          <VidstackPlayerYoutube
            title={video.title}
            cover={video.cover}
            originalUrl={video.originalVideo as string}
            initialTime={
              video.watched
                ? getInitialTime(video.duration, video.watched.progress)
                : 0
            }
            onProgress={(time) => {
              if (user) {
                dispatch(
                  setVideoProgress({ videoId: video._id, currentTime: time })
                );
                dispatch(
                  updateWatchedVideo({ videoId: video._id, currentTime: time })
                );
              }
            }}
            className="absolute top-0 left-0 w-3xs aspect-video"
          />
        )}
      </div>
      <div className="w-auto px-4 py-4 flex flex-col bg-white rounded-3xl">
        <div className="flex flex-col gap-4 w-full xl:flex-row xl:justify-between">
          <h1 className=" text-2xl font-bold leading-7 text-start">
            {video.title}
          </h1>
          <div className="flex items-center justify-end gap-3">
            {isAdmin && (
              <Link href={`/da-admin/add/video/${videoId}`}>
                <Edit />
              </Link>
            )}
            <a
              href={socialLinks.threads}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:opacity-80 w-10 h-10 flex justify-center items-center rounded-[10px] border-1 border-border"
            >
              <PiThreadsLogoFill size={20} />
            </a>
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:opacity-80 w-10 h-10 flex justify-center items-center rounded-[10px] border-1 border-border"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:opacity-80 w-10 h-10 flex justify-center items-center rounded-[10px] border-1 border-border"
            >
              <FaTelegramPlane size={20} />
            </a>
            {/* кнопка поділитись */}
            <Button type="button" text="Поділитись" onClick={handleShare} />
          </div>
        </div>
        <div className="mt-5 text-sm text-[#131313] leading-5">
          {isAdmin && video.publishedAt && (
            <p className="my-4 font-bold">
              Date -{" "}
              {moment(new Date(video.publishedAt)).format("DD-MM-YYYY_HH:mm")}
            </p>
          )}
          <p
            className={`whitespace-pre-line transition-all duration-300 ${
              expanded || width >= 1024 ? "line-clamp-none" : "line-clamp-3"
            }`}
          >
            {video.description}
            {video.originalVideo && (
              <span className="flex mt-4">
                Оригінальне посилання:
                <Link
                  href={video.originalVideo}
                  className="ml-1 text-accent hover:text-accent-hover"
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  {video.originalVideo}
                </Link>
              </span>
            )}
          </p>
          {video.description &&
            video.description.length > 120 &&
            width < 1024 && (
              <div className="w-full flex justify-center translate-y-3">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="flex justify-center items-center w-10 h-10 text-muted bg-white font-medium rounded-full hover:text-muted-background cursor-pointer transition-all duration-300 shadow-icon"
                >
                  <div
                    className={` ${
                      !expanded ? "rotate-180" : "rotate-0"
                    } transition-transform duration-300`}
                  >
                    <ChevronUp />
                  </div>
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
