"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import {
  selectIsAdmin,
  selectIsLoggedIn,
  selectSubscription,
  selectUser,
} from "@/selectors/auth.selectors";
import IconInput from "@/components/form&inputs/InputIcon";
import NavLink from "@/components/links/Link";
import Logo from "@/components/Logo";
import Image from "next/image";
import Link from "next/link";

type Props = {
  isOpenAside: boolean;
  setIsOpenAside: (isOpen: boolean) => void;
};
const SEARCH_INPUT_ID = "app-search";

export default function Header({ isOpenAside, setIsOpenAside }: Props) {
  const [search, setSearch] = useState("");
  const subscription = useAppSelector(selectSubscription);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAdmin = useAppSelector(selectIsAdmin);
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const [isExpanded, setIsExpanded] = useState(false);

  const doNavigate = useCallback(
    (term: string) => {
      const q = term.trim();
      const el = document.getElementById(
        SEARCH_INPUT_ID
      ) as HTMLInputElement | null;

      if (!q) {
        el?.focus();
        return;
      }

      // беремо існуючі параметри
      const params = new URLSearchParams(window.location.search);

      // оновлюємо або додаємо пошук
      params.set("search", q);

      // пушимо новий URL з усіма параметрами
      router.push(`/videos?${params.toString()}`, { scroll: false });

      setSearch("");
      el?.blur();
    },
    [router]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrlK =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (!isCmdOrCtrlK) return;
      e.preventDefault();
      const el = document.getElementById(
        SEARCH_INPUT_ID
      ) as HTMLInputElement | null;
      const term = (el?.value ?? "").trim();
      if (term) doNavigate(term);
      else el?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [doNavigate]);

  return (
    <header className="relative w-full max-h-[80px] flex items-center lg:justify-between bg-background border-b border-border z-50">
      <div className="w-full lg:w-auto flex items-center justify-between md:justify-normal">
        <div
          className={`flex items-center gap-2 px-3 md:px-5 pt-4 pb-3 shrink-1`}
        >
          <button
            className="hidden w-10 h-10 md:flex items-center justify-center p-2 cursor-pointer"
            onClick={() => setIsOpenAside(!isOpenAside)}
          >
            <Menu />
          </button>
          <Logo />
        </div>
        <div className={`pl-0 md:pl-5 py-5 transition-all duration-300 `}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doNavigate(search);
            }}
            role="search"
          >
            <IconInput
              id={SEARCH_INPUT_ID}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Пошук відео"
              value={search}
              onChange={setSearch}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearch("");
                  (e.target as HTMLInputElement).blur();
                }
              }}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              wrapperClassName=" "
            />
          </form>
        </div>
      </div>
      <div className="flex md:gap-4 py-5 pr-1 md:pr-5 pl-4">
        {!isExpanded && (
          <Link
            href="/command"
            className="hidden md:flex whitespace-nowrap items-center text-[#727272] font-inter font-medium text-[13px] leading-5 tracking-thin hover:text-foreground transition-colors duration-300 mr-4"
            passHref
          >
            Про платформу
          </Link>
        )}
        {(subscription === "free" || !subscription) && (
          <div className="hidden md:flex">
            <NavLink
              rout="/check-subscription"
              text="Преміум доступ"
              style="accent"
            />
          </div>
        )}
        {!isLoggedIn ? (
          <NavLink rout="/signup" text="Увійти" />
        ) : isAdmin ? (
          <div className="flex items-center gap-4">
            <Link href="/da-admin">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {user?.avatar ? (
                  <Image
                    src={user?.avatar}
                    alt="Avatar"
                    width={40}
                    height={40}
                  />
                ) : (
                  <Image
                    src="/images/avatar.png"
                    alt="Avatar"
                    width={40}
                    height={40}
                  />
                )}
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {user?.avatar ? (
                  <Image
                    src={user?.avatar}
                    alt="Avatar"
                    width={40}
                    height={10}
                  />
                ) : (
                  <Image
                    src="/images/avatar.png"
                    alt="Avatar"
                    width={40}
                    height={40}
                  />
                )}
              </div>
            </Link>
          </div>
        )}
      </div>
      <div className="md:hidden py-5 pl-1 pr-5 flex-1">
        <button
          className="w-10 h-10 flex items-center justify-center p-2 cursor-pointer"
          onClick={() => setIsOpenAside(!isOpenAside)}
        >
          <Menu />
        </button>
      </div>
    </header>
  );
}
