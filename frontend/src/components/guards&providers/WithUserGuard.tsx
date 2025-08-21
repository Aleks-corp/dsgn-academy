"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import {
  selectUser,
  selectIsLogining,
  selectIsRefreshing,
} from "@/selectors/auth.selectors";

export function withUserGuard<P extends object>(
  Component: React.ComponentType<P>
) {
  return function GuardedComponent(props: P) {
    const isLoading = useAppSelector(selectIsLogining);
    const isRefreshing = useAppSelector(selectIsRefreshing);
    const user = useAppSelector(selectUser);
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isRefreshing && !user) {
        router.push("/");
      }
    }, [isLoading, isRefreshing, router, user]);

    if (isLoading || isRefreshing) return null;
    if (!user) return null;

    return <Component {...props} />;
  };
}
