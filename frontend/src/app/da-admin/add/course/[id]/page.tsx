"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Vimeo from "@u-wave/react-vimeo";
import { X, Pencil, Save } from "lucide-react";
import toast from "react-hot-toast";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { editCourse, fetchCourseById } from "@/redux/courses/course.thunk";
import { fetchVideoData } from "@/lib/api/getVideoData";
import { AddCourse, ICourseVideo } from "@/types/courses.type";
import { categoriesConstant } from "@/constants/categories.constant";

import { withAdminGuard } from "@/guards/WithAdminGuard";
import SwitchSelector from "@/components/form&inputs/SwitchSelector";
import Input from "@/components/form&inputs/Input";
import Button from "@/components/buttons/Button";
import { selectIsLoadingCourses } from "@/redux/selectors/courses.selector";
import Loader from "@/components/loaders/Loader";
import { durationStringToString } from "@/lib/duration.utils";
import { useParams } from "next/navigation";
import { clearCourse } from "@/redux/courses/courseSlice";

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
        setCourseVideos(res.payload.videos);
        setTitle(res.payload.title);
        setDescription(res.payload.description);
        setPublishedAt(res.payload.publishedAt);
        setCategoryState(
          categoriesConstant.map((c) => ({
            [c]: res.payload.category.includes(c),
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
    <div className="flex flex-col gap-5 w-full p-5">
      <h2 className="text-xl font-semibold text-foreground">Додати курс</h2>
      <div className="flex gap-8 w-full">
        <div className="flex-1/2">
          {/* Input + кнопка додати */}
          <div className="mb-4">
            <Input
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="https://vimeo.com/1110000000"
              required
            />
            <Button
              text="Додати відео до курсу"
              onClick={handleAddVideo}
              type="button"
              className="mt-2 disabled:pointer-events-none"
              disabled={!videoInput}
            />
          </div>
          {courseVideos.length > 0 && (
            <div className="flex flex-col gap-2">
              {courseVideos.map((v, idx) => (
                <div key={v.url + idx} className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">{v.url}</p>
                  <button
                    onClick={() => handleRemoveVideo(v.url)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Datetime
            inputProps={{
              placeholder: `дата публікації`,
              className:
                "my-4 min-w-56 font-inter leading-4 tracking-[-0.13px] border-0 px-6 py-4 rounded-xl bg-icon shadow-input focus:shadow-input-hover focus:outline-0 text-base font-semibold text-muted",
              required: true,
              value: publishedAt ? publishedAt : "",
            }}
            onChange={(e) => setPublishedAt(e.toString())}
            value={publishedAt !== "" ? new Date(publishedAt) : ""}
          />
          {/* Додані відео (посилання + кнопка видалення) */}
        </div>

        <div className="flex-1/2 overflow-hidden">
          {/* Title */}
          <div className="mb-4">
            <label className="text-base font-medium text-foreground mt-4">
              Назва курсу:
            </label>
            {isEditingTitle ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введіть назву курсу"
                />
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="cursor-pointer"
                >
                  <Save size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-center w-full ">
                <div className="w-full min-h-10 bg-white">{title}</div>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="cursor-pointer"
                >
                  <Pencil size={18} />
                </button>
              </div>
            )}
          </div>
          {/* Description */}
          <div className="mb-4">
            <label className="text-base font-medium text-foreground mt-4">
              Опис курсу:
            </label>
            {isEditingDescription ? (
              <div className="flex gap-2 items-start">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 min-h-40 rounded-md bg-white shadow-input"
                ></textarea>
                <button
                  onClick={() => setIsEditingDescription(false)}
                  className="cursor-pointer"
                >
                  <Save size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-start w-full">
                <div className="w-full min-h-40 bg-white">{description}</div>
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="cursor-pointer"
                >
                  <Pencil size={18} />
                </button>
              </div>
            )}
          </div>
          <div className="">
            <SwitchSelector
              title="Категорії"
              items={categoryState}
              setItems={setCategoryState}
              constants={categoriesConstant}
              containerClass="flex items-center justify-center gap-4 flex-wrap"
              // optionClass=""
              showBox={true}
            />
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground">Превʼю</h3>
      {/* Player + Playlist */}
      {selectedCourse !== null && (
        <div className="flex max-w-4xl">
          {/* Video Player */}
          <div className="relative">
            <div className="flex mt-6 gap-6">
              <div className="relative w-1/2 aspect-video">
                <Vimeo
                  video={courseVideos[selectedCourse].url}
                  responsive
                  autoplay={false}
                  width="100%"
                  height="100%"
                />
                <p className="absolute font-inter top-[20px] right-[5px] px-2 py-1 bg-muted rounded-lg">
                  {durationStringToString(
                    courseVideos[selectedCourse].duration
                  )}
                </p>
              </div>
              <div className="w-1/2">
                <h4 className="font-semibold mb-2">Плейлист</h4>
                <ul className=" text-sm w-full rounded-2xl bg-white">
                  {courseVideos.map((v, idx) => (
                    <button
                      key={v.url + idx}
                      type="button"
                      onClick={() => setSelectedCourse(idx)}
                      className={`w-full min-h-10 p-2 flex items-center cursor-pointer hover:bg-muted ${
                        selectedCourse === idx
                          ? "bg-muted-background rounded-2xl"
                          : "bg-white"
                      }`}
                    >
                      <li key={v.url} className="w-full">
                        <div className="flex gap-2 w-full">
                          <p className="">{idx + 1}.</p>
                          <Image
                            src={v.cover}
                            width={40}
                            height={20}
                            alt="cover"
                          />
                          <p className="w-full text-start line-clamp-1 font-inter">
                            {v.title}
                          </p>
                        </div>
                      </li>
                    </button>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <p>Оригінальне Відео (Youtube URL)</p>
              <Input
                value={courseVideos[selectedCourse].originalUrl || ""}
                onChange={(e) =>
                  updateCourseVideo(selectedCourse, {
                    originalUrl: e.target.value,
                  })
                }
                placeholder="https://youtube.com/1110000000"
              />
            </div>
            {isEditingSelectedTitle ? (
              <div className="flex gap-2 items-center mt-10">
                <Input
                  value={courseVideos[selectedCourse].title}
                  onChange={(e) =>
                    updateCourseVideo(selectedCourse, { title: e.target.value })
                  }
                  placeholder="Введіть назву курсу"
                />
                <button onClick={() => setIsEditingSelectedTitle(false)}>
                  <Save size={18} />
                </button>
              </div>
            ) : (
              <div className="w-full  flex gap-2 items-center mt-10">
                <div className="w-full min-h-10 bg-white">
                  {courseVideos[selectedCourse].title}
                </div>
                <button onClick={() => setIsEditingSelectedTitle(true)}>
                  <Pencil size={18} />
                </button>
              </div>
            )}
            {isEditingSelectedDescription ? (
              <div className="flex gap-2 items-start mt-10">
                <textarea
                  value={courseVideos[selectedCourse].description}
                  onChange={(e) =>
                    updateCourseVideo(selectedCourse, {
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 min-h-40 rounded-md bg-white shadow-input"
                ></textarea>
                <button onClick={() => setIsEditingSelectedDescription(false)}>
                  <Save size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 items-start w-full mt-10">
                <p className="min-h-10 bg-white whitespace-pre-line">
                  {courseVideos[selectedCourse].description}
                </p>
                <button onClick={() => setIsEditingSelectedDescription(true)}>
                  <Pencil size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Playlist */}
        </div>
      )}
      <Button
        text={!isLoading ? "Зберегти Курс" : ""}
        icon={isLoading && <Loader />}
        type="button"
        className="mt-5 w-fit disabled:pointer-events-none"
        disabled={courseVideos.length === 0}
        onClick={handleSubmit}
      />
    </div>
  );
}
export default withAdminGuard(AddCourseVideoForm);
