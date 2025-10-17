"use client";

import NavLinkIcon from "@/components/links/LinkWithIcon";
import MaskIcon from "@/components/MaskIcon";

type Props = {
  selectedPage: string;
  setSelectedPage: (selectedPage: string) => void;
};

export default function ProfileAside({ selectedPage, setSelectedPage }: Props) {
  return (
    <aside className="flex flex-col items-center gap-3 w-full p-5 border-r border-border h-[calc(100%-80px)] transition-all">
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
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "profile" ? "bg-icon shadow-icon" : ""
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/user.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "profile"
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
          name="security"
          className={`w-full cursor-pointer rounded-xl hover:bg-muted-background hover:border-border ${
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
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "security" ? "bg-icon shadow-icon" : ""
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/sec.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "security"
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
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "subscription"
                    ? "bg-icon shadow-icon text-foreground fill-foreground stroke-foreground"
                    : ""
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/pay.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "subscription"
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
          name="bookmarks"
          className={`w-full cursor-pointer rounded-xl border-[1px] border-background hover:bg-muted-background hover:border-border ${
            selectedPage === "bookmarks"
              ? "bg-muted-background border-border"
              : ""
          } `}
          onClick={(e) => {
            setSelectedPage(e.currentTarget.name);
          }}
        >
          <NavLinkIcon
            text="Збережене"
            rout="/profile/bookmarks"
            icon={
              <div
                className={`flex items-center justify-center w-8 h-8 p-1.5 rounded-lg ${
                  selectedPage === "bookmarks"
                    ? "bg-icon shadow-icon text-foreground fill-foreground stroke-foreground"
                    : ""
                }`}
              >
                <MaskIcon
                  src="/icons/menu-icons/bookmark.svg"
                  className={`w-5 h-5 ${
                    selectedPage === "bookmarks"
                      ? "text-foreground"
                      : "text-muted"
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
