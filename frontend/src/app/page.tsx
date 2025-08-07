"use client";

import { useEffect } from "react";
// import { Youtube, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { isAlpha } from "@/redux/test/test.thunk";
import { selectIsAlpha, selectIsLoadingTest } from "@/selectors/test.selectors";
import { redirect } from "next/navigation";
import { fetchCourses } from "@/redux/courses/course.thunk";
import { fetchVideos } from "@/redux/videos/video.thunk";
import HeroSection from "@/components/mainPage/HeroSection";
import CoursesSection from "@/components/mainPage/CourseSection";
import VideosSection from "@/components/mainPage/VideoSection";
import FilterSection from "@/components/mainPage/FilterSection";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { CourseState, TestState, VideoState } from "@/types/state.types";
import Loader from "@/components/LoaderCircle";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const isAlphaTesting = useAppSelector(selectIsAlpha);
  const isLoading = useAppSelector(selectIsLoadingTest);

  const fetch = async (
    dispatch: ThunkDispatch<
      {
        courses: CourseState;
        videos: VideoState;
        test: TestState;
      },
      undefined,
      UnknownAction
    >
  ) => {
    const res = await dispatch(isAlpha());
    if (res.payload.isAlpha) {
      return;
    }
    await Promise.all([
      dispatch(fetchCourses({ limit: 4 })),
      dispatch(fetchVideos({ limit: 4 })),
    ]);
  };

  useEffect(() => {
    fetch(dispatch);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="w-20 h-20">
          <Loader />
        </div>
      </div>
    );
  }
  if (isAlphaTesting) {
    redirect("/timer");
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      <HeroSection />
      <FilterSection />
      <CoursesSection />
      <VideosSection />
    </div>
  );
}
