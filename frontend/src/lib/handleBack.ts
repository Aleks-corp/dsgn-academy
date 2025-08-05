import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleBack = (router: AppRouterInstance) => {
  if (typeof window !== "undefined") {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }
};
