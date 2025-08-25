"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import {
  selectIsAlpha,
  selectIsLoadingTest,
  selectIsTester,
} from "@/selectors/test.selectors";
import {
  selectIsAdmin,
  selectIsLoggedIn,
  selectSubscription,
  selectUser,
} from "@/selectors/auth.selectors";
import IconInput from "@/components/form&inputs/InputIcon";
import NavLink from "@/components/links/Link";
import Logo from "@/components/Logo";
import HeaderTimer from "@/components/HeaderTimer";
import Image from "next/image";
import Link from "next/link";

type Props = {
  isOpenAside: boolean;
  setIsOpenAside: (isOpen: boolean) => void;
};
const SEARCH_INPUT_ID = "app-search";

export default function Header({ isOpenAside, setIsOpenAside }: Props) {
  const [search, setSearch] = useState("");
  const isLoading = useAppSelector(selectIsLoadingTest);
  const isAlphaTesting = useAppSelector(selectIsAlpha);
  const isTester = useAppSelector(selectIsTester);
  const subscription = useAppSelector(selectSubscription);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAdmin = useAppSelector(selectIsAdmin);
  const router = useRouter();
  const user = useAppSelector(selectUser);

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
      router.push(`/videos?search=${encodeURIComponent(q)}`);
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

  if (isLoading) {
    return null;
  }
  if (isAlphaTesting && !isTester) {
    return <HeaderTimer />;
  }

  return (
    <header className="relative max-h-[80px] flex items-center md:justify-between bg-background border-b border-border w-full z-50">
      <div className="w-full md:w-auto flex items-center justify-between md:justify-normal">
        <div className={`flex items-center px-5 pt-4 pb-3 shrink-1`}>
          <button
            className="hidden w-10 h-10 md:flex items-center justify-center p-2 cursor-pointer"
            onClick={() => setIsOpenAside(!isOpenAside)}
          >
            <Menu />
          </button>
          <Logo />
        </div>
        <div className={`p-5  transition-all duration-300 `}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doNavigate(search);
            }}
            role="search"
            className="w-full"
          >
            <IconInput
              id={SEARCH_INPUT_ID}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Пошук відео..."
              aria-label="Пошук відео"
              value={search}
              onChange={setSearch}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearch("");
                  (e.target as HTMLInputElement).blur();
                }
              }}
              wrapperClassName=" "
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M14 14L11.1 11.1M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
                    stroke="#7b7b7b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          </form>
        </div>
      </div>
      <div className="hidden md:flex md:gap-4 p-5">
        <Link
          href="/command"
          className="hidden lg:flex items-center text-[#727272] font-inter font-medium text-[13px] leading-5 tracking-thin hover:text-foreground transition-colors duration-300 mr-4"
          passHref
        >
          Про проект
        </Link>
        {(subscription === "free" || !subscription) && (
          <NavLink rout="/check-subscription" text="Преміум доступ" />
        )}
        {!isLoggedIn ? (
          <NavLink rout="/signup" text="Увійти" style="accent" />
        ) : isAdmin ? (
          <div className="flex items-center gap-4">
            <NavLink rout="/da-admin" text="Профіль" style="accent" />
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {user?.avatar ? (
                <Image src={user?.avatar} alt="Avatar" width={32} height={32} />
              ) : (
                <Image
                  src="/images/avatar.png"
                  alt="Avatar"
                  width={32}
                  height={32}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <NavLink rout="/profile" text="Профіль" style="accent" />
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {user?.avatar ? (
                <Image src={user?.avatar} alt="Avatar" width={32} height={32} />
              ) : (
                <Image
                  src="/images/avatar.png"
                  alt="Avatar"
                  width={32}
                  height={32}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="md:hidden p-5 flex-1">
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
