"use client";

import Image from "next/image";
import NavLinkIcon from "../links/LinkWithIcon";

type Props = {
  selectedPage: string;
  setSelectedPage: (selectedPage: string) => void;
};

export default function ProfileAside({ selectedPage, setSelectedPage }: Props) {
  return (
    <aside className="flex flex-col items-center gap-3 w-full py-5 border-r border-border h-[calc(100%-80px)] transition-all">
      <div className="flex flex-col w-full items-center gap-0.5">
        <button
          type="button"
          name="profile"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "profile"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Профіль"
            rout="/profile"
            icon={
              <Image
                src="/icons/menu-icons/grid.svg"
                alt="Grid"
                width={20}
                height={20}
              />
            }
          />
        </button>
        <button
          type="button"
          name="security"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "security"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Безпека"
            rout="/profile/security"
            icon={
              <Image
                src="/icons/menu-icons/layer.svg"
                alt="Grid"
                width={20}
                height={20}
              />
            }
          />
        </button>
        <button
          type="button"
          name="subscription"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "subscription"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Підписка"
            rout="/profile/subscription"
            icon={
              <Image
                src="/icons/menu-icons/settings.svg"
                alt="Grid"
                width={20}
                height={20}
              />
            }
          />
        </button>
        {/* <button
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
            count={videosCount}
          />
        </button> */}
      </div>
    </aside>
  );
}
