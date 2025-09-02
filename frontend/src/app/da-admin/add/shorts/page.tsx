"use client";

import React, { useState } from "react";
import Image from "next/image";
import Vimeo from "@u-wave/react-vimeo";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchVideoData } from "@/lib/api/getVideoData";

import { withAdminGuard } from "@/guards/WithAdminGuard";
import Switch from "@/components/form&inputs/Switch";
import Input from "@/components/form&inputs/Input";
import Button from "@/components/buttons/Button";
import Loader from "@/components/loaders/Loader";
import moment from "moment";
import { durationStringToString } from "@/lib/duration.utils";
import { selectIsLoadingShorts } from "@/redux/selectors/shorts.selector";
import { AddShort } from "@/types/shorts.type";
import { addShort } from "@/redux/shorts/shorts.thunk";

export interface IData {
  name: string;
  description: string;
  duration: string;
  pictures: { base_link: string; sizes: { width: string; link: string }[] };
  release_time: string;
}

function AddShortPage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoadingShorts);
  const [shortData, setShortData] = useState<IData | null>(null);
  const [video, setVideo] = useState("");
  const [originalVideo, setOriginalVideo] = useState("");
  const [cover, setCover] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [switchCover, setSwitchCover] = useState<"cover" | "video">("video");
  const [free, setFree] = useState(false);

  const handleAddFilter = () => {
    if (filterInput.trim() && !tags.includes(filterInput.trim())) {
      setTags([...tags, filterInput.trim()]);
      setFilterInput("");
    }
  };

  const handlefetchShortData = async () => {
    const shortId = video.replace("https://vimeo.com/", "");
    if (!shortId) {
      toast.error("Додайте правильну лінку для відео");
      return;
    }
    try {
      const res: IData = await fetchVideoData(shortId);

      const cover = res.pictures?.sizes?.find(
        (s) => parseInt(s.width) >= 768
      )?.link;
      setShortData(res);
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
    setShortData(null);
    setVideo("");
    setCover("");
    setTitle("");
    setDescription("");
    setDuration("");
    setPublishedAt("");
    setFilterInput("");
    setTags([]);
    setFree(false);
    setOriginalVideo("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Заповніть назву відео");
      return;
    }

    // if (!description.trim()) {
    //   toast.error("Заповніть опис відео");
    //   return;
    // }

    if (tags.length === 0) {
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
    // if (!originalVideo) {
    //   toast.error("Проблема з оригінальним лінком");
    //   return;
    // }
    const req: AddShort = {
      video,
      title,
      tags,
      free,
      cover,
      duration,
      publishedAt,
    };
    if (description) {
      req.description = description;
    }
    if (originalVideo) {
      req.originalVideo = originalVideo;
    }
    try {
      const res = await dispatch(addShort(req));

      if (res?.type === "shorts/addShort/rejected") {
        toast.error(
          `Сталась помилка при завантаженні, спробуйте ще раз ${res.payload}`,
          {
            duration: 5000,
          }
        );
        return;
      }

      reset();
      toast.success("Відео завантажено, можна переходити до наступного", {
        duration: 5000,
      });
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
    <div className="flex flex-col gap-5 w-full p-5">
      <h2 className="text-xl font-semibold text-foreground">Додати відео</h2>
      <div className="flex gap-5 w-full">
        <form className="flex-1/2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-5">
            <label className="text-xl font-semibold text-muted">
              Коротке Відео (Vimeo URL)
              <Input
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                placeholder="https://vimeo.com/1110000000"
                className="font-inter text-base font-semibold text-muted"
                required
              />
            </label>
            <Button
              text="Витягнути дані з Vimeo"
              type="button"
              className="w-fit"
              onClick={handlefetchShortData}
            />
            <label className="text-xl font-semibold text-muted">
              Оригінальне Коротке Відео (Youtube URL)
              <Input
                value={originalVideo}
                onChange={(e) => setOriginalVideo(e.target.value)}
                placeholder="https://youtube.com/1110000000"
                className="font-inter text-base font-semibold text-muted"
              />
            </label>
            <div className="flex gap-2 items-center">
              <Switch value={free} setValue={setFree} />
              <p>Безкоштовне</p>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="">
              <label className="text-xl font-semibold text-muted">
                Фільтри
              </label>
              <div className="mb-5">
                <Input
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                  placeholder="Введіть фільтр"
                  className="font-inter text-base font-semibold text-muted"
                />
                <Button
                  text="Додати"
                  type="button"
                  onClick={handleAddFilter}
                  className="mt-2 w-fit py-1 px-2"
                ></Button>
              </div>
              <div className="flex flex-col justify-center gap-2">
                {tags.map((f, idx) => (
                  <span key={idx} className=" inline-flex gap-1 items-center">
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                      className="cursor-pointer p-1 bg-muted rounded-md"
                    >
                      <X size={16} />
                    </button>
                    <Button
                      type="button"
                      text={f}
                      className="font-inter text-lg"
                    ></Button>
                  </span>
                ))}
              </div>
            </div>
          </div>
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
          <Button
            text={!isLoading ? "Завантажити відео" : ""}
            icon={isLoading && <Loader />}
            type="submit"
            className="mt-5"
            disabled={!shortData}
          />
        </form>
        <div className="flex-1/2 overflow-hidden">
          <p className="text-lg font-semibold text-foreground">Превʼю</p>

          {shortData && (
            <>
              <p className="text-base font-medium text-foreground mt-4">
                Назва короткого відео:
              </p>
              {title && <p>{title}</p>}
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введіть Назву"
                className="flex w-full font-inter text-base font-semibold text-muted"
                required
              />

              <p className="text-base font-medium text-foreground mt-4">
                Опис відео:
              </p>
              {description && (
                <>
                  <p className=" whitespace-pre-line">{description}</p>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введіть Опис"
                    className="min-h-40 border-0 px-3 py-2 w-full bg-white rounded-md shadow-input focus:shadow-input-hover focus:outline-0 font-inter text-base font-semibold text-muted mb-5"
                    required
                  />
                </>
              )}
              <Button
                type="button"
                text={`Switch to ${switchCover}`}
                onClick={() =>
                  setSwitchCover(switchCover === "cover" ? "video" : "cover")
                }
              />
              {switchCover === "video" ? (
                <>
                  <p className="text-base font-medium text-foreground mt-4">
                    Cover
                  </p>
                  {cover && (
                    <div className="relative">
                      <Image
                        src={cover}
                        alt="ff"
                        width={576}
                        height={430}
                        className="relative"
                      />
                      {duration && (
                        <p className="absolute font-inter bottom-[30px] left-[5px] px-2 py-1 bg-muted rounded-lg">
                          {durationStringToString(duration)}
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-base font-medium text-foreground mt-4">
                    Video
                  </p>
                  {video && (
                    <div className="relative w-xl aspect-video">
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
                  )}
                </>
              )}
              {publishedAt && (
                <p className="mt-4">
                  Date -{" "}
                  {moment(new Date(publishedAt)).format("DD-MM-YYYY_HH:mm")}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default withAdminGuard(AddShortPage);
