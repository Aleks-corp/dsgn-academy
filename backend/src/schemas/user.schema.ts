import Joi from "joi";

import {
  emailRegexp,
  passRegexp,
  userSubscription,
} from "../constants/user.constant.js";
import tempEmailDomainsSet from "../constants/tempEmailDomainsSet.js";

const usersRegSchema = Joi.object({
  name: Joi.string().required().min(3).max(18).messages({
    "string.empty": `'name' cannot be an empty field`,
    "any.required": `missing required 'name' field`,
  }),
  email: Joi.string()
    .pattern(emailRegexp)
    .required()
    .custom((value, helpers) => {
      const domain = value.split("@")[1]?.toLowerCase();
      if (tempEmailDomainsSet.has(domain)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.pattern.base": `'email' should be a type of 'email'`,
      "string.empty": `'email' cannot be an empty field`,
      "any.required": `missing required 'email' field`,
      "any.invalid": `Temporary emails are not allowed`,
    }),
  password: Joi.string()
    .min(8)
    .max(18)
    .pattern(passRegexp)
    .required()
    .messages({
      "string.pattern.base":
        "Пароль має містити 8-18 символів, хоча б одну велику та малу літеру і одну цифру",
      "string.empty": "Пароль не може бути пустим",
      "any.required": "Поле 'password' є обов’язковим",
    }),
});

const usersLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": `'email' should be a type of 'email'`,
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
  }),
  password: Joi.string()
    .min(8)
    .max(18)
    .pattern(passRegexp)
    .required()
    .messages({
      "string.pattern.base":
        "Пароль має містити 8-18 символів, хоча б одну велику та малу літеру і одну цифру",
      "string.empty": "Пароль не може бути пустим",
      "any.required": "Поле 'password' є обов’язковим",
    }),
});

const usersUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...userSubscription)
    .required()
    .messages({
      "string.empty": `'subscription' cannot be an empty field`,
      "any.required": `missing required 'subscription' field`,
    }),
  usersId: Joi.array().items(Joi.string()),
});

const usersCheckSubscriptionSchema = Joi.object({
  usersId: Joi.array().items(Joi.string()),
});

const usersVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": `'email' should be a type of 'email'`,
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
  }),
});

const passwordResetSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .max(18)
    .pattern(passRegexp)
    .required()
    .messages({
      "string.pattern.base": `'newPassword' contain minimum 8 characters, at least one uppercase letter, one lowercase letter and one number`,
      "string.empty": `'newPassword' cannot be an empty field`,
      "any.required": `missing required 'newPassword' field`,
    }),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .max(18)
    .pattern(passRegexp)
    .required()
    .messages({
      "string.pattern.base": `'oldPassword' contain minimum 8 characters, at least one uppercase letter, one lowercase letter and one number`,
      "string.empty": `'oldPassword' cannot be an empty field`,
      "any.required": `missing required 'oldPassword' field`,
    }),
  newPassword: Joi.string()
    .min(8)
    .max(16)
    .pattern(passRegexp)
    .required()
    .messages({
      "string.pattern.base": `'newPassword' contain minimum 8 characters, at least one uppercase letter, one lowercase letter and one number`,
      "string.empty": `'newPassword' cannot be an empty field`,
      "any.required": `missing required 'newPassword' field`,
    }),
});

export default {
  usersRegSchema,
  usersLoginSchema,
  usersUpdateSubscriptionSchema,
  usersVerifySchema,
  passwordResetSchema,
  changePasswordSchema,
  usersCheckSubscriptionSchema,
};
