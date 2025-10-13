import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { fetchStreamData } from "@/lib/api/getStreamData";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/selectors/auth.selectors";
import { IStream } from "@/types/stream.type";
import dayjs from "dayjs";
import "dayjs/locale/uk";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function StreamBanner({ setIsOpen }: { setIsOpen: () => void }) {
  const user = useAppSelector(selectUser);
  const [stream, setStream] = useState<IStream | null>(null);
  const handlefetchStreamData = async () => {
    try {
      const res: { data: IStream; status: number } = await fetchStreamData();
      if (res.status === 200) {
        setStream(res.data);
      }
    } catch (error) {
      console.info(error);
    }
  };

  useEffect(() => {
    handlefetchStreamData();
  }, []);
  //   const [isOpen, setIsOpen] = useState<boolean>(false);
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
              onClick={setIsOpen}
              className="cursor-pointer"
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StreamBanner;
