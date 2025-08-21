"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchVideoById } from "@/redux/videos/video.thunk";
import {
  selectIsLoadingVideos,
  selectVideo,
} from "@/redux/selectors/videos.selectors";
import Loader from "@/components/loaders/LoaderCircle";

import InProgressComponent from "@/components/notFound/InProgress";

export default function ShortsPage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoadingVideos);
  const shorts = useAppSelector(selectVideo);
  console.log("🚀 ~ shorts:", shorts);

  useEffect(() => {
    dispatch(fetchVideoById("689f89a4c5cbec743952f1ce"));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="w-20 h-20 mt-10">
        <Loader />
      </div>
    );
  }

  if (!shorts) {
    return (
      <InProgressComponent
        title="Розділ"
        desc="А пока можна переглянути інші відео."
      />
    );
  }
  return (
    <InProgressComponent
      title="Розділ"
      desc="А пока можна переглянути інші відео."
    />
  );
}
