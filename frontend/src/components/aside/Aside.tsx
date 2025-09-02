"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import {
  selectTotalFree,
  selectTotalVideos,
  selectVideoCategories,
} from "@/selectors/videos.selectors";
import { selectTotalCourses } from "@/selectors/courses.selector";
import { selectTotalShorts } from "@/selectors/shorts.selector";
import NavLinkIcon from "@/components/links/LinkWithIcon";
import { categoriesConstant } from "@/constants/categories.constant";
import { useEffect } from "react";
import { fetchVideosCount } from "@/redux/videos/video.thunk";
import { fetchCoursesCount } from "@/redux/courses/course.thunk";
import Link from "next/link";
import { selectSubscription } from "@/redux/selectors/auth.selectors";
import { fetchShortsCount } from "@/redux/shorts/shorts.thunk";

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
      // всі відео → пусто
      dispatch(fetchVideosCount(""));
      return;
    }
    if (options.free) {
      // безкоштовні
      dispatch(fetchVideosCount("free"));
      return;
    }
    if (options.category) {
      // конкретна категорія
      dispatch(fetchVideosCount(options.category));
      return;
    }
  };
  const videosCount = useAppSelector(selectTotalVideos);
  const coursesCount = useAppSelector(selectTotalCourses);
  const shortsCount = useAppSelector(selectTotalShorts);
  const freeCount = useAppSelector(selectTotalFree);
  const categories = useAppSelector(selectVideoCategories);
  const fullCategories = categoriesConstant.concat(
    categories.map((c) => c.category)
  );
  const filteredCategories = fullCategories.filter(
    (c, i) => fullCategories.indexOf(c) === i
  );
  return (
    <aside className="flex flex-col items-center gap-3 w-full p-5 h-[calc(100%-80px)] transition-all">
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
                <Image
                  src="/icons/menu-icons/grid.svg"
                  alt="Grid"
                  width={20}
                  height={20}
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
                <Image
                  src="/icons/menu-icons/layer.svg"
                  alt="Grid"
                  width={20}
                  height={20}
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
                <Image
                  src="/icons/menu-icons/settings.svg"
                  alt="Grid"
                  width={20}
                  height={20}
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
            selectedPage === "shorts" ? "bg-muted-background border-border" : ""
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
                <Image
                  src="/icons/menu-icons/zap.svg"
                  alt="Grid"
                  width={20}
                  height={20}
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
        {filteredCategories.map((c, i) => (
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
                  <Image
                    src={`/icons/${c}.svg`}
                    alt={c.charAt(0).toUpperCase() + c.slice(1)}
                    width={40}
                    height={40}
                    className="object-contain w-auto h-5"
                  />
                </div>
              }
              count={categories.find((i) => i.category === c)?.count}
            />
          </button>
        ))}
      </div>
      <Link
        href="/command"
        className="md:hidden flex whitespace-nowrap items-center text-[#727272] font-inter font-medium text-[13px] leading-5 tracking-thin hover:text-foreground transition-colors duration-300 mr-4"
        passHref
      >
        Про платформу
      </Link>
    </aside>
  );
}
