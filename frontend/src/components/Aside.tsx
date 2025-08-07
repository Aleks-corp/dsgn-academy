"use client";

import { useAppSelector } from "@/redux/hooks";
import Logo from "./Logo";

import { selectIsAlpha } from "@/selectors/test.selectors";

export default function Aside() {
  const isAlphaTesting = useAppSelector(selectIsAlpha);

  return isAlphaTesting ? null : (
    <aside className="flex flex-col items-center w-2xs gap-8">
      <Logo />

      <div className="flex flex-col w-full items-center gap-4 flex-wrap">
        <button className="flex w-full">Всі відео</button>
        <button className="flex w-full">Курси</button>
        <button className="flex w-full">Без оплати</button>
        <button className="flex w-full">Короткі відео</button>
      </div>
      <div className="flex flex-col w-full gap-4">
        <p>Категорії</p>
        <button className="flex w-full">Figma</button>
        <button className="flex w-full">Framer</button>
        <button className="flex w-full">Webflow</button>
        <button className="flex w-full">Spline</button>
      </div>
    </aside>
  );
}
