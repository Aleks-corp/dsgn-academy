import * as yup from "yup";
import { emailRegexp, passRegexp } from "@/constants/user.constants";

export const regSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Не менше 3 символів")
    .max(18, "Не більше 18 символів")
    .required("Це поле є обов’язковим"),
  email: yup
    .string()
    .matches(emailRegexp, "Упс! Це виглядає не як правильна електронна адреса")
    .required("Це поле є обов’язковим"),
  password: yup
    .string()
    .matches(
      passRegexp,
      "Пароль: 8–18 символів, латинські літери й цифри, принаймні одна велика, одна мала літера та одна цифра"
    )
    .required("Це поле є обов’язковим"),
  confpass: yup
    .string()
    .matches(
      passRegexp,
      "Пароль: 8–18 символів, латинські літери й цифри, принаймні одна велика, одна мала літера та одна цифра"
    )
    .oneOf([yup.ref("password")], "Паролі не співпадають")
    .required("Це поле є обов’язковим"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegexp, "Упс! Це виглядає не як правильна електронна адреса")
    .required("Це поле є обов’язковим"),
  password: yup
    .string()
    .matches(
      passRegexp,
      "Пароль: 8–18 символів, латинські літери й цифри, принаймні одна велика, одна мала літера та одна цифра"
    )
    .required("Це поле є обов’язковим"),
});

export const changePassSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .matches(
      passRegexp,
      "Пароль: 8–18 символів, латинські літери й цифри, принаймні одна велика, одна мала літера та одна цифра"
    )
    .required("Це поле є обов’язковим"),
  newPassword: yup
    .string()
    .matches(
      passRegexp,
      "Пароль: 8–18 символів, латинські літери й цифри, принаймні одна велика, одна мала літера та одна цифра"
    )
    .required("Це поле є обов’язковим"),
  confpass: yup
    .string()
    .matches(
      passRegexp,
      "Пароль: 8–18 символів, латинські літери й цифри, принаймні одна велика, одна мала літера та одна цифра"
    )
    .oneOf([yup.ref("newPassword")], "Паролі не співпадають")
    .required("Це поле є обов’язковим"),
});

export const forgotPassSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegexp, "Упс! Це виглядає не як правильна електронна адреса")
    .required("Це поле є обов’язковим"),
});

export const resetPassSchema = yup.object().shape({
  password: yup
    .string()
    .matches(
      passRegexp,
      "Пароль: 8–18 символів, латинські літери й цифри, принаймні одна велика, одна мала літера та одна цифра"
    )
    .required("Це поле є обов’язковим"),
  confpass: yup
    .string()
    .matches(
      passRegexp,
      "Пароль: 8–18 символів, латинські літери й цифри, принаймні одна велика, одна мала літера та одна цифра"
    )
    .oneOf([yup.ref("password")], "Паролі не співпадають")
    .required("Це поле є обов’язковим"),
});
