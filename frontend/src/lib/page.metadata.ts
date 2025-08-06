import { fetchCourseById, fetchVideoById } from "@/lib/api/getMetadata";
import type { Metadata } from "next";
import type { ICourse } from "@/types/courses.type";
import { IVideo } from "@/types/videos.type";

export async function getSeoMetadata(
  type: "course" | "video",
  id: string
): Promise<Metadata> {
  let item: ICourse | IVideo | null = null;

  try {
    if (type === "course") {
      item = await fetchCourseById(id);
    } else if (type === "video") {
      item = await fetchVideoById(id);
    }
  } catch {
    item = null;
  }

  if (!item) {
    return {
      title: `${
        type === "course" ? "Курс" : "Відео"
      } не знайдено | Dsgn Academy`,
      description: "Сторінка не знайдена або id некоректний.",
      openGraph: {
        title: `${
          type === "course" ? "Курс" : "Відео"
        } не знайдено | Dsgn Academy`,
        description: "Сторінка не знайдена або id некоректний.",
        images: [],
      },
    };
  }

  return {
    title: `${item.title} | Dsgn Academy`,
    description:
      item.description?.slice(0, 160) ||
      "Детальний опис для дизайнерів на Dsgn Academy.",
    openGraph: {
      title: `${item.title} | Dsgn Academy`,
      description:
        item.description?.slice(0, 160) ||
        "Детальний опис для дизайнерів на Dsgn Academy.",
      images: item.cover ? [{ url: item.cover, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | Dsgn Academy`,
      description:
        item.description?.slice(0, 160) ||
        "Детальний опис для дизайнерів на Dsgn Academy.",
      images: item.cover ? [item.cover] : [],
    },
  };
}
