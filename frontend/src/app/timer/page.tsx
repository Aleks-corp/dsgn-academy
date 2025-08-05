"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";
import { FAQ } from "@/constants/faq.constant";
import { isAlpha } from "@/redux/test/test.thunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectTimer } from "@/redux/selectors";
import { CountdownTimer } from "@/components/Timer";

// import Link from "next/link";

export default function TimerPage() {
  const dispatch = useAppDispatch();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  useEffect(() => {
    dispatch(isAlpha());
  }, [dispatch]);
  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };
  const timer = useAppSelector(selectTimer);

  return (
    <div className="flex flex-col items-center gap-12 w-full mx-auto">
      <section className="relative flex flex-col items-center text-center p-5 pt-4 gap-4 w-full">
        <span className="text-sm text-muted-foreground leading-11 mt-14">
          🇺🇦 Найкращі курси та відео з усього світу — тепер українською.
        </span>
        <h1 className="text-[80px] font-medium text-muted-foreground leading-[86px] tracking-[-3px] uppercase">
          ДИЗАЙН АКАДЕМІЯ
        </h1>
        <div className="text-lg text-muted-foreground leading-7 max-w-sm mb-14">
          Ми робимо платформу, яку самі мріяли мати. Для себе. І для тебе. ❤️
        </div>
        <div className="absolute left-[50%] top-[50%] flex w-16 h-16 justify-center items-center p-3 rotate-[-8deg] translate-x-[-278px] translate-y-[-132px]">
          <Image
            src="/icons/framer.svg"
            alt="Framer"
            width={25.6}
            height={38.4}
            className="drop-shadow-xl"
          />
        </div>
        <div className="absolute left-[50%] top-[50%] flex w-16 h-16 justify-center items-center p-3 rotate-[-2deg] translate-x-[232px] translate-y-[-148px]">
          <Image
            src="/icons/rive.png"
            alt="Rive"
            width={40}
            height={40}
            className="drop-shadow-md"
          />
        </div>
        <div className="absolute left-[50%] top-[50%] flex w-16 h-16 justify-center items-center p-3 rotate-[-4deg] translate-x-[-328px] translate-y-[28px]">
          <Image
            src="/icons/figma.svg"
            alt="Figma"
            width={26}
            height={38}
            className="drop-shadow-lg"
          />
        </div>
        <div className="absolute left-[50%] top-[50%] flex w-16 h-16 justify-center items-center p-3 rotate-[15deg] translate-x-[354px] translate-y-[4px]">
          <Image
            src="/icons/webflow.svg"
            alt="Webflow"
            width={38}
            height={24}
            className="drop-shadow-xl"
          />
        </div>
        <div className="absolute left-[50%] top-[50%] flex w-16 h-16 justify-center items-center p-3 rotate-[6deg] translate-x-[206px] translate-y-[64px]">
          <Image
            src="/icons/spline.svg"
            alt="Spline"
            width={38}
            height={38}
            className="drop-shadow-md"
          />
        </div>
      </section>
      <section className="flex flex-col items-center text-center py-8 gap-4 bg-accent rounded-3xl w-full">
        <p className="text-sm text-background leading-11">
          Платформа відкриється через:
        </p>
        <CountdownTimer targetTime={timer} />
        <button className="btn-telegram px-6 py-2 rounded-xl shadow-btn text-foreground text-sm font-inter font-semibold">
          Підписатись у Telegram
        </button>
        <p className="text-sm text-background leading-11">
          🎁 Подарунки для перших 100 підписників!
        </p>
      </section>
      <section className="flex flex-col items-start text-start py-8 gap-1 max-w-2xl">
        {FAQ.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#fff] rounded-xl border border-[#E2E2E2] w-full"
            >
              <button
                className="flex justify-between items-center gap-3 w-full px-4 py-2 cursor-pointer "
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
              >
                <div className="flex flex-col items-start gap-2 text-left w-full">
                  <p className="text-sm font-medium leading-6 w-full">
                    {item.question}
                  </p>
                </div>
                <ChevronUp
                  width={24}
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                id={`faq-panel-${idx}`}
                className={`overflow-hidden transition-all duration-300 px-4 py-2 ${
                  isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
                style={{
                  transitionProperty: "max-height, opacity, margin-top",
                }}
              >
                <p className="text-[13px] leading-5 tracking-[-0.13px] whitespace-pre-line mr-9 ">
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
