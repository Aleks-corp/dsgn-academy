"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/redux/hooks";
import { forgotPassword } from "@/redux/auth/auth.thunk";
import InputWithIcon from "@/components/form&inputs/FormInput";
import { forgotPassSchema } from "@/schemas/users.schemas";
import LinkInline from "@/components/links/LinkInline";
import ButtonBlack from "@/components/buttons/ButtonsBlack";

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
      <h1 className="font-inter text-center text-[32px] font-normal leading-10 tracking-thinest mb-6">
        Забули пароль
      </h1>

      <p className="mb-6 text-center text-[11px] font-medium text-muted-text leading-4 tracking-thin">
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
        <label className="font-inter text-xs font-medium text-foreground tracking-thin">
          <p className="mb-1.5">Електронна пошта</p>
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
      <ButtonBlack
        type="submit"
        text="Відновити пароль"
        textPressed="Відновлюємо..."
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
