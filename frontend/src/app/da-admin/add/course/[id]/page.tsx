"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { X, Pencil, RefreshCcw, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { editCourse, fetchCourseById } from "@/redux/courses/course.thunk";
import { clearCourse } from "@/redux/courses/courseSlice";
import { selectIsLoadingCourses } from "@/selectors/courses.selector";
import { fetchVideoData } from "@/lib/api/getVideoData";
import { AddCourse, ICourse, ICourseVideo } from "@/types/courses.type";
import { categoriesConstant } from "@/constants/categories.constant";

import { withAdminGuard } from "@/guards/WithAdminGuard";
import SwitchSelector from "@/components/form&inputs/SwitchSelector";
import Input from "@/components/form&inputs/Input";
import Button from "@/components/buttons/Button";
import Loader from "@/components/loaders/Loader";
import VidstackPlayer from "@/components/VideoVidstack";

export interface IData {
  name: string;
  description?: string;
  duration: number;
  pictures: { base_link: string; sizes: { width: string; link: string }[] };
  release_time: string;
}

function AddCourseVideoForm() {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const isLoading = useAppSelector(selectIsLoadingCourses);
  const [videoInput, setVideoInput] = useState("");
  const [courseVideos, setCourseVideos] = useState<ICourseVideo[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishedAt, setPublishedAt] = useState("");

  const [isEditingTitle, setIsEditingTitle] = useState(true);
  const [isEditingDescription, setIsEditingDescription] = useState(true);
  const [isEditingSelectedTitle, setIsEditingSelectedTitle] = useState(false);
  const [isEditingSelectedDescription, setIsEditingSelectedDescription] =
    useState(false);

  const [categoryState, setCategoryState] = useState<
    { [key: string]: boolean }[]
  >(categoriesConstant.map((c) => ({ [c]: false })));

  useEffect(() => {
    dispatch(fetchCourseById(id as string)).then((res) => {
      if (res?.payload) {
        const course = res.payload as ICourse;
        setCourseVideos(
          course.videos.map(
            ({ title, url, originalUrl, description, cover, duration }) => ({
              title,
              url,
              originalUrl,
              description,
              cover,
              duration,
            })
          )
        );
        setTitle(course.title);
        setDescription(course.description);
        setPublishedAt(res.payload.publishedAt);
        setCategoryState(
          categoriesConstant.map((c) => ({
            [c]: course.category.includes(c),
          }))
        );
      }
      setSelectedCourse(0);
    });

    return () => {
      dispatch(clearCourse());
    };
  }, [dispatch, id]);

  const handleAddVideo = async () => {
    if (!videoInput.trim()) return;
    const vimeoId = videoInput.replace("https://vimeo.com/", "");
    if (!vimeoId) {
      toast.error("Додайте правльну лінку для відео з курсу");
      return;
    }
    try {
      const res: IData = await fetchVideoData(vimeoId);

      const cover = res.pictures?.sizes?.find(
        (s) => parseInt(s.width) >= 768
      )?.link;

      const newVideo: ICourseVideo = {
        title: res.name,
        description: res.description || "",
        duration: res.duration.toString(),
        cover: cover || res.pictures?.base_link || "",
        url: videoInput,
        originalUrl: "",
      };
      if (courseVideos.length === 0) {
        setSelectedCourse(0);
        setPublishedAt(res.release_time);
      }
      setCourseVideos((prev) => [...prev, newVideo]);

      setVideoInput("");
    } catch (error) {
      console.info("🚀 ~ error:", error);
      toast.error("Помилка при завантаженні даних з Vimeo");
    }
  };

  const handleRemoveVideo = (url: string) => {
    if (
      courseVideos.length === 2 &&
      courseVideos[0].url === courseVideos[1].url
    ) {
      setSelectedCourse(null);
    } else if (courseVideos.length > 1 && selectedCourse !== null) {
      setSelectedCourse(0);
    } else {
      setSelectedCourse(null);
    }
    setCourseVideos((prev) => prev.filter((v) => v.url !== url));
  };

  const reset = () => {
    setVideoInput("");
    setCourseVideos([]);
    setSelectedCourse(null);
    setTitle("");
    setDescription("");
    setPublishedAt("");
    setIsEditingTitle(true);
    setIsEditingDescription(true);
    setIsEditingSelectedTitle(false);
    setIsEditingSelectedDescription(false);
    setCategoryState(categoriesConstant.map((c) => ({ [c]: false })));
  };

  const handleSubmit = async () => {
    const req: AddCourse = {
      title,
      description,
      category: categoryState
        .map((obj) => {
          const key = Object.keys(obj)[0];
          const value = Object.values(obj)[0];
          return value === true ? key : undefined;
        })
        .filter((key) => key !== undefined),
      videos: courseVideos,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    };
    if (!title.trim()) {
      toast.error("Заповніть назву курсу");
      return;
    }

    if (!description.trim()) {
      toast.error("Заповніть опис курсу");
      return;
    }

    const selectedCategories = categoryState
      .filter((c) => Object.values(c)[0])
      .map((c) => Object.keys(c)[0]);

    if (selectedCategories.length === 0) {
      toast.error("Оберіть хоча б одну категорію");
      return;
    }

    if (courseVideos.length === 0) {
      toast.error("Додайте принаймні одне відео");
      return;
    }
    const isVideoValid = (v: ICourseVideo) => {
      return Boolean(
        v.title?.trim() &&
          v.description?.trim() &&
          v.cover?.trim() &&
          v.duration?.trim() &&
          v.originalUrl?.trim()
      );
    };

    const invalidVideo = courseVideos.find((v) => !isVideoValid(v));
    if (invalidVideo) {
      toast.error(
        "Усі відео повинні містити назву, опис, обкладинку і тривалість"
      );
      return;
    }
    try {
      const res = await dispatch(
        editCourse({ course: req, courseId: id as string })
      );
      console.log("🚀 ~ res:", res);

      if (res?.type === "courses/editCourse/rejected") {
        toast.error(
          `Сталась помилка при завантаженні, спробуйте ще раз ${res.payload}`,
          {
            duration: 5000,
          }
        );
        return;
      }

      reset();
      toast.success("Курс відредаговано", { duration: 5000 });
    } catch (err) {
      if (err instanceof Error) {
        // setError(err.message || "Помилка помилка завантаження. Спробуйте ще раз.");
      } else {
        // setError("Невідома помилка. Спробуйте ще раз.");
      }
      console.info("Registration failed", err);
    }
  };

  const updateCourseVideo = (index: number, changes: Partial<ICourseVideo>) => {
    setCourseVideos((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...changes };
      return updated;
    });
  };

  return (
    <div className="flex w-full p-5">
      <div className="px-6 flex-1/2">
        <div className="flex gap-3 mb-6">
          <div className="w-3 h-6 rounded-sm bg-[#874FFF]" />
          <h2 className="text-xl font-medium leading-7 tracking-thinest text-foreground">
            Додати курс
          </h2>
        </div>
        <div className="flex items-end justify-between gap-4 mb-3">
          <label className="text-xs font-medium leading-4 tracking-thin text-foreground">
            Посилання на відео
            <Input
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="https://vimeo.com/111000111000"
              className="font-inter text-xs font-medium leading-4 tracking-thin text-muted mt-2"
              required
            />
          </label>
          <Button
            text="Витягнути з Vimeo"
            type="button"
            className="w-fit h-10"
            icon={
              <Image src="/icons/vimeo.svg" width={16} height={16} alt="Logo" />
            }
            onClick={handleAddVideo}
          />
        </div>
        <div className="mb-6">
          {courseVideos.length > 0 && (
            <ol className="flex flex-col gap-2" type="1">
              {courseVideos.map((v, idx) => (
                <li key={v.url + idx} className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">{idx + 1}.</p>
                  <p className="text-sm text-muted-foreground">{v.url}</p>
                  <button
                    onClick={() => handleRemoveVideo(v.url)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="mb-3">
          <div className="flex justify-between w-full mb-2">
            <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
              Заголовок Курсу
            </label>
            {isEditingTitle ? (
              <button
                onClick={() => setIsEditingTitle(false)}
                className="cursor-pointer"
              >
                <Eye size={18} />
              </button>
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="cursor-pointer"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
          {isEditingTitle ? (
            <div className="flex gap-2 items-center rounded-xl">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введіть назву курсу"
                className="font-inter text-xs font-medium leading-4 tracking-thin text-muted w-full"
                required
              />
            </div>
          ) : (
            <div className="flex gap-2 items-center w-full rounded-xl px-5 py-3">
              <div className="w-full min-h-4">{title}</div>
            </div>
          )}
        </div>
        <div className="mb-3">
          <div className="flex justify-between w-full mb-2">
            <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
              Опис Курсу
            </label>
            {isEditingDescription ? (
              <button
                onClick={() => setIsEditingDescription(false)}
                className="cursor-pointer"
              >
                <Eye size={18} />
              </button>
            ) : (
              <button
                onClick={() => setIsEditingDescription(true)}
                className="cursor-pointer"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
          {isEditingDescription ? (
            <div className="flex gap-2 items-center rounded-xl">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введіть Опис"
                className="min-h-60 border-0 px-3 py-2 w-full rounded-xl shadow-input focus:shadow-input-hover focus:outline-0 font-inter text-xs font-medium leading-4 tracking-thin text-muted"
                required
              />
            </div>
          ) : (
            <div className="flex gap-2 items-center w-full rounded-xl px-5 py-3">
              <div className="w-full min-h-10">
                <p className=" whitespace-pre-line">{description}</p>
              </div>
            </div>
          )}
        </div>
        <SwitchSelector
          title="Категорії"
          items={categoryState}
          setItems={setCategoryState}
          constants={categoriesConstant}
          // containerClass=""
          // optionClass=""
        />
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium leading-4 tracking-thin text-foreground">
            Дата публікації
          </p>
          <Datetime
            inputProps={{
              placeholder: `дата публікації`,
              className:
                "min-w-64 font-inter text-xs font-medium leading-4 tracking-thin border-0 px-5 py-3 rounded-xl bg-icon shadow-input focus:shadow-input-hover focus:outline-0",
              required: true,
              value: publishedAt ? publishedAt : "",
            }}
            onChange={(e) => setPublishedAt(e.toString())}
            value={publishedAt !== "" ? new Date(publishedAt) : ""}
          />
        </div>
      </div>
      <div className="px-6 flex-1/2">
        <div className="flex justify-end mb-6">
          <Button
            text={!isLoading ? "Очистити" : ""}
            icon={isLoading ? <Loader /> : <RefreshCcw size={20} />}
            type="submit"
            onClick={reset}
          />
          <Button
            text={!isLoading ? "Зберегти" : ""}
            icon={isLoading && <Loader />}
            type="submit"
            className="ml-5"
            style="accent"
            onClick={handleSubmit}
            disabled={courseVideos.length === 0}
          />
        </div>

        <div className="flex gap-6 mb-6">
          <div className="flex-1/2 bg-muted-background rounded-2xl overflow-hidden">
            {selectedCourse !== null ? (
              <div className="relative max-w-xl aspect-video">
                <VidstackPlayer
                  title={courseVideos[selectedCourse].title}
                  cover={courseVideos[selectedCourse].cover}
                  video={courseVideos[selectedCourse].url as string}
                />
              </div>
            ) : (
              <Image
                src="/images/placeholder.png"
                alt="cover"
                width={576}
                height={324}
                className="w-full h-auto"
              />
            )}
          </div>
          <div className="flex-1/2">
            <p className="text-xs font-medium leading-4 tracking-thin text-foreground mb-2">
              Плейлист
            </p>
            <ul className=" text-sm w-full bg-white">
              {courseVideos.map((v, idx) => (
                <button
                  key={v.url + idx}
                  type="button"
                  onClick={() => setSelectedCourse(idx)}
                  className={`w-full min-h-10 p-2 cursor-pointer hover:bg-muted-text ${
                    selectedCourse === idx ? "bg-muted-background " : "bg-white"
                  }`}
                >
                  <li key={v.url} className="w-full">
                    <div className="flex gap-2 w-full items-center font-inter">
                      <p className="">{idx + 1}.</p>
                      <Image src={v.cover} width={40} height={20} alt="cover" />
                      <p className="text-xs font-medium leading-4 tracking-thin text-foreground w-full text-start line-clamp-1 font-inter">
                        {v.title}
                      </p>
                    </div>
                  </li>
                </button>
              ))}
            </ul>
          </div>
        </div>
        {selectedCourse !== null && (
          <>
            <div className="flex gap-4 mb-3 w-full">
              <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
                Посилання на оригінал
                <Input
                  value={courseVideos[selectedCourse].originalUrl}
                  onChange={(e) =>
                    updateCourseVideo(selectedCourse, {
                      originalUrl: e.target.value,
                    })
                  }
                  placeholder="https://youtube.com/000000000000"
                  className="font-inter text-xs font-medium leading-4 tracking-thin text-muted w-full mt-2"
                  required
                />
              </label>
            </div>
            <div className="mb-3">
              <div className="flex justify-between w-full mb-2">
                <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
                  Заголовок Відео
                </label>
                {isEditingSelectedTitle ? (
                  <button
                    onClick={() => setIsEditingSelectedTitle(false)}
                    className="cursor-pointer"
                  >
                    <Eye size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingSelectedTitle(true)}
                    className="cursor-pointer"
                  >
                    <Pencil size={18} />
                  </button>
                )}
              </div>
              {isEditingSelectedTitle ? (
                <div className="flex gap-2 items-center rounded-xl">
                  <Input
                    value={courseVideos[selectedCourse].title}
                    onChange={(e) =>
                      updateCourseVideo(selectedCourse, {
                        title: e.target.value,
                      })
                    }
                    placeholder="Введіть назву курсу"
                    className="font-inter text-xs font-medium leading-4 tracking-thin text-muted w-full"
                    required
                  />
                </div>
              ) : (
                <div className="flex gap-2 items-center w-full rounded-xl px-5 py-3">
                  <div className="w-full min-h-4">
                    {courseVideos[selectedCourse].title}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-3">
              <div className="flex justify-between w-full mb-2">
                <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
                  Опис Відео
                </label>
                {isEditingSelectedDescription ? (
                  <button
                    onClick={() => setIsEditingSelectedDescription(false)}
                    className="cursor-pointer"
                  >
                    <Eye size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingSelectedDescription(true)}
                    className="cursor-pointer"
                  >
                    <Pencil size={18} />
                  </button>
                )}
              </div>
              {isEditingSelectedDescription ? (
                <div className="flex gap-2 items-center rounded-xl">
                  <textarea
                    value={courseVideos[selectedCourse].description}
                    onChange={(e) =>
                      updateCourseVideo(selectedCourse, {
                        description: e.target.value,
                      })
                    }
                    placeholder="Введіть Опис"
                    className="min-h-60 border-0 px-3 py-2 w-full rounded-xl shadow-input focus:shadow-input-hover focus:outline-0 font-inter text-xs font-medium leading-4 tracking-thin text-muted"
                    required
                  />
                </div>
              ) : (
                <div className="flex gap-2 items-center w-full rounded-xl px-5 py-3">
                  <div className="w-full min-h-10">
                    <p className=" whitespace-pre-line">
                      {courseVideos[selectedCourse].description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default withAdminGuard(AddCourseVideoForm);
