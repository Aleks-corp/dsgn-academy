"use client";

import { Fragment, useState } from "react";
import { FAQ } from "@/constants/faq.constant";
import MaskIcon from "@/components/MaskIcon";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const renderWayForPayLink = (text: string) => {
    return text.split("WayForPay").map((chunk, idx, arr) =>
      idx < arr.length - 1 ? (
        <Fragment key={idx}>
          {chunk}
          <a
            href="https://wayforpay.com/uk/account/site/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            WayForPay
          </a>
        </Fragment>
      ) : (
        chunk
      )
    );
  };

  return (
    <section className="w-full ">
      <ul className="flex flex-col items-start text-start py-8 gap-1 mx-auto max-w-2xl mb-9">
        {FAQ.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <li
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
                <MaskIcon
                  src="/icons/nav-icons/chevron-up.svg"
                  className={`w-6 h-6 transition-transform duration-300 ${
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
                  {renderWayForPayLink(item.answer)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
