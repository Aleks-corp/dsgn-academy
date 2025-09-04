"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Vimeo from "@u-wave/react-vimeo";
import { Pencil, RefreshCcw, Save } from "lucide-react";
import toast from "react-hot-toast";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { editVideo, fetchVideoById } from "@/redux/videos/video.thunk";
import { fetchVideoData } from "@/lib/api/getVideoData";
import { AddVideo } from "@/types/videos.type";
import { categoriesConstant } from "@/constants/categories.constant";

import { withAdminGuard } from "@/guards/WithAdminGuard";
import SwitchSelector from "@/components/form&inputs/SwitchSelector";
import Switch from "@/components/form&inputs/Switch";
import Input from "@/components/form&inputs/Input";
import Button from "@/components/buttons/Button";
import { selectIsLoadingVideos } from "@/redux/selectors/videos.selectors";
import Loader from "@/components/loaders/Loader";
import { useParams } from "next/navigation";
import { clearVideo } from "@/redux/videos/videoSlice";
import { durationStringToString } from "@/lib/duration.utils";
import SwitchName from "@/components/form&inputs/SwitchName";

export interface IData {
  name: string;
  description: string;
  duration: string;
  pictures: { base_link: string; sizes: { width: string; link: string }[] };
  release_time: string;
}

