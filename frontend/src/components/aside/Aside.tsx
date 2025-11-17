"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectTotalFree,
  selectTotalVideos,
  selectVideoCategories,
} from "@/selectors/videos.selectors";
import { selectSubscription } from "@/selectors/auth.selectors";
import { selectTotalCourses } from "@/selectors/courses.selector";
import { selectTotalShorts } from "@/selectors/shorts.selector";
import { fetchVideosCount } from "@/redux/videos/video.thunk";
import { fetchCoursesCount } from "@/redux/courses/course.thunk";
import { fetchShortsCount } from "@/redux/shorts/shorts.thunk";
import { asideCategoriesConstant } from "@/constants/categories.constant";
import NavLinkIcon from "@/components/links/LinkWithIcon";
import MaskIcon from "@/components/MaskIcon";

type Props = {
  selectedPage: string;
  setSelectedPage: (selectedPage: string) => void;
};

export default function Aside({ selectedPage, setSelectedPage }: Props) {
  const dispatch = useAppDispatch();
  const sub = useAppSelector(selectSubscription);

  useEffect(() => {
    dispatch(fetchVideosCount());
    dispatch(fetchCoursesCount());
    dispatch(fetchShortsCount());
  }, [dispatch]);

  const handleFetch = (options: {
    all?: boolean;
    free?: boolean;
    category?: string;
  }) => {
    if (options.all) {
      dispatch(fetchVideosCount(""));
      return;
    }
    if (options.free) {
      dispatch(fetchVideosCount("free"));
      return;
    }
    if (options.category) {
      dispatch(fetchVideosCount(options.category));
      return;
    }
  };
  const videosCount = useAppSelector(selectTotalVideos);
  const coursesCount = useAppSelector(selectTotalCourses);
  const shortsCount = useAppSelector(selectTotalShorts);
  const freeCount = useAppSelector(selectTotalFree);
  const categories = useAppSelector(selectVideoCategories);

  return (
    <aside className="flex flex-col items-center justify-between gap-3 w-full p-5 h-[calc(100dvh-120px)] transition-all">
      <div className="flex flex-col gap-3 w-full items-center">
        <div className="md:hidden flex w-full ">
          {(sub === "free" || !sub) && (
            <Link
              className={`
           w-full bg-accent text-text-white hover:bg-accent-hover transition-colors duration-300            
          flex font-inter font-semibold text-sm leading-5 tracking-thin whitespace-nowrap justify-center
          items-center gap-1 py-2 px-6 rounded-xl shadow-btn `}
              href={"/check-subscription"}
            >
              <p>Преміум доступ</p>
            </Link>
          )}
        </div>
        <div className="flex flex-col w-full items-center gap-0.5">
          <button
            type="button"
            name="all-videos"
            className={`w-full cursor-pointer rounded-xl border-1 border-background hover:bg-muted-background hover:border-border ${
              selectedPage === "all-videos"
                ? "bg-muted-background border-border"
                : ""
            } `}
            onClick={() => {
              setSelectedPage("all-videos");
              handleFetch({ all: true });
            }}
          >
            <NavLinkIcon
              text="Всі відео"
              rout="/videos"
              icon={
                <div
                  className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                    selectedPage === "all-videos" ? "bg-icon shadow-icon" : ""
                  }`}
                >
                  <MaskIcon
                    src="/icons/menu-icons/grid.svg"
                    className={`w-5 h-5 ${
                      selectedPage === "all-videos"
                        ? "text-foreground"
                        : "text-muted"
                    }`}
                  />
                </div>
              }
              count={videosCount}
            />
          </button>
          <button
            type="button"
            name="courses"
            className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
              selectedPage === "courses"
                ? "bg-muted-background border-border"
                : ""
            } `}
            onClick={(e) => {
              setSelectedPage(e.currentTarget.name);
            }}
          >
            <NavLinkIcon
              text="Курси"
              rout="/courses"
              icon={
                <div
                  className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                    selectedPage === "courses" ? "bg-icon shadow-icon" : ""
                  }`}
                >
                  <MaskIcon
                    src="/icons/menu-icons/layer.svg"
                    className={`w-5 h-5 ${
                      selectedPage === "courses"
                        ? "text-foreground"
                        : "text-muted"
                    }`}
                  />
                </div>
              }
              count={coursesCount}
            />
          </button>
          <button
            type="button"
            name="free-videos"
            className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
              selectedPage === "free-videos"
                ? "bg-muted-background border-border"
                : ""
            } `}
            onClick={() => {
              setSelectedPage("free-videos");
              handleFetch({ free: true });
            }}
          >
            <NavLinkIcon
              text="Без оплати"
              rout="/videos?free"
              icon={
                <div
                  className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                    selectedPage === "free-videos" ? "bg-icon shadow-icon" : ""
                  }`}
                >
                  <MaskIcon
                    src="/icons/menu-icons/settings.svg"
                    className={`w-5 h-5 ${
                      selectedPage === "free-videos"
                        ? "text-foreground"
                        : "text-muted"
                    }`}
                  />
                </div>
              }
              count={freeCount}
            />
          </button>
          <button
            type="button"
            name="shorts"
            className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
              selectedPage === "shorts"
                ? "bg-muted-background border-border"
                : ""
            } `}
            onClick={(e) => {
              setSelectedPage(e.currentTarget.name);
            }}
          >
            <NavLinkIcon
              text="Короткі відео"
              rout="/shorts"
              icon={
                <div
                  className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                    selectedPage === "shorts" ? "bg-icon shadow-icon" : ""
                  }`}
                >
                  <MaskIcon
                    src="/icons/menu-icons/zap.svg"
                    className={`w-5 h-5 ${
                      selectedPage === "shorts"
                        ? "text-foreground"
                        : "text-muted"
                    }`}
                  />
                </div>
              }
              count={shortsCount}
            />
          </button>
        </div>
        <div className="flex flex-col w-full">
          <p className="p-2.5 font-inter font-medium text-xs text-muted leading-4 tracking-thin">
            Категорії
          </p>
          {asideCategoriesConstant.map((c, i) => (
            <button
              key={i}
              type="button"
              name={c}
              className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
                selectedPage === c ? "bg-muted-background border-border" : ""
              } `}
              onClick={() => {
                setSelectedPage(c);
                handleFetch({ category: c });
              }}
            >
              <NavLinkIcon
                text={c.charAt(0).toUpperCase() + c.slice(1)}
                rout={`/videos?category=${c}`}
                icon={
                  <div
                    className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                      selectedPage === c ? "bg-icon shadow-icon" : ""
                    }`}
                  >
                    <div className="relative w-5 h-5">
                      <Image
                        src={`/icons/${c}.svg`}
                        alt={c.charAt(0).toUpperCase() + c.slice(1)}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                }
                count={categories.find((i) => i.category === c)?.count}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full items-center">
        {sub !== "free" && sub && (
          <div className="w-full">
            {/* Телеграм-банер */}
            <div className=" border border-[#e5f3fa] rounded-2xl flex flex-col items-center p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm leading-5 text-center">
                  Закрите Telegram-ком&apos;юніті
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-4 text-center mb-4">
                Приєднуйся до нас — обговорюй відео, отримуй новини та допомогу
                в чаті!
              </p>
              <a
                href="https://t.me/+oLFd94sPH3UyNGRi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-black w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-white font-medium text-xs rounded-lg"
              >
                Приєднатися
                <MaskIcon
                  src="/icons/social-icons/telegram.svg"
                  className="w-5 h-5 text-white"
                />
              </a>
            </div>
          </div>
        )}
        <Link
          href="/command"
          className="md:hidden flex whitespace-nowrap items-center text-[#727272] font-inter font-medium text-[13px] leading-5 tracking-thin hover:text-foreground transition-colors duration-300 mr-4"
          passHref
        >
          Про платформу
        </Link>
      </div>
    </aside>
  );
}
