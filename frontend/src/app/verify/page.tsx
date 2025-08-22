"use client";

import { useEffect, useState } from "react";
import { verifyUser } from "@/redux/auth/auth.thunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectIsLoggedIn,
  selectIsLogining,
  selectUserError,
} from "@/selectors/auth.selectors";
import Loader from "@/components/loaders/LoaderCircle";
import { useSearchParams } from "next/navigation";
import NavLink from "@/components/links/Link";
import NotFoundComponent from "@/components/notFound/NotFound";
import Image from "next/image";

const VerifyPage = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isLoggining = useAppSelector(selectIsLogining);
  const [verifyMessage, setVerifyMessage] = useState("");
  const error = useAppSelector(selectUserError);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    (async function fetchVerify() {
      if (token && token !== "0" && typeof token === "string") {
        try {
          const res = await dispatch(verifyUser(token));

          if (res?.type === "auth/verify/rejected") {
            setVerifyMessage(res.payload);
          } else {
            setVerifyMessage(res.payload.message);
          }
        } catch (err) {
          if (err instanceof Error) {
            setVerifyMessage(
              err.message || "Помилка верифікації. Спробуйте ще раз."
            );
          }
          console.info("Registration failed", err);
        }
      }
    })();
  }, [dispatch, token]);

  return (
    <div className="flex w-full max-h-[690px]">
      {isLoggining && (
        <div className="w-20 h-20 mt-20">
          <Loader />
        </div>
      )}
      {verifyMessage !== "Користувача не знайдено" && token && !isLoggining && (
        <>
          <div className="w-full lg:w-[45%]">
            {token === "0" && verifyMessage !== "Верифікацію вже пройдено" && (
              <h3 className="font-inter text-xl font-normal mt-6">
                Перевірте пошту
                <br /> для підтвердження акаунта
              </h3>
            )}
            {!isLoggining && verifyMessage === "Верифікацію пройдено" && (
              <div className="mt-6 flex flex-col gap-10 items-center">
                <h3 className="font-inter text-xl">Підтвердження успішне</h3>
                <div>
                  <NavLink text="Увійти" rout="/signin" />
                </div>
              </div>
            )}
            {isLoggining && !error && <Loader />}

            {verifyMessage === "Верифікацію вже пройдено" &&
              !isLoggining &&
              !isLoggedIn && (
                <div className="mt-6 flex flex-col gap-10 items-center">
                  <h3 className="font-inter text-xl">
                    Акаунт уже підтверджено
                  </h3>
                  <div>
                    <NavLink text="Увійти" rout="/signin" />
                  </div>
                </div>
              )}
          </div>
          <div className="w-0 lg:w-[55%] overflow-hidden rounded-xl">
            <Image
              src={"/images/reglog.jpg"}
              alt="Registration Logo"
              width={2340}
              height={2280}
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
        </>
      )}
      {(verifyMessage === "Користувача не знайдено" || !token) &&
        !isLoggining && <NotFoundComponent />}
    </div>
  );
};

export default VerifyPage;
