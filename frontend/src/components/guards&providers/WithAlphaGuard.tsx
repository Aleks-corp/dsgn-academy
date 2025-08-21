"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import {
  selectIsLoadingTest,
  selectIsAlpha,
  selectIsTester,
} from "@/selectors/test.selectors";
import { selectIsRefreshing } from "@/selectors/auth.selectors";

export function withAlphaGuard<P extends object>(
  Component: React.ComponentType<P>
) {
  return function GuardedComponent(props: P) {
    const isLoading = useAppSelector(selectIsLoadingTest);
    const isRefreshing = useAppSelector(selectIsRefreshing);
    const isAlphaTesting = useAppSelector(selectIsAlpha);
    const isTester = useAppSelector(selectIsTester);
    const router = useRouter();

    useEffect(() => {
      if (isAlphaTesting && !isTester && !isLoading && !isRefreshing) {
        router.push("/timer");
      }
    }, [isAlphaTesting, isLoading, isRefreshing, isTester, router]);

    if (isLoading || isRefreshing) return null;
    if (isAlphaTesting && !isTester) return null;

    return <Component {...props} />;
  };
}