function EditCoursePage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoadingVideos);
  const [switchEditTitle, setSwitchEditTitle] = useState<boolean>(false);
  const [switchEditDesc, setSwitchEditDesc] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [videoData, setVideoData] = useState<IData | null>(null);
  const [video, setVideo] = useState("");
  const [originalVideo, setOriginalVideo] = useState("");
  const [cover, setCover] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const [categoryState, setCategoryState] = useState<
    { [key: string]: boolean }[]
  >(categoriesConstant.map((c) => ({ [c]: false })));
  const [free, setFree] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchVideoById(id as string)).then((res) => {
      if (res?.payload) {
        setVideoData(res.payload);
        setRecommended(res.payload.recommended);
        setFree(res.payload.free);
        setVideo(res.payload.video);
        setOriginalVideo(res.payload.originalVideo);
        setCover(res.payload.cover);
        setTitle(res.payload.title);
        setDescription(res.payload.description);
        setDuration(res.payload.duration);
        setPublishedAt(res.payload.publishedAt);
        setFilters(res.payload.filter);
        setCategoryState(
          categoriesConstant.map((c) => ({
            [c]: res.payload.category.includes(c),
          }))
        );
      }
    });

    return () => {
      dispatch(clearVideo());
    };
  }, [dispatch, id]);

  const handleAddFilter = () => {
    if (!filterInput.trim()) return;

    let newFilters = filterInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    newFilters = newFilters.filter((f) => !filters.includes(f));

    if (newFilters.length > 0) {
      setFilters([...filters, ...newFilters]);
      setFilterInput("");
    }
  };

  const handlefetchVideoData = async () => {
    const vimeoId = video.replace("https://vimeo.com/", "");
    if (!vimeoId) {
      toast.error("Додайте правльну лінку для відео");
      return;
    }
    try {
      const res: IData = await fetchVideoData(vimeoId);

      const cover = res.pictures?.sizes?.find(
        (s) => parseInt(s.width) >= 768
      )?.link;
      setVideoData(res);
      setTitle(res.name);
      setDescription(res.description);
      setDuration(res.duration.toString());
      setPublishedAt(res.release_time);
      setCover(cover || "");
    } catch (error) {
      console.info("🚀 ~ error:", error);
    }
  };

  const reset = () => {
    setVideoData(null);
    setVideo("");
    setCover("");
    setTitle("");
    setDescription("");
    setDuration("");
    setPublishedAt("");
    setCategoryState(categoriesConstant.map((c) => ({ [c]: false })));
    setFilterInput("");
    setFilters([]);
    setFree(false);
    setRecommended(false);
    setOriginalVideo("");
  };

  const handleSubmit = async () => {
    const selectedCategories = categoryState
      .filter((c) => Object.values(c)[0])
      .map((c) => Object.keys(c)[0]);

    if (!title.trim()) {
      toast.error("Заповніть назву відео");
      return;
    }

    if (!description.trim()) {
      toast.error("Заповніть опис відео");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Оберіть хоча б одну категорію");
      return;
    }

    if (filters.length === 0) {
      toast.error("Оберіть хоча б один фільтр");
      return;
    }
    if (!cover) {
      toast.error(
        "Проблема з обкладинкою, спробуй перезавантажити дані з Vimeo"
      );
      return;
    }
    if (!duration) {
      toast.error(
        "Проблема з тривалістю, спробуй перезавантажити дані з Vimeo, можливо відео ще не проаналізовано на сервері"
      );
      return;
    }
    if (!publishedAt) {
      toast.error("Проблема з датою публікації");
      return;
    }
    if (!originalVideo) {
      toast.error("Проблема з оригінальним лінком");
      return;
    }
    const body: AddVideo = {
      video,
      title,
      description,
      category: selectedCategories,
      filter: filters,
      free,
      recommended,
      cover,
      duration,
      publishedAt,
      originalVideo,
    };
    try {
      const res = await dispatch(
        editVideo({ video: body, videoId: id as string })
      );

      if (res?.type === "videos/editVideo/rejected") {
        toast.error(
          `Сталась помилка при завантаженні, спробуйте ще раз ${res.payload}`,
          {
            duration: 5000,
          }
        );
        return;
      }

      reset();
      toast.success("Відео відредаговано", { duration: 5000 });
    } catch (err) {
      if (err instanceof Error) {
        // setError(err.message || "Помилка помилка завантаження. Спробуйте ще раз.");
      } else {
        // setError("Невідома помилка. Спробуйте ще раз.");
      }
      console.info("Registration failed", err);
    }
  };

  return (
    <div className="flex w-full p-5">
      <div className="px-6 flex-1/2">
        <div className="flex gap-3 mb-6">
          <div className="w-3 h-6 rounded-sm bg-accent" />
          <h2 className="text-xl font-medium leading-7 tracking-thinest text-foreground">
            Редагувати відео
          </h2>
        </div>
        <div className="flex items-end justify-between gap-4 mb-3">
          <label className="text-xs font-medium leading-4 tracking-thin text-foreground">
            Посилання на відео
            <Input
              value={video}
              onChange={(e) => setVideo(e.target.value)}
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
            onClick={handlefetchVideoData}
          />
        </div>
        <div className="flex gap-4 mb-3 w-full">
          <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
            Посилання на оригінал
            <Input
              value={originalVideo}
              onChange={(e) => setOriginalVideo(e.target.value)}
              placeholder="https://youtube.com/000000000000"
              className="font-inter text-xs font-medium leading-4 tracking-thin text-muted w-full mt-2"
              required
            />
          </label>
        </div>
        <div className="mb-3">
          <div className="flex justify-between w-full mb-2">
            <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
              Заголовок
            </label>
            {switchEditTitle ? (
              <button
                onClick={() => setSwitchEditTitle(false)}
                className="cursor-pointer"
              >
                <Save size={18} />
              </button>
            ) : (
              <button
                onClick={() => setSwitchEditTitle(true)}
                className="cursor-pointer"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
          {switchEditTitle ? (
            <div className="flex gap-2 items-center bg-white rounded-xl">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введіть назву"
                className="font-inter text-xs font-medium leading-4 tracking-thin text-muted w-full"
                required
              />
            </div>
          ) : (
            <div className="flex gap-2 items-center w-full bg-white rounded-xl px-5 py-3">
              <div className="w-full min-h-4">{title}</div>
            </div>
          )}
        </div>
        <div className="mb-3">
          <div className="flex items-end gap-4 mb-3 w-full">
            <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
              Теги
              <Input
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                placeholder="Введіть фільтр"
                className="font-inter text-xs font-medium leading-4 tracking-thin text-muted mt-2 w-full"
              />
            </label>
            <Button
              text="Додати"
              type="button"
              onClick={handleAddFilter}
              className="mt-2 w-fit py-1 px-2"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f, idx) => (
              <span key={idx} className=" inline-flex gap-1 items-center">
                <button
                  type="button"
                  onClick={() =>
                    setFilters(filters.filter((_, i) => i !== idx))
                  }
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative font-inter text-xs font-medium leading-4 tracking-thin text-muted rounded-lg cursor-pointer shadow-btn hover:bg-black hover:text-white px-2 py-1 bg-[#00000010]"
                >
                  {f}

                  <div
                    className={`absolute top-0 left-0 w-full h-full flex justify-center items-center rounded-lg bg-black transition-all duration-200 ${
                      hoveredIndex === idx ? "opacity-100" : "opacity-0"
                    } `}
                  >
                    Delete
                  </div>
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between w-full mb-2">
            <label className="text-xs font-medium leading-4 tracking-thin text-foreground w-full">
              Опис
            </label>
            {switchEditDesc ? (
              <button
                onClick={() => setSwitchEditDesc(false)}
                className="cursor-pointer"
              >
                <Save size={18} />
              </button>
            ) : (
              <button
                onClick={() => setSwitchEditDesc(true)}
                className="cursor-pointer"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
          {switchEditDesc ? (
            <div className="flex gap-2 items-center bg-white rounded-xl">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введіть Опис"
                className="min-h-40 border-0 px-3 py-2 w-full bg-white rounded-xl shadow-input focus:shadow-input-hover focus:outline-0 font-inter text-xs font-medium leading-4 tracking-thin text-muted"
                required
              />
            </div>
          ) : (
            <div className="flex gap-2 items-center w-full bg-white rounded-xl px-5 py-3">
              <div className="w-full min-h-10">
                <p className=" whitespace-pre-line">{description}</p>
              </div>
            </div>
          )}
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
            disabled={!videoData}
          />
        </div>

        <div className="flex gap-6 mb-6">
          <div className="flex-2/3 bg-muted-background rounded-2xl overflow-hidden">
            {video && videoData ? (
              <div className="relative max-w-xl aspect-video">
                <Vimeo
                  key={video}
                  video={video}
                  responsive
                  pip
                  speed
                  autoplay={false}
                  width="100%"
                  height="100%"
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
          <div className="flex-1/3">
            <p className="text-xs font-medium leading-4 tracking-thin text-foreground mb-2">
              Обкладинка
            </p>
            {cover ? (
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src={cover}
                  alt="cover"
                  width={576}
                  height={324}
                  className="relative w-full h-auto"
                />
                {duration && (
                  <p className="absolute font-inter text-xs bottom-2 right-2 px-2 py-1 bg-muted rounded-lg">
                    {durationStringToString(duration)}
                  </p>
                )}
              </div>
            ) : (
              <div className="w-full bg-muted-background rounded-2xl overflow-hidden">
                <Image
                  src="/images/placeholder.png"
                  alt="cover"
                  width={576}
                  height={324}
                  className="relative w-full h-auto"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full justify-between items-center mb-6">
          <SwitchSelector
            title="Категорії"
            items={categoryState}
            setItems={setCategoryState}
            constants={categoriesConstant}
            // containerClass=""
            // optionClass=""
          />
        </div>
        <div className="flex gap-2 items-center justify-between mb-6">
          <p className="text-xs font-medium leading-4 tracking-thin text-foreground">
            Безкоштовне
          </p>
          <SwitchName value={free} setValue={setFree} />
        </div>
        <div className="flex gap-2 h-10 items-center justify-between mb-6">
          <p className="text-xs font-medium leading-4 tracking-thin text-foreground">
            Рекомендоване
          </p>
          <Switch value={recommended} setValue={setRecommended} />
        </div>
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
    </div>
  );
}
export default withAdminGuard(EditCoursePage);
