"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/redux/hooks";
import { signUp } from "@/redux/auth/auth.thunk";
import InputWithIcon from "@/components/form&inputs/FormInput";
import { regSchema } from "@/schemas/users.schemas";
import ButtonBlack from "@/components/buttons/ButtonsBlack";
import LinkInline from "@/components/links/LinkInline";

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
  const params = useSearchParams();
  const error = params.get("error");

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
      className="w-full max-w-80 mx-auto"
      noValidate
    >
      <h1 className="font-inter text-center text-[32px] font-normal leading-10 tracking-thinest mb-6">
        Створіть свій акаунт
      </h1>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="btn-gradient inline-flex justify-center items-center gap-2 py-2 px-5 rounded-[10px] font-inter font-semibold text-sm tracking-thiner shadow-btn cursor-pointer"
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
          className="btn-gradient inline-flex justify-center items-center gap-2 py-2 px-5 rounded-[10px] font-inter font-semibold text-sm tracking-thiner shadow-btn cursor-pointer"
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
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 tracking-thin"
          >
            {error === "OAuthCallback"
              ? "Помилка авторизації. Спробуйте ще раз."
              : "Не вдалося увійти. Повторіть спробу."}
          </div>
        )}
      </div>
      <p className="my-6 text-center text-[11px] font-medium text-muted-text leading-4 tracking-thin">
        Або зареєструйтеся за допомогою електронної пошти
      </p>
      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 tracking-thin"
        >
          {serverError}
        </div>
      )}
      <div className="flex flex-col gap-4 mb-6">
        <label className="font-inter text-xs font-medium text-foreground tracking-tracking-thin">
          <p className="mb-1.5">Ім&apos;я</p>
          <InputWithIcon
            hookformprop={register("name")}
            type="text"
            required
            placeholder="Ваше Ім'я"
            wrapperClassName="w-full"
          />
          {errors?.name && (
            <p className="mt-1 block text-xs text-red-600 tracking-thin">
              {errors.name.message}
            </p>
          )}
        </label>
        <label className="font-inter text-xs font-medium text-foreground tracking-tracking-thin">
          <p className="mb-1.5">Електронна пошта</p>
          <InputWithIcon
            hookformprop={register("email")}
            type="email"
            required
            placeholder="example@mail.com"
            wrapperClassName="w-full"
          />
          {errors?.email && (
            <p className="mt-1 block text-xs text-red-600 tracking-thin">
              {errors.email.message}
            </p>
          )}
        </label>
        <label className="font-inter text-xs font-medium text-foreground tracking-tracking-thin">
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
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              type="button"
              tabIndex={-1}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? (
                <Eye size={20} color="#7b7b7b" />
              ) : (
                <EyeClosed size={20} color="#7b7b7b" />
              )}
            </button>
          </div>
          {errors?.password && (
            <p className="mt-1 block text-xs text-red-600 tracking-thin">
              {errors.password.message}
            </p>
          )}
        </label>
        <label className="font-inter text-xs font-medium text-foreground tracking-tracking-thin">
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
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfPass(!showConfPass)}
            >
              {showConfPass ? (
                <Eye size={20} color="#7b7b7b" />
              ) : (
                <EyeClosed size={20} color="#7b7b7b" />
              )}
            </button>
          </div>
          {errors?.confpass && (
            <p className="mt-1 block text-xs text-red-600 tracking-thin">
              {errors.confpass.message}
            </p>
          )}
        </label>
      </div>
      <ButtonBlack
        text="Створити акаунт"
        textPressed="Реєстрація…"
        pressed={submitting}
        type="submit"
        className=""
      />
      <LinkInline
        href="/signin"
        text=" Вже маєте акаунт?"
        className="flex justify-center mt-2.5"
      />
    </form>
  );
}
