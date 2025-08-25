"use client";

"use client";

import VideosCard from "../videos/VideosCard";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { IVideo } from "@/types/videos.type";
import { VideoCardsSkeleton } from "../skeleton/VideoCardSkeleton";

export default function VideosSection({
  videos,
  isLoadingVideo,
  page,
}: {
  videos: IVideo[];
  isLoadingVideo: boolean;
  page: number;
}) {
  const width = useWindowWidth();
  if (isLoadingVideo && page === 1) {
    return (
      <div className="flex justify-center flex-wrap gap-5">
        <VideoCardsSkeleton />
        <VideoCardsSkeleton />
        <VideoCardsSkeleton />
        <VideoCardsSkeleton />
      </div>
    );
  }
  const cols = width <= 630 ? 1 : width <= 1200 ? 2 : width <= 1560 ? 3 : 4;

  return (
    <section className="w-full mt-4">
      <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
        Останні відео
      </h2>
      <div
        className={`grid gap-3 mx-auto
          ${cols === 1 ? "grid-cols-1 justify-items-center" : ""}
          ${cols === 2 ? "grid-cols-2 justify-items-stretch" : ""}
          ${cols === 3 ? "grid-cols-3 justify-items-stretch" : ""}
          ${cols === 4 ? "grid-cols-4 justify-items-stretch" : ""}
        `}
      >
        {videos.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            Відео ще не додані
          </div>
        ) : (
          videos.map((video) => <VideosCard video={video} key={video._id} />)
        )}
      </div>
    </section>
  );
}

// export default function VideosSection({ videos }: { videos: IVideo[] }) {
//   const width = useWindowWidth();

//   return (
//     <section className="w-full mt-4">
//       <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
//         Останні відео
//       </h2>
//       <div
//         className={`grid gap-3 mx-auto
//           ${width <= 630 ? "grid grid-cols-1 justify-items-center" : ""}
//           ${
//             width > 630 && width <= 1200
//               ? "grid-cols-2 justify-items-stretch"
//               : ""
//           }
//           ${
//             width > 1200 && width <= 1560
//               ? "grid-cols-3 justify-items-stretch"
//               : ""
//           }
//           ${width > 1560 ? "grid-cols-4 justify-items-stretch" : ""}
//         `}
//       >
//         {videos.length === 0 ? (
//           <div className="col-span-3 text-center text-gray-400">
//             Відео ще не додані
//           </div>
//         ) : (
//           videos.map((video) => <VideosCard video={video} key={video._id} />)
//         )}
//       </div>
//     </section>
//   );
// }

// import { useAppSelector } from "@/redux/hooks";
// import { selectVideos } from "@/selectors/videos.selectors";
// import VideosCard from "./VideosCard";

// export default function VideosSection() {
//   const videos = useAppSelector(selectVideos);
//   return (
//     <section className="px-5 py-2">
//       <h2 className="font-medium text-xl leading-7 tracking-thinest mb-4">
//         Останні відео
//       </h2>
//       <div className="grid grid-cols-1 mx-auto justify-items-center lg:justify-items-center-safe md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
//         {videos.length === 0 ? (
//           <div className="col-span-3 text-center text-gray-400">
//             Відео ще не додані
//           </div>
//         ) : (
//           videos.map((video) => <VideosCard video={video} key={video._id} />)
//         )}
//       </div>
//     </section>
//   );
// }
