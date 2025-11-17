"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/uk";
import handlefetchStreamData from "@/lib/stream.utils";
import { IStream } from "@/types/stream.type";

dayjs.extend(utc);
dayjs.extend(timezone);

export function useStreamData() {
  const [stream, setStream] = useState<IStream | null>(null);
  const [isOpenBanner, setIsOpenBanner] = useState(false);

  useEffect(() => {
    if (!stream) {
      return;
    }
    const streamStartTimeInKyiv = dayjs.tz(stream.startStreamAt, "Europe/Kiev");
    const bannerCloseTime = streamStartTimeInKyiv.add(24, "hour");
    const nowInKyiv = dayjs().tz("Europe/Kyiv");
    if (nowInKyiv.isBefore(bannerCloseTime)) {
      setIsOpenBanner(true);
    }
    if (nowInKyiv.isAfter(bannerCloseTime)) {
      setIsOpenBanner(false);
    }
  }, [isOpenBanner, stream]);

  useEffect(() => {
    handlefetchStreamData(setStream);
  }, []);

  return { stream, isOpenBanner, setIsOpenBanner };
}
