"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState("desktop");

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 820) {
        setIsMobile("mobile");
      } else if (window.innerWidth >= 820 && window.innerWidth < 1280) {
        setIsMobile("tablet");
      } else if (window.innerWidth >= 1280) {
        setIsMobile("desktop");
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const dragFramer =
    isMobile === "mobile"
      ? { left: -30, right: 320, top: -70, bottom: 260 }
      : isMobile === "tablet"
      ? { left: -90, right: 560, top: -55, bottom: 260 }
      : { left: -130, right: 600, top: -45, bottom: 250 };

  const dragRive =
    isMobile === "mobile"
      ? { left: -340, right: 10, top: -80, bottom: 250 }
      : isMobile === "tablet"
      ? { left: -600, right: 60, top: -40, bottom: 260 }
      : { left: -630, right: 80, top: -40, bottom: 260 };

  const dragFigma =
    isMobile === "mobile"
      ? { left: -10, right: 340, top: -240, bottom: 90 }
      : isMobile === "tablet"
      ? { left: -40, right: 620, top: -220, bottom: 90 }
      : { left: -80, right: 650, top: -200, bottom: 90 };

  const dragWebflow =
    isMobile === "mobile"
      ? { left: -330, right: 10, top: -190, bottom: 140 }
      : isMobile === "tablet"
      ? { left: -710, right: 10, top: -200, bottom: 130 }
      : { left: -750, right: 10, top: -190, bottom: 120 };

  const dragSpline =
    isMobile === "mobile"
      ? { left: -295, right: 55, top: -270, bottom: 60 }
      : isMobile === "tablet"
      ? { left: -575, right: 75, top: -260, bottom: 60 }
      : { left: -600, right: 140, top: -250, bottom: 50 };

  return (
    <section className="relative flex flex-col items-center text-center p-5 pt-4 gap-4 w-full overflow-hidden bg-white rounded-3xl">
      <p className="text-sm text-muted-foreground leading-5 md:leading-11 mt-14 select-none">
        🇺🇦 Найкращі курси та відео <br className="md:hidden" /> з усього світу —
        тепер українською.
      </p>
      <h1 className="text-5xl md:text-[80px] font-medium text-muted-foreground leading-14 md:leading-[86px] tracking-[-3px] uppercase select-none">
        ДИЗАЙН АКАДЕМІЯ
      </h1>
      <p className="text-sm md:text-lg text-muted-foreground leading-7 max-w-sm mb-14 select-none">
        Ми робимо платформу, яку самі мріяли мати.
        <br className="md:hidden" />
        Для себе. І для тебе. ❤️
      </p>
      <motion.div
        animate={{
          y: [4, -5, 3, -6, 4],
          x: [2, -3, 3, -2, 2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        drag
        dragElastic={1}
        dragConstraints={dragFramer}
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
      <motion.div
        animate={{
          y: [4, -4, 3, -5, 4],
          x: [-2, 2, -3, 3, -2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        drag
        dragElastic={1}
        dragConstraints={dragRive}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1 }}
        className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 translate-x-[140px] translate-y-[-108px] md:translate-x-[232px] md:translate-y-[-148px] cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/icons/rive.png"
          alt="Rive"
          width={40}
          height={40}
          className="drop-shadow-md w-full h-full rotate-[-2deg]"
          draggable={false}
        />
      </motion.div>
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
        dragConstraints={dragFigma}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1 }}
        className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 translate-x-[-190px] translate-y-[48px] md:translate-x-[-328px] md:translate-y-[28px] cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/icons/figma.svg"
          alt="Figma"
          width={26}
          height={38}
          className="drop-shadow-lg w-full h-full rotate-[-4deg]"
          draggable={false}
        />
      </motion.div>
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
        dragConstraints={dragWebflow}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1 }}
        className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 translate-x-[128px] translate-y-[0px] tab:translate-x-[200px] md:translate-x-[354px] md:translate-y-[4px] cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/icons/webflow.svg"
          alt="Webflow"
          width={38}
          height={24}
          className="drop-shadow-xl w-full h-full rotate-[15deg]"
          draggable={false}
        />
      </motion.div>
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
        dragConstraints={dragSpline}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1 }}
        className="flex absolute left-[50%] top-[50%] w-12 h-12 md:w-16 md:h-16 justify-center items-center p-3 translate-x-[96px] translate-y-[80px] md:translate-x-[206px] md:translate-y-[64px] cursor-grab active:cursor-grabbing"
      >
        <Image
          src="/icons/spline.svg"
          alt="Spline"
          width={38}
          height={38}
          className="drop-shadow-md w-full h-full rotate-[6deg]"
          draggable={false}
        />
      </motion.div>
    </section>
  );
}
