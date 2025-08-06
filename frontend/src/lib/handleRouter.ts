import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleRouter = (router: AppRouterInstance, rout: string) => {
  router.push(rout);
};
