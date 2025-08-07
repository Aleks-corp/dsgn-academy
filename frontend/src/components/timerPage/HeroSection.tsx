"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center text-center p-5 pt-4 gap-4 w-full overflow-hidden bg-white rounded-3xl">
      <span className="text-sm text-muted-foreground leading-5 md:leading-11 mt-14">
        🇺🇦 Найкращі курси та відео <br className="md:hidden" /> з усього світу —
        тепер українською.
      </span>
      <h1 className="text-5xl md:text-[80px] font-medium text-muted-foreground leading-14 md:leading-[86px] tracking-[-3px] uppercase">
        ДИЗАЙН АКАДЕМІЯ
      </h1>
      <div className="text-sm md:text-lg text-muted-foreground leading-7 max-w-sm mb-14">
        Ми робимо платформу, яку самі мріяли мати.
        <br className="md:hidden" />
        Для себе. І для тебе. ❤️
      </div>
      <motion.div
        animate={{
          y: [4, -5, 5, -6, 4],
          x: [2, -3, 3, -2, 2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        drag
        dragElastic={1}
        dragConstraints={{ left: -130, right: 600, top: -45, bottom: 230 }}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1 }}
        className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 translate-x-[-170px] translate-y-[-118px] md:translate-x-[-278px] md:translate-y-[-132px] cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/icons/framer.svg"
          alt="Framer"
          width={25.6}
          height={38.4}
          className="drop-shadow-xl w-full h-full rotate-[-8deg]"
          draggable={false}
        />
      </motion.div>
      <div className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 rotate-[-2deg] translate-x-[140px] translate-y-[-108px] md:translate-x-[232px] md:translate-y-[-148px]">
        <Image
          src="/icons/rive.png"
          alt="Rive"
          width={40}
          height={40}
          className="drop-shadow-md w-full h-full"
        />
      </div>
      <div className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 rotate-[-4deg] translate-x-[-190px] translate-y-[48px] md:translate-x-[-328px] md:translate-y-[28px]">
        <Image
          src="/icons/figma.svg"
          alt="Figma"
          width={26}
          height={38}
          className="drop-shadow-lg w-full h-full"
        />
      </div>
      <div className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 rotate-[15deg] translate-x-[128px] translate-y-[0px] tab:translate-x-[200px] md:translate-x-[354px] md:translate-y-[4px]">
        <Image
          src="/icons/webflow.svg"
          alt="Webflow"
          width={38}
          height={24}
          className="drop-shadow-xl w-full h-full"
        />
      </div>
      <div className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 rotate-[6deg] translate-x-[96px] translate-y-[80px] md:translate-x-[206px] md:translate-y-[64px]">
        <Image
          src="/icons/spline.svg"
          alt="Spline"
          width={38}
          height={38}
          className="drop-shadow-md w-full h-full"
        />
      </div>
    </section>
  );
}
