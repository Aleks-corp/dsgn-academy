"use client";

import Image from "next/image";
import Link from "next/link";
import { IVideo } from "@/types/videos.type";
import { durationStringToString } from "@/lib/duration.utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleBookmarkedVideo } from "@/redux/videos/video.thunk";
import { toggleVideoBookMarked } from "@/redux/videos/videoSlice";
import { selectUser } from "@/redux/selectors/auth.selectors";
import SafeImage from "@/components/SafeImage";
import MaskIcon from "@/components/MaskIcon";

export default function VideosCard({ video }: { video: IVideo }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleBookmarkClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleBookmarkedVideo(video._id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(toggleVideoBookMarked(video._id));
      }
    });
  };

  return (
    <Link key={video._id} href={`/videos/${video._id}`}>
      <div className="relative flex flex-col max-w-[560px] min-w-[290px] p-2 rounded-3xl bg-white overflow-hidden hover:shadow-card-video transition-all duration-400">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <SafeImage
            src={video.cover}
            alt={video.title}
            width={354}
            height={200}
            className="relative w-full h-auto object-cover rounded-2xl"
          />
          {user && video.watched && video.watched?.progress !== 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1.5">
              <div className="w-full h-0.5 bg-[#0F0F0F] opacity-20" />
              <div className="w-full h-1 bg-[#A8A8A8]">
                <div
                  className="h-1 bg-accent"
                  style={{
                    width: `${
                      (video.watched.progress / parseInt(video.duration)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {video.category.map((c, idx) => {
            return (
              <div
                key={idx}
                className={`absolute top-2 right-${
                  (idx * 8 + 8) / 4
                } flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm`}
              >
                <Image
                  src={`/icons/${c}.svg`}
                  alt={c.charAt(0).toUpperCase() + c.slice(1)}
                  width={16}
                  height={16}
                  className="object-contain w-4 h-4"
                />
              </div>
            );
          })}
          {!video.free && (
            <div className="absolute top-9 right-2 flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm">
              <Image
                src={`/icons/crown.svg`}
                alt="Crown"
                width={16}
                height={16}
                className="object-contain w-4 h-4"
              />
            </div>
          )}
          <div className="absolute bottom-2 right-2 px-1 py-[1px] bg-[#00000080] rounded-md backdrop-blur-sm text-white font-inter text-xs leading-5 tracking-tighter">
            {durationStringToString(video.duration)}
          </div>
        </div>

        <div className="pl-3 pr-2 pt-3 pb-1 flex-1 flex flex-col gap-1">
          <p className="font-medium text-[15px] leading-[18px] tracking-thin line-clamp-2">
            {video.title.split("_").join(" ")}
          </p>
          <div className="flex justify-between">
            <p className="font-medium text-[12px] leading-4 tracking-thin line-clamp-1 text-muted">
              {video.filter.slice(0, 2).join(", ")}
            </p>
            {user && (
              <button
                type="button"
                aria-label="bookmark"
                onClick={handleBookmarkClick}
                className="flex items-center justify-center w-7 h-7 p-1.5 rounded-lg hover:bg-muted-background transition cursor-pointer"
              >
                {video.bookmarked ? (
                  <MaskIcon
                    src="/icons/menu-icons/bookmark-fill.svg"
                    className="w-4 h-4 text-foreground"
                  />
                ) : (
                  <MaskIcon
                    src="/icons/menu-icons/bookmark.svg"
                    className="w-4 h-4 text-muted"
                  />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
