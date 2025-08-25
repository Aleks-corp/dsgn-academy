"use client";

import Image from "next/image";
import { permanentRedirect } from "next/navigation";
import Beta from "@/components/Beta";

export default function Logo() {
  return (
    <button
      type="button"
      onClick={() => permanentRedirect("/")}
      className="relative w-[98px] tabx:w-[175px] flex items-center gap-2 bg-white pl-5 pr-6 py-3 rounded-3xl cursor-pointer"
    >
      <Beta />
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
