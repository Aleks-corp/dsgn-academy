"use client";
import { useEffect, useState } from "react";

export function CountdownTimer({ targetTime }: { targetTime?: number | null }) {
  const [timeLeft, setTimeLeft] = useState(
    targetTime ? Math.max(targetTime - Date.now(), 0) : 0
  );

  useEffect(() => {
    if (!targetTime) return;
    const interval = setInterval(() => {
      const time = Math.max(targetTime - Date.now(), 0);
      setTimeLeft(time);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (!targetTime || timeLeft <= 0) {
    return (
      <p className="font-inter font-thin text-9xl text-background tracking-[-4.8px] uppercase">
        00:00:00:00
      </p>
    );
  }
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <p className="font-inter font-thin text-9xl text-background tracking-[-4.8px] uppercase">
      {pad(days)}:{pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </p>
  );
}
