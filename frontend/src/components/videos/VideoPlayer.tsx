"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

import { selectVideo } from "@/redux/selectors/videos.selectors";
import Image from "next/image";
import Vimeo from "@u-wave/react-vimeo";
import { selectUser } from "@/redux/selectors/auth.selectors";
import Button from "@/components/buttons/Button";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";
import { PiThreadsLogoFill } from "react-icons/pi";
import { ChevronUp } from "lucide-react";

export default function VideoPlayer() {
  const profile = useAppSelector(selectUser);
  const [isReady, setIsReady] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const video = useAppSelector(selectVideo);
  const isBlocked = !profile || video?.free;
  console.log("🚀 ~ isBlocked:", isBlocked);

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
      <div className="aspect-video w-auto max-h-[80vh] object-contain rounded-lg overflow-hidden mb-5">
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
      <div className="max-w-[990px] px-5 pt-5 flex flex-col bg-white rounded-3xl">
        <div className="flex flex-col gap-4 w-full xl:flex-row xl:justify-between">
          <h1 className=" text-2xl font-bold leading-7 text-start">
            {video.title}
          </h1>
          <div className="flex items-center justify-end gap-3">
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
              expanded ? "line-clamp-none" : "line-clamp-3"
            }`}
          >
            {video.description}
          </p>

          {video.description && video.description.length > 120 && (
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
