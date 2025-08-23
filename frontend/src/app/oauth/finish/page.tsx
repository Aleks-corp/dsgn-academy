"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { localLogIn } from "@/redux/auth/authSlice";
import { GetUser } from "@/types/users.type";
import { setToken } from "@/lib/api/axios";
import { selectUser } from "@/redux/selectors/auth.selectors";
import Loader from "@/components/loaders/LoaderCircle";

export default function OAuthFinishPage() {
  const router = useRouter();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);

  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        const backendData: GetUser | undefined = session?.backendData;
        if (!backendData) {
          throw new Error("No user data found");
        }

        dispatch(localLogIn(backendData)); // { token, user }
        setToken(backendData.token);

        router.push("/");
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "OAuth finish failed";
        setError(message);
      }
    })();
  }, [dispatch, router]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  return (
    <div className="w-20 h-20 mt-20 mx-auto">
      <Loader />
    </div>
  );
}
