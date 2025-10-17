"use client";

import NavLinkIcon from "@/components/links/LinkWithIcon";
import MaskIcon from "@/components/MaskIcon";

type Props = {
  selectedPage: string;
  setSelectedPage: (selectedPage: string) => void;
};

export default function AdminAside({ selectedPage, setSelectedPage }: Props) {
  return (
    <aside className="flex flex-col items-center gap-3 w-full p-5 h-[calc(100%-80px)] transition-all">
      <div className="flex flex-col w-full items-center gap-0.5">
        <button
          type="button"
          name="analitics"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "analitics"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Аналітика"
            rout="/da-admin"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "analitics"
                    ? "bg-icon shadow-icon fill-foreground"
                    : "fill-muted"
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/analitic.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "analitics"
                      ? "text-foreground"
                      : "text-muted"
                  }`}
                />
              </div>
            }
          />
        </button>
        <button
          type="button"
          name="add-video"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "add-video"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Додати відео"
            rout="/da-admin/add/video"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "add-video" ? "bg-icon shadow-icon" : ""
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/media-video.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "add-video"
                      ? "text-foreground"
                      : "text-muted"
                  }`}
                />
              </div>
            }
          />
        </button>
        <button
          type="button"
          name="add-course"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "add-course"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Додати курс"
            rout="/da-admin/add/course"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "add-course" ? "bg-icon shadow-icon" : ""
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/media-course.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "add-course"
                      ? "text-foreground"
                      : "text-muted"
                  }`}
                />
              </div>
            }
          />
        </button>
        <button
          type="button"
          name="add-short"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "add-short"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Додати Shorts"
            rout="/da-admin/add/short"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "add-short" ? "bg-icon shadow-icon" : ""
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/media-short.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "add-short"
                      ? "text-foreground"
                      : "text-muted"
                  }`}
                />
              </div>
            }
          />
        </button>
        <button
          type="button"
          name="users"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "users" ? "bg-muted-background border-border" : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Управління користувачами"
            rout="/da-admin/users"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "users" ? "bg-icon shadow-icon" : ""
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/group.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "users" ? "text-foreground" : "text-muted"
                  }`}
                />
              </div>
            }
          />
        </button>
      </div>
    </aside>
  );
}
