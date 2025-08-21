"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import {
  selectIsAlpha,
  selectIsLoadingTest,
  selectIsTester,
} from "@/selectors/test.selectors";
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

type Props = {
  selectedPage: string;
  setSelectedPage: (selectedPage: string) => void;
};

export default function Aside({ selectedPage, setSelectedPage }: Props) {
  const dispatch = useAppDispatch();
  const isAlphaTesting = useAppSelector(selectIsAlpha);
  const isTester = useAppSelector(selectIsTester);
  const isLoading = useAppSelector(selectIsLoadingTest);

  useEffect(() => {
    dispatch(fetchVideosCount());
    dispatch(fetchCoursesCount());
    // dispatch(fetchShortsCount());
  }, [dispatch]);

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

  if (isLoading) {
    return null;
  }

  return isAlphaTesting && !isTester ? null : (
    <aside className="flex flex-col items-center gap-3 w-full py-5 border-r border-border h-[calc(100%-80px)] transition-all">
      <div className="flex flex-col w-full items-center gap-0.5">
        <button
          type="button"
          name="all-videos"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "all-videos"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Всі відео"
            rout="/videos"
            icon={
              <div className="flex items-center justify-center w-8 h-8 p-1.5 bg-icon shadow-icon rounded-lg">
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
              <div className="flex items-center justify-center w-8 h-8 p-1.5 bg-icon shadow-icon rounded-lg">
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
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Без оплати"
            rout="/videos?free"
            icon={
              <div className="flex items-center justify-center w-8 h-8 p-1.5 bg-icon shadow-icon rounded-lg">
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
              <div className="flex items-center justify-center w-8 h-8 p-1.5 bg-icon shadow-icon rounded-lg">
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
        <p>Категорії</p>

        {filteredCategories.map((c, i) => (
          <button
            key={i}
            type="button"
            name={c}
            className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
              selectedPage === c ? "bg-muted-background border-border" : ""
            } `}
            onClick={(e) => {
              setSelectedPage(e.currentTarget.name);
            }}
          >
            <NavLinkIcon
              text={c.charAt(0).toUpperCase() + c.slice(1)}
              rout={`/videos?category=${c}`}
              icon={
                <div className="flex justify-center items-center w-8 h-8 p-1.5">
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
    </aside>
  );
}
