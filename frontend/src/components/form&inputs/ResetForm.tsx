"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/redux/hooks";
import { setNewPassword } from "@/redux/auth/auth.thunk";
import { resetPassSchema } from "@/schemas/users.schemas";
import InputWithIcon from "@/components/form&inputs/FormInput";
import ButtonBlack from "@/components/buttons/ButtonsBlack";
import LinkInline from "@/components/links/LinkInline";
import MaskIcon from "@/components/MaskIcon";

type FormValues = {
  password: string;
  confpass: string;
};

export default function ResetForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(resetPassSchema),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerError(null);
    setSubmitting(true);
    const { password } = data;

    try {
      const res = await dispatch(
        setNewPassword({ newPassToken: token, password })
      );

      if (res?.type === "auth/resetpassword/rejected") {
        if (res.payload.status === 400) {
          setServerError(res.payload.data.message);
          return;
        }
      }
      reset();
      router.push("/signin");
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message || "Помилка реєстрації. Спробуйте ще раз.");
      } else {
        setServerError("Невідома помилка. Спробуйте ще раз.");
      }
      console.info("Registration failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-80 mx-auto pt-5"
      noValidate
    >
      <h1 className="font-inter text-center text-[32px] font-normal leading-10 tracking-thinest mb-6">
        Створіть новий пароль
      </h1>
      <p className="mb-6 text-center text-[11px] font-medium text-muted-text leading-4 tracking-[-0.11px]">
        Заповніть поля нижче, для створення нового пароля
      </p>
      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}
      <div className="flex flex-col gap-4 mb-6">
        <label className="font-inter text-xs font-medium text-foreground tracking-[-0.12px]">
          <p className="mb-1.5">Пароль</p>
          <div className="relative">
            <InputWithIcon
              hookformprop={register("password")}
              type={showPass ? "text" : "password"}
              required
              placeholder="Пароль"
              wrapperClassName="w-full"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              type="button"
              tabIndex={-1}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? (
                <MaskIcon
                  src="/icons/menu-icons/eye.svg"
                  className="w-5 h-5 text-muted"
                />
              ) : (
                <MaskIcon
                  src="/icons/menu-icons/eye-closed.svg"
                  className="w-5 h-5 text-muted"
                />
              )}
            </button>
          </div>
          {errors?.password && (
            <p className="mt-1 block text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </label>
        <label className="font-inter text-xs font-medium text-foreground tracking-[-0.12px]">
          <p className="mb-1.5">Повторіть пароль</p>
          <div className="relative">
            <InputWithIcon
              hookformprop={register("confpass")}
              type={showConfPass ? "text" : "password"}
              required
              placeholder="Підтвердіть пароль"
              wrapperClassName="w-full"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfPass(!showConfPass)}
            >
              {showConfPass ? (
                <MaskIcon
                  src="/icons/menu-icons/eye.svg"
                  className="w-5 h-5 text-muted"
                />
              ) : (
                <MaskIcon
                  src="/icons/menu-icons/eye-closed.svg"
                  className="w-5 h-5 text-muted"
                />
              )}
            </button>
          </div>
          {errors?.confpass && (
            <p className="mt-1 block text-xs text-red-600">
              {errors.confpass.message}
            </p>
          )}
        </label>
      </div>
      <ButtonBlack
        type="submit"
        text="Зберегти"
        textPressed="Зберегти"
        pressed={submitting}
      />
      <LinkInline
        href="/signin"
        text="Повернутись до входу"
        className="flex justify-center mt-2.5"
      />
    </form>
  );
}
