"use client";

import { redirect } from "next/navigation";
import HeroSection from "@/components/timerPage/HeroSection";
import TimerSection from "@/components/timerPage/TimerSection";
import FaqSection from "@/components/timerPage/FaqSection";
import Loader from "@/components/loaders/LoaderCircle";
import { useAppSelector } from "@/redux/hooks";
import {
  selectIsAlpha,
  selectIsLoadingTest,
  selectTimer,
} from "@/redux/selectors/test.selectors";

export default function TimerPage() {
  const isAlphaTesting = useAppSelector(selectIsAlpha);
  const isLoading = useAppSelector(selectIsLoadingTest);
  const timer = useAppSelector(selectTimer);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="w-20 h-20">
          <Loader />
        </div>
      </div>
    );
  }
  if (!isAlphaTesting) {
    redirect("/");
  }
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[1440px] mx-auto">
      <HeroSection />
      <TimerSection timer={timer} />
      <FaqSection />
    </div>
  );
}
