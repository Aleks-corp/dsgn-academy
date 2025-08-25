"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import {
  selectIsAdmin,
  selectIsLogining,
  selectIsRefreshing,
} from "@/selectors/auth.selectors";

export function withAdminGuard<P extends object>(
  Component: React.ComponentType<P>
) {
  return function GuardedComponent(props: P) {
    const isLoading = useAppSelector(selectIsLogining);
    const isRefreshing = useAppSelector(selectIsRefreshing);
    const isAdmin = useAppSelector(selectIsAdmin);
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isRefreshing && !isAdmin) {
        router.push("/");
      }
    }, [isLoading, isRefreshing, isAdmin, router]);

    if (isLoading || isRefreshing) return null;
    if (!isAdmin) return null;

    return <Component {...props} />;
  };
}
