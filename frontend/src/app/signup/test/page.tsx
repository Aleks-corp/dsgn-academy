"use client";

import { useEffect, useRef } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectIsLoadingTest,
  selectIsTester,
} from "@/selectors/test.selectors";
import { isTester } from "@/redux/test/test.thunk";

export default function SignInPage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoadingTest);
  const isTesterApproved = useAppSelector(selectIsTester);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const checkedRef = useRef(false);

  useEffect(() => {
    if (!token || token === "" || checkedRef.current) return;

    console.log("🚀 ~ count:useEffect isTester");
    checkedRef.current = true;
    console.log("🚀 ~ checkedRef:", checkedRef.current);
    dispatch(isTester(token));
  }, [dispatch, token]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center mt-20">
        Перевіряємо...
      </div>
    );
  }
  if (isTesterApproved) {
    console.info({
      message:
        "Start to beta testing. PS: save this link to enter again - https://dsgn.academy/signin/test?token=5735350defcbab52",
    });
    redirect("/signup");
  }

  return (
    <div className="flex flex-col gap-5 items-center justify-center mt-20">
      Нажаль сталась помилка перевірки
    </div>
  );
}
