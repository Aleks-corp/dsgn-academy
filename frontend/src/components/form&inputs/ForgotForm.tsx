"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/redux/hooks";
import { forgotPassword } from "@/redux/auth/auth.thunk";
import InputWithIcon from "@/components/form&inputs/FormInput";
import { forgotPassSchema } from "@/schemas/users.schemas";

type FormValues = {
  email: string;
};

export default function Forgotorm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(forgotPassSchema),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerError(null);
    setSubmitting(true);
    const { email } = data;
    try {
      const res = await dispatch(
        forgotPassword({ email: email.toLowerCase() })
      );

      if (res?.type === "auth/forgotpassword/rejected") {
        if (res.payload.status === 404) {
          setServerError(res.payload.data.message);
        }
        return;
      } else {
        reset();
        router.push("/signin");
      }
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message || "Помилка входу. Спробуйте ще раз.");
      } else {
        setServerError("Невідома помилка. Спробуйте ще раз.");
      }
      console.info("Login failed", err);
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
      <h1 className="text-center text-2xl font-normal mb-12">Забули пароль</h1>

      <p className="my-6 text-center text-[11px] font-medium text-muted leading-4 tracking-[-0.11px]">
        Введіть електронну пошту для відновлення
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
          <p className="mb-2">Електронна пошта</p>
          <InputWithIcon
            hookformprop={register("email")}
            type="email"
            required
            placeholder="example@mail.com"
            wrapperClassName="w-full"
          />
          {errors?.email && (
            <p className="mt-1 block text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full justify-center items-center gap-1 py-4 px-5 rounded-xl shadow-btn cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-[#323232]"
      >
        <p className="font-inter text-sm font-semibold text-icon">
          {submitting ? "Відправка…" : "Відправити"}
        </p>
      </button>
      <Link
        href="/signin"
        className="flex justify-center font-inter font-medium text-[11px] text-muted tracking-[-0.11px] mt-4"
      >
        Повернутись до входу
      </Link>
    </form>
  );
}
