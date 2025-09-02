"use client";

import Image from "next/image";
import NavLinkIcon from "../links/LinkWithIcon";

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
                <Image
                  src="/icons/menu-icons/grid.svg"
                  alt="Grid"
                  width={20}
                  height={20}
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
                <Image
                  src="/icons/menu-icons/layer.svg"
                  alt="Grid"
                  width={20}
                  height={20}
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
            text="Додати коротке відео"
            rout="/da-admin/add/short"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "add-short" ? "bg-icon shadow-icon" : ""
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
          />
        </button>
        <button
          type="button"
          name="edit-video"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "edit-video"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Редагувати відео"
            rout="/da-admin/edit/video"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "edit-video" ? "bg-icon shadow-icon" : ""
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
          />
        </button>
        <button
          type="button"
          name="edit-course"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "edit-course"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Редагувати курс"
            rout="/da-admin/edit/course"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "edit-course" ? "bg-icon shadow-icon" : ""
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
          />
        </button>
        <button
          type="button"
          name="edit-short"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "edit-short"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Редагувати коротке відео"
            rout="/da-admin/edit/short"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "edit-short" ? "bg-icon shadow-icon" : ""
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
            text="Юзери"
            rout="/da-admin/users"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "users" ? "bg-icon shadow-icon" : ""
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
          />
        </button>
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
            rout="/da-admin/analitics"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "analitics" ? "bg-icon shadow-icon" : ""
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
          />
        </button>
      </div>
    </aside>
  );
}
