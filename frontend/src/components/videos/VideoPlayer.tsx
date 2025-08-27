"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

import Image from "next/image";
import Vimeo from "@u-wave/react-vimeo";
import { selectIsAdmin } from "@/redux/selectors/auth.selectors";
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

export default function VideoPlayer({
  video,
  canWatch,
}: {
  video: IVideo;
  canWatch: boolean;
}) {
  const [isReady, setIsReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { id: videoId } = useParams();

  const width = useWindowWidth();

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
      toast.success("Посилання скопійовано!", {
        style: {
          boxShadow: "0 0 0 1.5px  #3582ff inset",

          padding: "16px",
          color: "#0170fd",
        },
        iconTheme: {
          primary: "#3582ff",
          secondary: "#FFFAEE",
        },
      });
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
    <div className="">
      <div className="relative aspect-video w-auto max-w-[990px] max-h-[90vh] object-contain rounded-lg overflow-hidden mb-5">
        {!isReady && (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={video.cover}
              alt={video.title}
              width={752}
              height={423}
              priority
              className="w-full h-full object-cover "
            />
          </div>
        )}
        {!canWatch ? (
          <>
            <Image
              src={video.cover}
              alt={video.title}
              width={752}
              height={423}
              priority
              className="w-full h-full object-cover "
            />
            <div className="absolute top-0 botom-0 right-0 left-0 w-full backdrop-blur-[48px] h-full">
              <Restricted />
            </div>
          </>
        ) : (
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
            className="aspect-video"
          />
        )}
      </div>
      <div className="md:w-full lg:max-w-[710px] xl:max-w-[820px] xxl:max-w-[990px] 2xl:max-w-[990px] px-4 py-4 flex flex-col bg-white rounded-3xl">
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
          <p
            className={`whitespace-pre-line transition-all duration-300 ${
              expanded || width >= 1024 ? "line-clamp-none" : "line-clamp-3"
            }`}
          >
            {video.description}
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
