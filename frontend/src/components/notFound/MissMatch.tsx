"use client";

import Lottie from "lottie-react";
import animationData from "@/public/animation/fall.json";
import NavLink from "@/components//links/Link";

export default function MissMatchComponent() {
  return (
    <div className="flex h-full max-h-[80vh] max-w-6xl w-full items-center justify-end md:pt-10">
      <div className="flex flex-col md:flex-row gap-4 w-full h-full max-h-[80vh] items-center">
        <div className="w-[70%] md:w-full h-full overflow-hidden tab:-translate-y-8 md:translate-0">
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              margin: "0px auto",
              outline: "none",
            }}
          />
        </div>
        <div className="md:flex-1/2">
          <p className="font-inter text-4xl lg:text-5xl lg:leading-14 tracking-[-1.44px] mb-4 max-w-2xs md:max-w-96 m-auto md:m-0">
            Ой... Я, здається,
            <br /> звернув не туди.
          </p>
          <p className="font-inter text-base lg:text-lg text-muted leading-7 tracking-[-0.36px] mb-8">
            Давайте повернемо вас туди, де живуть милі речі.
          </p>
          <NavLink text="На головну" rout="/"></NavLink>
        </div>
      </div>
    </div>
  );
}
