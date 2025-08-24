"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { fetchRecommended } from "@/redux/videos/video.thunk";
import { useWindowWidth } from "@/lib/useWindowWidth";
import VideosCard from "@/components/videos/VideosCard";
import { IVideo } from "@/types/videos.type";
import VerticalVideoCard from "./videos/VerticalVideoCard";

export default function RecommendedList() {
  const dispatch = useAppDispatch();
  const [recommended, setRecommended] = useState<IVideo[]>([]);
  const width = useWindowWidth();

  useEffect(() => {
    dispatch(fetchRecommended({ limit: 10, recommended: true })).then((res) => {
      if (res?.payload?.videos) setRecommended(res.payload.videos);
    });
  }, [dispatch]);

  if (!recommended || recommended.length === 0) {
    return null;
  }

  // Desktop — вертикальний список
  if (width >= 1024) {
    return (
      <div className="w-full lg:min-w-[300px] lg:max-w-[350px] xl:max-w-[400px] xxl:max-w-[460px]">
        <h2 className="text-xl font-medium leading-7 tracking-thinest mb-3">
          Рекомендовані відео
        </h2>
        <div className="flex flex-col">
          {recommended.map((video, idx) => (
            <VerticalVideoCard key={video._id + idx} video={video} />
          ))}
        </div>
      </div>
    );
  }

  // Mobile / Tablet — горизонтальний скрол
  return (
    <div className="w-full">
      <h2 className="text-xl font-medium leading-7 tracking-thinest mb-3">
        Рекомендовані відео
      </h2>
      <div className=" flex gap-3 overflow-x-auto no-scrollbar pb-3">
        {recommended.map((video) => (
          <div
            key={video._id}
            className="flex-shrink-0 min-w-[250px] max-w-[350px]"
          >
            <VideosCard video={video} />
          </div>
        ))}
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { fetchRecommended } from "@/redux/videos/video.thunk";
// import { selectVideo } from "@/redux/selectors/videos.selectors";
// import Image from "next/image";
// import Link from "next/link";
// import FilterRecommended from "./Filters";
// import { durationStringToString } from "@/lib/duration.utils";
// import ScrollRow from "@/lib/scrollRow";

// type RecommendedVideo = {
//   _id: string;
//   title: string;
//   cover: string;
//   duration: string;
//   filter: string[];
// };

// export default function RecommendedList() {
//   const dispatch = useAppDispatch();
//   const [recommended, setRecommended] = useState<RecommendedVideo[]>([]);
//   const video = useAppSelector(selectVideo);
//   const [active, setActive] = useState("");

//   useEffect(() => {
//     dispatch(
//       fetchRecommended({ limit: 10, recommended: true, filter: active })
//     ).then((response) => setRecommended(response.payload.videos));
//   }, [active, dispatch]);

//   if (!video) {
//     return null;
//   }

//   return (
//     <aside className="w-full lg:w-[350px] xl:w-[400px] xxl:w-[460px]">
//       <h2 className="text-xl font-medium leading-7 tracking-thinest mb-3">
//         Рекомендовані відео
//       </h2>
//       <ScrollRow>
//         <FilterRecommended active={active} setActive={setActive} />
//       </ScrollRow>

//       <div className="flex flex-col mt-3">
//         {recommended &&
//           recommended.length !== 0 &&
//           recommended.map((rec) => (
//
//           ))}
//       </div>
//     </aside>
//   );
// }
