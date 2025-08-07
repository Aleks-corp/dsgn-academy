"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { FAQ } from "@/constants/faq.constant";
import AOS from "aos";
import "aos/dist/aos.css";

export default function FaqSection() {
  AOS.init();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      className="flex flex-col items-start text-start py-8 gap-1 max-w-2xl mb-9"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
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
                  isOpen ? "rotate-0" : "rotate-180"
                }`}
              />
            </button>
            <div
              id={`faq-panel-${idx}`}
              className={`overflow-hidden transition-all duration-500 px-4 ${
                isOpen
                  ? "max-h-48 blur-0 opacity-100 mt-2"
                  : "max-h-0 blur-sm opacity-0"
              }`}
              style={{
                transitionProperty: "max-height, opacity, filter, margin-top",
              }}
            >
              <p className="text-[13px] leading-5 tracking-[-0.13px] whitespace-pre-line mr-9 py-2 ">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
