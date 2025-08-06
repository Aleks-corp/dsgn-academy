"use client";

import { useState } from "react";
import IconInput from "./InputIcon";
import HeaderTimer from "./HeaderTimer";
import { useAppSelector } from "@/redux/hooks";
import { selectIsAlpha } from "@/selector/test.selectors";

export default function Header() {
  const isAlphaTesting = useAppSelector(selectIsAlpha);
  const [search, setSearch] = useState("");
  return isAlphaTesting ? (
    <HeaderTimer />
  ) : (
    <header className="flex justify-center w-full">
      <div className="flex w-full mx-auto items-center justify-between gap-6 flex-wrap">
        <label>
          <IconInput
            type="text"
            placeholder="Пошук"
            value={search}
            onChange={setSearch}
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
                  stroke="#717179"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </label>
        <div className="flex gap-4 ">
          <button className=" ">Про проект</button>
          <button className=" ">Преміум доступ</button>
          <button className=" ">Увійти</button>
        </div>
      </div>
    </header>
  );
}
