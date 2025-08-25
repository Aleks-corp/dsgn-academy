import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { RootState } from "../store";
import {
  IUser,
  IUserReg,
  IUserLog,
  IUserNewPass,
  IUserChangePass,
  IUserForgot,
  IUserName,
} from "../../types/users.type";
import { delToken, instance, setToken } from "../../lib/api/axios";

export const signUp = createAsyncThunk(
  "auth/signup",
  async (userData: IUserReg, thunkAPI) => {
    try {
      const response = await instance.post("/auth/register", userData);
      toast.success("Вітаємо! Ви успішно зареєструвалися!", { duration: 4000 });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          const data = JSON.parse(error.response.config.data);
          toast.error(
            `Електронна пошта: ${data.email} вже використовується. Будь ласка, увійдіть.`,
            { duration: 4000 }
          );
        } else {
          toast.error(`${error.response?.data.message ?? error.message}`, {
            duration: 4000,
          });
        }

        return thunkAPI.rejectWithValue(error.response?.data ?? error.message);
      }
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/login",
  async (userData: IUserLog, thunkAPI) => {
    try {
      const response = await instance.post("/auth/login", userData);
      setToken(response.data.token);
      toast.success("Ви успішно увійшли!", { duration: 4000 });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          `${error.response?.data.message ?? error.message}. Спробуйте ще раз.`,
          {
            duration: 4000,
          }
        );
        return thunkAPI.rejectWithValue(error.response ?? error.message);
      }
    }
  }
);

export const signOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await instance.post("/auth/logout");
    toast.success("Ви успішно вийшли!", {
      duration: 4000,
    });
    delToken();
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        `${error.response?.data.message ?? error.message}. Оновіть сторінку.`,
        {
          duration: 4000,
        }
      );
      return thunkAPI.rejectWithValue(
        error.response?.data.message ?? error.message
      );
    }
  }
});

export const refreshUser = createAsyncThunk<IUser, void, { state: RootState }>(
  "auth/refresh",
  async (_, thunkAPI) => {
    const state: RootState = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (!persistedToken) {
      return thunkAPI.rejectWithValue("Спочатку увійдіть");
    }

    try {
      setToken(persistedToken);
      const response = await instance.get("/auth/current");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // toast.error(
        //   `${error.response?.data.message ?? error.message}. Please try login.`
        // );
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (verificationToken: string, thunkAPI) => {
    try {
      const response = await instance.get(`/auth/verify/${verificationToken}`);
      setToken(response.data.token);
      toast.success("Ви успішно підтвердили свою електронну адресу!", {
        duration: 4000,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // toast.error(`Email or password in not valid. Please try again.`);
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const resendVerifyUser = createAsyncThunk(
  "auth/resendverify",
  async (userData: { email: string }, thunkAPI) => {
    try {
      const response = await instance.post(`/auth/verify`, userData);
      // setToken(response.data.token);
      toast.success("Лист успішно надіслано", { duration: 4000 });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const setNewPassword = createAsyncThunk(
  "auth/resetpassword",
  async (userData: IUserNewPass, thunkAPI) => {
    try {
      const response = await instance.post(
        `/auth/reset-password/${userData.newPassToken}`,
        { newPassword: userData.password }
      );
      toast.success("Ваш пароль успішно змінено!", {
        duration: 4000,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          `${
            error.response?.data.message ?? error.message
          }. Будь ласка, надішліть лист для скидання пароля ще раз.`,
          {
            duration: 4000,
          }
        );

        return thunkAPI.rejectWithValue(error.response ?? error.message);
      }
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotpassword",
  async (userData: IUserForgot, thunkAPI) => {
    try {
      const response = await instance.post("/auth/forgot-password", userData);
      toast.success("Лист успішно надіслано", {
        duration: 4000,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          `${error.response?.data.message ?? error.message} Спробуйте ще раз.`,
          {
            duration: 4000,
          }
        );
        return thunkAPI.rejectWithValue(error.response ?? error.message);
      }
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changepassword",
  async (userData: IUserChangePass, thunkAPI) => {
    try {
      const response = await instance.post("/auth/change-password", userData);
      toast.success("Пароль успішно змінено", {
        duration: 4000,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          `${error.response?.data.message ?? error.message} Спробуйте ще раз.`,
          {
            duration: 4000,
          }
        );
        return thunkAPI.rejectWithValue(error.response ?? error.message);
      }
    }
  }
);

export const changeName = createAsyncThunk(
  "auth/changename",
  async (userData: IUserName, thunkAPI) => {
    try {
      const response = await instance.post("/auth/change-name", userData);
      toast.success("Пароль успішно змінено", {
        duration: 4000,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          `${error.response?.data.message ?? error.message} Спробуйте ще раз.`,
          {
            duration: 4000,
          }
        );
        return thunkAPI.rejectWithValue(error.response ?? error.message);
      }
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  "auth/checkpayment",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get(`/auth/payment-status`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);

export const unsubscribe = createAsyncThunk(
  "auth/unsubscribe",
  async (_, thunkAPI) => {
    try {
      const response = await instance.get(`/auth/unsubscribe`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(
          error.response?.data.message ?? error.message
        );
      }
    }
  }
);
