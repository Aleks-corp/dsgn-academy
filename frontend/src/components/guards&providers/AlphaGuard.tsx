"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import {
  selectIsAlpha,
  selectIsTester,
  selectIsLoadingTest,
} from "@/selectors/test.selectors";

export function AlphaGuard({ children }: { children: React.ReactNode }) {
  const isLoading = useAppSelector(selectIsLoadingTest);
  const isAlphaTesting = useAppSelector(selectIsAlpha);
  const isTester = useAppSelector(selectIsTester);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAlphaTesting && !isTester) {
      router.push("/timer");
    }
  }, [isLoading, isAlphaTesting, isTester, router]);

  return <>{children}</>;
}
