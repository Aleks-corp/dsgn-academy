"use client";

// import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import { fetchAround } from "@/lib/api/fetchShorts";
import ShortsViewer from "@/components/shorts/ShortViewer";
// import type { IShort } from "@/types/shorts.type";
import Loader from "@/components/loaders/LoaderCircle";
import { useAppSelector } from "@/redux/hooks";
import {
  selectShorts,
  selectShortsError,
} from "@/redux/selectors/shorts.selector";

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
    <div className="h-dvh w-dvw overflow-hidden">
      <ShortsViewer initialId={id} />
    </div>
  );
}
