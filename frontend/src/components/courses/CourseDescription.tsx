import Button from "@/components/buttons/Button";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";
import { PiThreadsLogoFill } from "react-icons/pi";
import { ChevronUp, Edit } from "lucide-react";
import { useState } from "react";
import type { ICourse } from "@/types/courses.type";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAdmin } from "@/redux/selectors/auth.selectors";
import { useParams } from "next/navigation";
import moment from "moment";

export default function CourseDescription({
  course,
  selectedVideoIndex,
}: {
  course: ICourse;
  selectedVideoIndex: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = course.title;

  const { width } = useWindowWidth();
  const isAdmin = useAppSelector(selectIsAdmin);
  const { id: courseId } = useParams();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share canceled:", err);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Посилання скопійовано!", {
        style: {
          boxShadow: "0 0 0 1.5px  #3582ff inset",

          padding: "16px",
          color: "#0170fd",
        },
        iconTheme: {
          primary: "#3582ff",
          secondary: "#FFFAEE",
        },
      });
    }
  };
  const socialLinks = {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`,
    threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(
      `${shareText} ${shareUrl}`
    )}`,
  };
  return (
    <div className="max-w-[990px] px-5 py-5 flex flex-col bg-white rounded-3xl">
      <div className="flex flex-col gap-4 w-full xl:flex-row xl:justify-between">
        <h1 className=" text-2xl font-bold leading-7 tracking-thiner text-start">
          {course.title}
        </h1>
        <div className="flex items-center justify-end gap-3">
          {isAdmin && (
            <Link href={`/da-admin/add/course/${courseId}`}>
              <Edit />
            </Link>
          )}
          <a
            href={socialLinks.threads}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:opacity-80 w-10 h-10 flex justify-center items-center rounded-[10px] border-1 border-border"
          >
            <PiThreadsLogoFill size={20} />
          </a>
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:opacity-80 w-10 h-10 flex justify-center items-center rounded-[10px] border-1 border-border"
          >
            <FaXTwitter size={20} />
          </a>
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:opacity-80 w-10 h-10 flex justify-center items-center rounded-[10px] border-1 border-border"
          >
            <FaTelegramPlane size={20} />
          </a>
          {/* кнопка поділитись */}
          <Button type="button" text="Поділитись" onClick={handleShare} />
        </div>
      </div>
      {isAdmin && course.publishedAt && (
        <p className="my-4 font-bold">
          Date -{" "}
          {moment(new Date(course.publishedAt)).format("DD-MM-YYYY_HH:mm")}
        </p>
      )}
      {selectedVideoIndex === 0 && (
        <div className="mt-5 text-sm text-muted-foreground leading-5 mb-5">
          <p className={`whitespace-pre-line transition-all duration-300 `}>
            {course.description}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-4 w-full xl:flex-row xl:justify-between mb-4">
        <h1 className=" text-xl font-medium leading-7 tracking-thinest text-start">
          {course.videos[selectedVideoIndex].title}
        </h1>
      </div>
      <div className="mt-5 text-sm text-muted-foreground leading-5">
        <p
          className={`whitespace-pre-line transition-all duration-300 ${
            expanded || width >= 1024 ? "line-clamp-none" : "line-clamp-3"
          }`}
        >
          {course.videos[selectedVideoIndex].description}
          {course.videos[selectedVideoIndex].originalUrl && (
            <span className="flex mt-4">
              Оригінальне посилання:
              <Link
                href={course.videos[selectedVideoIndex].originalUrl}
                className="ml-1 text-accent hover:text-accent-hover"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {course.videos[selectedVideoIndex].originalUrl}
              </Link>
            </span>
          )}
        </p>

        {course.videos[selectedVideoIndex].description &&
          course.videos[selectedVideoIndex].description.length > 120 &&
          width < 1024 && (
            <div className="w-full flex justify-center translate-y-3">
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="flex justify-center items-center w-10 h-10 text-muted bg-white font-medium rounded-full hover:text-muted-background cursor-pointer transition-all duration-300 shadow-icon"
              >
                <div
                  className={` ${
                    !expanded ? "rotate-180" : "rotate-0"
                  } transition-transform duration-300`}
                >
                  <ChevronUp />
                </div>
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
