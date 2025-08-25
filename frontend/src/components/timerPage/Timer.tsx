"use client";

import { useAppDispatch } from "@/redux/hooks";
import { isAlpha } from "@/redux/test/test.thunk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CountdownTimer({ targetTime }: { targetTime?: number | null }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [timeLeft, setTimeLeft] = useState(
    targetTime ? Math.max(targetTime - Date.now(), 0) : 0
  );

  useEffect(() => {
    if (!targetTime) return;
    const interval = setInterval(() => {
      const time = Math.max(targetTime - Date.now(), 0);
      setTimeLeft(time);
      if (!targetTime || timeLeft <= 0) {
        dispatch(isAlpha()).then(() => router.push("/"));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch, router, targetTime, timeLeft]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <p className="font-inter font-thin text-7xl tab:text-8xl md:text-9xl text-background tracking-[-4.8px] uppercase select-none">
      {pad(days)}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </p>
  );
}
