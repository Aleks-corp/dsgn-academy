"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
// import Lenis from "lenis";
import { Toaster } from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refreshUser } from "@/redux/auth/auth.thunk";
import { isAlpha } from "@/redux/test/test.thunk";
import {
  selectIsAdmin,
  selectIsLoggedIn,
  selectIsRefreshing,
} from "@/selectors/auth.selectors";

import Header from "@/components/Header";
import Aside from "@/components/aside/Aside";
import ProfileAside from "@/components/aside/ProfileAside";
import LoaderBlur from "@/components/loaders/LoadingBlur";
import AdminAside from "@/components/aside/AdminAside";

import { useSelectedPage } from "./useAside";
import Loader from "../loaders/LoaderCircle";
import useIsLg from "./useScreenWidth";
import LenisProvider from "./LenisProvider";

export default function RootPage({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isRefreshing = useAppSelector(selectIsRefreshing);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isAdmin = useAppSelector(selectIsAdmin);
  const pathname = usePathname();
  const isLg = useIsLg();

  const { selectedPage, setSelectedPage } = useSelectedPage();

  // --- 2) за замовчуванням закрито; відкривати будемо в ефекті залежно від isLg
  const [isOpenAside, setIsOpenAside] = useState(false);

  // --- 3) визначаємо коли асайд має бути відкритий на lg+
  const computeShouldOpen = useCallback(() => {
    return (
      pathname === "/" ||
      pathname.endsWith("/videos") ||
      pathname.endsWith("/shorts") ||
      pathname.endsWith("/courses") ||
      (pathname.startsWith("/profile") && isLoggedIn) ||
      (pathname.startsWith("/da-admin") && isLoggedIn && isAdmin)
    );
  }, [pathname, isLoggedIn, isAdmin]);

  // --- 4) синхронізація стану: на мобільному завжди закрито; на lg — як раніше
  useEffect(() => {
    if (!isLg) {
      setIsOpenAside(false);
    } else {
      setIsOpenAside(computeShouldOpen());
    }
  }, [isLg, computeShouldOpen]);

  useEffect(() => {
    dispatch(isAlpha());
    dispatch(refreshUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 5) ширина контенту змінюється тільки на lg+
  const asideWidth = isLg && isOpenAside ? 264 : 0;

  if (isRefreshing) {
    return (
      <div className="relative w-screen h-screen flex justify-center">
        <div className="w-20 h-20 mt-20">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen">
      {/* Передай сеттер у Header — там уже є кнопка меню */}
      <div className="fixed w-full h-20">
        <Header isOpenAside={isOpenAside} setIsOpenAside={setIsOpenAside} />
      </div>

      {/* --- 6) Оверлей для мобіли (від lg і нижче) --- */}
      {!isLg && isOpenAside && (
        <motion.div
          onClick={() => setIsOpenAside(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-0 right-0 bottom-0 z-20 bg-black"
        />
      )}

      {/* --- 7) Aside: 
            - на lg: «вписаний» і зсуває контент (x: 0 або -264)
            - на мобілі: оф-канвас поверх контенту з затемненням (z-30) */}
      <motion.div
        initial={false}
        animate={{ x: isOpenAside ? 0 : -264 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-20 bottom-0 left-0 z-30 bg-background w-[264px] overflow-y-auto overscroll-contain"
      >
        {pathname.startsWith("/da-admin") && isLoggedIn && isAdmin ? (
          <AdminAside
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        ) : pathname.startsWith("/profile") && isLoggedIn ? (
          <ProfileAside
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        ) : (
          <Aside
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        )}
      </motion.div>

      {/* --- 8) Права частина: на lg звужується, на мобілі — завжди 100vw */}
      <motion.div
        animate={{ width: isLg ? `calc(100vw - ${asideWidth}px)` : "100vw" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-20 right-0 bottom-0 flex flex-col h-[calc(100%-80px)]"
      >
        <LenisProvider>
          <div
            className={`flex-1 ${
              !isLg && isOpenAside ? "pointer-events-none" : ""
            }`}
          >
            <main className="relative w-full max-w-[1440px] mx-auto flex items-center justify-center sm:items-start px-5 py-5">
              {children}
            </main>
          </div>
        </LenisProvider>
        <LoaderBlur />
      </motion.div>

      <Toaster position="top-center" />
    </div>
  );
}
