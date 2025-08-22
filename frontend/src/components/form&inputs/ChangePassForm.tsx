"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/redux/hooks";
import { changePassword } from "@/redux/auth/auth.thunk";
import InputWithIcon from "@/components/form&inputs/FormInput";
import { changePassSchema } from "@/schemas/users.schemas";
import Button from "@/components/buttons/Button";

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confpass: string;
};

export default function ChangePassForm() {
  const dispatch = useAppDispatch();

  const [showOldPass, setShowOldPass] = useState(false);
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
    resolver: yupResolver(changePassSchema),
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerError(null);
    setSubmitting(true);
    const { oldPassword, newPassword } = data;

    try {
      const res = await dispatch(
        changePassword({
          oldPassword,
          newPassword,
        })
      );

      if (res?.type === "auth/resetpassword/rejected") {
        if (res.payload.status === 400) {
          setServerError(res.payload.data.message);
          return;
        }
      }
      reset();
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
      className="w-full max-w-80"
      noValidate
    >
      {serverError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}
      <div className="flex flex-col gap-4 mb-6">
        <label className="font-inter text-xs font-medium leading-4 tracking-thin">
          <p className="mb-1.5">Введіть старий пароль</p>
          <div className="relative">
            <InputWithIcon
              hookformprop={register("oldPassword")}
              type={showOldPass ? "text" : "password"}
              required
              placeholder="Пароль"
              wrapperClassName="w-full"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              type="button"
              tabIndex={-1}
              onClick={() => setShowOldPass(!showOldPass)}
            >
              {showOldPass ? (
                <Eye size={20} color="#7b7b7b" />
              ) : (
                <EyeClosed size={20} color="#7b7b7b" />
              )}
            </button>
          </div>
          {errors?.oldPassword && (
            <p className="mt-1 block text-xs text-red-600">
              {errors.oldPassword.message}
            </p>
          )}
        </label>

        <label className="font-inter text-xs font-medium leading-4 tracking-thin">
          <p className="mb-1.5">Введіть новий пароль</p>
          <div className="relative">
            <InputWithIcon
              hookformprop={register("newPassword")}
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
          {errors?.newPassword && (
            <p className="mt-1 block text-xs text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </label>
        <label className="font-inter text-xs font-medium leading-4 tracking-thin">
          <p className="mb-1.5">Повторіть новий пароль</p>
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
            <p className="mt-1 block text-xs text-red-600">
              {errors.confpass.message}
            </p>
          )}
        </label>
      </div>
      <Button type="submit" text="Зберегти" disabled={submitting} />
    </form>
  );
}
