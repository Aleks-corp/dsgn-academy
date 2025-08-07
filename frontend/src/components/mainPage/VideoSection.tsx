"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { selectVideos } from "@/selectors/videos.selectors";

export default function VideosSection() {
  const videos = useAppSelector(selectVideos);
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Останні відео</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-3 text-center text-gray-400">
            Відео ще не додані
          </div>
        ) : (
          videos.map((video) => (
            <Link key={video._id} href={`/videos/${video._id}`}>
              <div className="rounded-xl shadow-sm border bg-white hover:shadow-lg transition group overflow-hidden flex flex-col">
                <Image
                  src={video.cover}
                  alt={video.title}
                  width={400}
                  height={180}
                  className="w-full h-[180px] object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-bold text-lg mb-2">{video.title}</div>
                  {video.category && (
                    <div className="text-xs text-[#8E8E9B] mb-1">
                      {video.category}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
