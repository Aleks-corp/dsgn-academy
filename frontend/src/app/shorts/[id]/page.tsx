"use client";

import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectShorts, selectShortsError } from "@/selectors/shorts.selector";
import ShortsViewer from "@/components/shorts/ShortViewer";
import Loader from "@/components/loaders/LoaderCircle";

export default function ShortFullPage() {
  const { id } = useParams<{ id: string }>();

  const shorts = useAppSelector(selectShorts);
  const error = useAppSelector(selectShortsError);

  if ((!id || !shorts) && !error)
    return (
      <div className="h-dvh w-dvw overflow-hidden flex justify-center items-center">
        <div className="w-20 h-20">
          <Loader />
        </div>
      </div>
    );

  return (
    typeof window !== "undefined" &&
    createPortal(<ShortsViewer initialId={id} />, document.body)
  );
}
