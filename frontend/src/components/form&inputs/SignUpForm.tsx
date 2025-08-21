"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/redux/hooks";
import { signUp } from "@/redux/auth/auth.thunk";
import InputWithIcon from "@/components/form&inputs/FormInput";
import { regSchema } from "@/schemas/users.schemas";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confpass: string;
};

type SignUpSuccess = { ok: true };
type SignUpError = { ok: false; message: string };
type SignUpResult = SignUpSuccess | SignUpError;

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState<"google" | "linkedin" | null>(null);

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
    resolver: yupResolver(regSchema),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerError(null);
    setSubmitting(true);
    const { name, email, password } = data;

    try {
      const res = (await dispatch(
        signUp({ name, email: email.toLowerCase(), password })
      ).unwrap()) as SignUpResult;

      if (!("ok" in res) || res.ok !== true) {
        throw new Error(res?.message || "Помилка реєстрації.");
      }

      reset();
      router.push("/verify?token=0");
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
      <h1 className="text-center text-2xl font-semibold mb-10">
        Створіть свій акаунт
      </h1>
      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="btn-gradient inline-flex justify-center items-center gap-2 py-2 px-5 rounded-[10px] font-inter font-semibold text-sm tracking-[-0.28px] shadow-btn cursor-pointer"
          onClick={() => {
            signIn("google", { callbackUrl: "/oauth/finish" });
            setLoading("google");
          }}
          disabled={!!loading}
        >
          <Image
            src={"/icons/reglog/google.svg"}
            alt="Google Logo"
            width={24}
            height={24}
          />
          {loading === "google"
            ? "Реєстрація через Google..."
            : "Зареєструватися через Google"}
        </button>
        <button
          type="button"
          className="btn-gradient inline-flex justify-center items-center gap-2 py-2 px-5 rounded-[10px] font-inter font-semibold text-sm tracking-[-0.28px] shadow-btn cursor-pointer"
          onClick={() => {
            signIn("linkedin", { callbackUrl: "/oauth/finish" });
            setLoading("linkedin");
          }}
          disabled={!!loading}
        >
          <Image
            src={"/icons/reglog/linkedin.svg"}
            alt="LinkedIn Logo"
            width={24}
            height={24}
          />
          {loading === "linkedin"
            ? "Реєстрація через LinkedIn..."
            : "Зареєструватися через LinkedIn"}
        </button>
      </div>
      <p className="my-6 text-center text-[11px] font-medium text-muted leading-4 tracking-[-0.11px]">
        Заповніть поля нижче, ми надішлемо лист підтвердження.
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
          <p className="mb-2">Ім&apos;я</p>
          <InputWithIcon
            hookformprop={register("name")}
            type="text"
            required
            placeholder="Ваше Ім'я"
            wrapperClassName="w-full"
          />
          {errors?.name && (
            <p className="mt-1 block text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </label>
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
        <label className="font-inter text-xs font-medium text-foreground tracking-[-0.12px]">
          <p className="mb-2">Пароль</p>
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
              {showPass ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
          </div>
          {errors?.password && (
            <p className="mt-1 block text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </label>
        <label className="font-inter text-xs font-medium text-foreground tracking-[-0.12px]">
          <p className="mb-2">Повторіть пароль</p>
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
              {showConfPass ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
          </div>
          {errors?.confpass && (
            <p className="mt-1 block text-xs text-red-600">
              {errors.confpass.message}
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
          {submitting ? "Реєстрація…" : "Зареєструватися"}
        </p>
      </button>
      <Link
        href="/signin"
        className="flex justify-center font-inter font-medium text-[11px] text-muted tracking-[-0.11px] mt-4"
      >
        Вже маєте акаунт?
      </Link>
    </form>
  );
}
