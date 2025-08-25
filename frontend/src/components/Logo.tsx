"use client";

import Image from "next/image";
import { permanentRedirect } from "next/navigation";
import Beta from "@/components/Beta";
import { MiniTimer } from "@/components/timerPage/MiniTimer";
// import { useWindowWidth } from "@/lib/useWindowWidth";

export default function Logo() {
  // const width = useWindowWidth();
  return (
    <button
      type="button"
      onClick={() => permanentRedirect("/")}
      className="relative w-[98px] tabx:w-[175px] flex items-center gap-2 bg-white pl-5 pr-6 py-3 rounded-3xl cursor-pointer"
    >
      <Beta />
      <div className="hidden tabx:block absolute -top-3 left-10">
        <MiniTimer />
      </div>
      <Image
        className="object-contain"
        src="/logo.svg"
        alt="dsgn academy logo"
        width={53}
        height={28}
        priority
      />
      <p className="hidden tabx:block font-sora text-start text-foreground text-base font-extrabold leading-3.5 tracking-[-0.64px]">
        dsgn
        <br />
        academy
      </p>
    </button>
  );
}
