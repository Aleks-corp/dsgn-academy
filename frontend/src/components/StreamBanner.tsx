"use client";

import Link from "next/link";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/uk";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/selectors/auth.selectors";
import { IStream } from "@/types/stream.type";
import MaskIcon from "@/components/MaskIcon";

dayjs.extend(utc);
dayjs.extend(timezone);

function StreamBanner({
  stream,
  setIsOpen,
}: {
  stream: IStream | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const user = useAppSelector(selectUser);

  return (
    <div className="flex items-center w-full h-10 bg-banner">
      {stream && (
        <div className="flex justify-between items-center w-full text-white text-sm font-medium leading-4 tracking-thin">
          {/* ✅ 1. Створюємо "маску" - контейнер, що приховає все зайве */}
          <div className="relative flex overflow-x-hidden flex-grow">
            {/* ✅ 2. Це блок, який буде анімуватися */}
            <div className="animate-marquee whitespace-nowrap pointer-events-none">
              {/* ✅ 3. Дублюємо текст для створення безшовного ефекту */}
              <span className="mx-10">
                Онлайн-ефір {stream.title} -{" "}
                {dayjs
                  .utc(stream.startStreamAt)
                  .locale("uk")
                  .format("dddd (DD.MM), HH:mm")}{" "}
                🔒 Лише для підписників
              </span>
              <span className="mx-10">
                Онлайн-ефір {stream.title} -{" "}
                {dayjs
                  .utc(stream.startStreamAt)
                  .locale("uk")
                  .format("dddd (DD.MM), HH:mm")}{" "}
                🔒 Лише для підписників
              </span>
              <span className="mx-10">
                Онлайн-ефір {stream.title} -{" "}
                {dayjs
                  .utc(stream.startStreamAt)
                  .locale("uk")
                  .format("dddd (DD.MM), HH:mm")}{" "}
                🔒 Лише для підписників
              </span>{" "}
              <span className="mx-10">
                Онлайн-ефір {stream.title} -{" "}
                {dayjs
                  .utc(stream.startStreamAt)
                  .locale("uk")
                  .format("dddd (DD.MM), HH:mm")}{" "}
                🔒 Лише для підписників
              </span>
            </div>
          </div>
          <div className="flex gap-4 lg:gap-6 font-inter mx-4 lg:mx-6">
            <Link
              href={
                user?.subscription === "free" || !user
                  ? "/check-subscription"
                  : "/stream"
              }
              className="px-2 py-1 whitespace-nowrap rounded-lg border-[1px] border-white hover:border-muted-background hover:text-muted-background transition-colors"
            >
              Долучитись до ефіру →
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer"
            >
              <MaskIcon src="/icons/nav-icons/xmark.svg" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StreamBanner;
