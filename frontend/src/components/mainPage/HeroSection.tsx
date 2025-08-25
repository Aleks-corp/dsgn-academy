"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center text-center pb-16 pt-10 gap-4"
    >
      <span className="text-xs text-muted-foreground leading-5 md:leading-11 select-none">
        🇺🇦 Платформа для тих, хто хоче стати сильнішим дизайнером
      </span>
      <h1 className="text-5xl md:text-[80px] font-medium text-muted-foreground leading-14 md:leading-[86px] tracking-thinest uppercase select-none">
        ДИЗАЙН АКАДЕМІЯ
      </h1>
      <div className="text-sm text-muted-foreground leading-5 max-w-sm md:text-lg md:leading-7 md:max-w-xl select-none">
        Збираємо найкращі відео для дизайнерів, перекладаємо українською, та
        зручно оформляємо.
      </div>
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
        dragConstraints={containerRef}
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
        dragConstraints={containerRef}
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
        dragConstraints={containerRef}
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
        dragConstraints={containerRef}
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
        dragConstraints={containerRef}
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
