"use client";

import { useEffect } from "react";
import Image from "next/image";
// import { Youtube, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { isAlpha } from "@/redux/test/test.thunk";
import { selectIsAlpha, selectIsLoadingTest } from "@/selectors/test.selectors";
import { redirect } from "next/navigation";
import { selectCourses } from "@/selectors/courses.selector";
import { selectVideos } from "@/selectors/videos.selectors";
import { fetchCourses } from "@/redux/courses/course.thunk";
import { fetchVideos } from "@/redux/videos/video.thunk";

interface Course {
  _id: string;
  title: string;
  description: string;
  preview?: string;
  videoCount?: number;
}

interface Video {
  _id: string;
  title: string;
  preview: string;
  duration?: string;
  category?: string;
}

export default function HomePage() {
  const dispatch = useAppDispatch();

  const isAlphaTesting = useAppSelector(selectIsAlpha);
  const isLoading = useAppSelector(selectIsLoadingTest);

  const courses = useAppSelector(selectCourses);
  const videos = useAppSelector(selectVideos);

  useEffect(() => {
    dispatch(isAlpha());
    dispatch(fetchCourses({}));
    dispatch(fetchVideos({}));
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading</p>;
  }
  if (isAlphaTesting) {
    redirect("/timer");
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      {/* Головний блок */}
      <section className="flex flex-col items-center text-center p-5 pt-3 gap-4 mt-14">
        <span className="text-sm text-muted-foreground leading-11">
          🇺🇦 Платформа для тих, хто хоче стати сильнішим дизайнером
        </span>
        <h1 className="text-[80px] font-medium text-muted-foreground leading-[86px] tracking-[-3px] uppercase">
          ДИЗАЙН АКАДЕМІЯ
        </h1>
        <div className="text-lg text-muted-foreground leading-7 max-w-xl mb-16">
          Збираємо найкращі відео для дизайнерів, перекладаємо українською, та
          зручно оформляємо.
        </div>
      </section>
      <section className="flex flex-col items-center text-center py-8 gap-4">
        <div className="flex gap-2 flex-wrap justify-center mt-4">
          <button className="px-4 py-2 bg-[#F3F4F6] rounded-full text-sm font-medium">
            Всі відео
          </button>
          <button className="px-4 py-2 bg-[#F3F4F6] rounded-full text-sm">
            Figma Config
          </button>
          <button className="px-4 py-2 bg-[#F3F4F6] rounded-full text-sm">
            Дизайн-системи
          </button>
          <button className="px-4 py-2 bg-[#F3F4F6] rounded-full text-sm">
            Мобільні інтерфейси
          </button>
          {/* ...інші фільтри */}
        </div>
      </section>

      {/* Курси */}
      <section>
        <h2 className="text-xl font-bold mb-4">Курси</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {courses && courses.length === 0 ? (
            <div className="col-span-3 text-center text-gray-400">
              Курси ще не додані
            </div>
          ) : (
            courses.map((course) => (
              <Link key={course._id} href={`/courses/${course._id}`}>
                <div className="rounded-xl shadow-sm border bg-white hover:shadow-lg transition group overflow-hidden flex flex-col">
                  {course.videos[0].cover && (
                    <Image
                      src={course.videos[0].cover}
                      alt={course.title}
                      width={400}
                      height={180}
                      className="w-full h-[180px] object-cover"
                    />
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-bold text-lg mb-2">{course.title}</div>
                    <div className="text-sm text-gray-500 flex-1">
                      {course.description}
                    </div>

                    <div className="mt-2 text-xs text-right text-gray-400">
                      {course.videos.length} уроків
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Останні відео */}
      <section>
        <h2 className="text-xl font-bold mb-4">Останні відео</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {videos.length === 0 ? (
            <div className="col-span-3 text-center text-gray-400">
              Відео ще не додані
            </div>
          ) : (
            videos.map((video) => (
              <Link key={video._id} href={`/videos/${video._id}`}>
                <div className="rounded-xl shadow-sm border bg-white hover:shadow-lg transition group overflow-hidden flex flex-col">
                  <Image
                    src={video.cover}
                    alt={video.title}
                    width={400}
                    height={180}
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-bold text-lg mb-2">{video.title}</div>
                    {video.category && (
                      <div className="text-xs text-[#8E8E9B] mb-1">
                        {video.category}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
