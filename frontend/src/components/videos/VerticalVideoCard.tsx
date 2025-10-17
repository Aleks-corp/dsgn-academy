import Link from "next/link";
import { IVideo } from "@/types/videos.type";
import { durationStringToString } from "@/lib/duration.utils";
import SafeImage from "@/components/SafeImage";

export default function HorizontalVideoCard({ video }: { video: IVideo }) {
  return (
    <Link
      type="button"
      href={`/videos/${video._id}`}
      key={video._id}
      className="flex w-full gap-2 cursor-pointer rounded-xl hover:bg-muted-background p-1.5 transition-all duration-300"
    >
      <div className="relative max-w-44 flex-shrink-0 bg-muted rounded-xl overflow-hidden">
        <SafeImage
          src={video.cover}
          alt={video.title}
          width={200}
          height={120}
          className="w-full h-full rounded-xl object-cover"
        />
        {video.watched && video.watched?.progress !== 0 && (
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
              <SafeImage
                src={`/icons/${c}.svg`}
                alt={c.charAt(0).toUpperCase() + c.slice(1)}
                width={16}
                height={16}
                className="object-contain w-auto h-4"
              />
            </div>
          );
        })}
        {!video.free && (
          <div className="absolute top-9 right-2 flex justify-center items-center w-6 h-6 p-1 bg-[#00000060] rounded-md backdrop-blur-sm">
            <SafeImage
              src={`/icons/crown.svg`}
              alt="Crown"
              width={16}
              height={16}
              className="object-contain w-auto h-4"
            />
          </div>
        )}
        <div className="absolute bottom-1.5 right-1.5 px-1 py-[1px] bg-[#00000080] rounded-md backdrop-blur-sm text-white font-inter text-xs leading-5 tracking-tighter">
          {durationStringToString(video.duration)}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium leading-5 tracking-thin w-full line-clamp-3">
          {video.title}
        </p>
        <p className="text-xs font-medium text-muted leading-4 tracking-thin line-clamp-1 ">
          {video.filter.slice(0, 2).join(", ")}
        </p>
      </div>
    </Link>
  );
}
