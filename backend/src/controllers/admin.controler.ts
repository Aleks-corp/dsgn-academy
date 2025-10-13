import "dotenv/config";
import type { Request, Response } from "express";
import type { ObjectId } from "mongoose";
import { ctrlWrapper } from "../decorators/index.js";
import { StreamModel, UserModel } from "../models/index.js";
import {
  checkSubscriptionStatus,
  setSubDate,
  HttpError,
  sendMailToUsers,
} from "../utils/index.js";

const getAllUser = async (req: Request, res: Response): Promise<void> => {
  const { page = "1", limit = "500", filter = "" } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * limitNumber;
  const query = filter ? { subscription: filter } : {};

  const users = await UserModel.find(
    query,
    "-password -token -verificationToken -verify -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt",
    {
      skip,
      limit: limitNumber,
    }
  );
  const totalHits = await UserModel.countDocuments(query);
  res.json({ totalHits, users });
};

const updateUsersSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { usersId, subscription } = req.body;
  const newDate = new Date();
  if (subscription === "free") {
    await Promise.all(
      usersId.map(async (_id: ObjectId) => {
        const user = await UserModel.findOne({ _id });
        if (!user) return;
        await UserModel.findByIdAndUpdate(
          user._id,
          {
            subscription,
            subend: null,
            substart: null,
          },
          {
            new: true,
          }
        );
      })
    );
  }
  if (subscription === "premium") {
    await Promise.all(
      usersId.map(async (id: ObjectId) => {
        const user = await UserModel.findOne({ _id: id });
        if (!user) return;
        const newSubstart = user.substart ? user.substart : newDate;
        const newSubend = !user.subend
          ? setSubDate(newDate.getTime())
          : user.subend.getTime() < newDate.getTime()
          ? setSubDate(newDate.getTime())
          : setSubDate(user.subend.getTime());

        await UserModel.findByIdAndUpdate(
          user._id,
          {
            subscription,
            substart: newSubstart,
            subend: newSubend,
          },
          {
            new: true,
          }
        );
      })
    );
  }

  const updatedUsers = await UserModel.find(
    {},
    "-password -token -verificationToken -verify -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt",
    {
      skip: 0,
      limit: 500,
    }
  );
  const totalHits = await UserModel.countDocuments({});
  res.json({ totalHits, users: updatedUsers });
};

const updateUserSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const newUser = req.body;

  const newDate = new Date();
  const { _id } = newUser;
  const newSubscription = newUser.subscription;
  const user = await UserModel.findOne({ _id });
  if (!user) {
    throw HttpError(400, "Invalid user id");
  }
  if (newSubscription === "admin") {
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        subscription: newSubscription,
      },

      {
        new: true,
      }
    ).select(
      "-password -token -verificationToken -verify -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt"
    );
    res.json(updatedUser);
    return;
  }

  if (newSubscription === "member") {
    const newSubstart = user.substart ? user.substart : newDate;
    const newSubend = newUser.subend;

    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        subscription: newSubscription,
        substart: newSubstart,
        subend: newSubend,
      },
      {
        new: true,
      }
    ).select(
      "-password -token -verificationToken -verify -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt"
    );
    res.json(updatedUser);
    return;
  }

  if (newSubscription === "free") {
    const newSubstart = null;
    const newSubend = null;

    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        subscription: newSubscription,
        substart: newSubstart,
        subend: newSubend,
      },
      {
        new: true,
      }
    ).select(
      "-password -token -verificationToken -verify -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt"
    );
    res.json(updatedUser);
    return;
  }
  res.json({ message: "User not changed" });
};

const checkUsersSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { usersId } = req.body;
  await Promise.all(
    usersId.map(async (_id: ObjectId) => {
      const user = await UserModel.findById(_id);
      if (!user) return;
      const updatedUser = await checkSubscriptionStatus(user);
      return updatedUser;
    })
  );

  const updatedUsers = await UserModel.find(
    {},
    "-password -token -verificationToken -verify -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt",
    {
      skip: 0,
      limit: 500,
    }
  );
  const totalHits = await UserModel.countDocuments({});
  res.json({ totalHits, users: updatedUsers });
};

const updateUserBlockStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { usersId } = req.body;
  await Promise.all(
    usersId.map(async (_id: ObjectId) => {
      const user = await UserModel.findById(_id);
      if (!user) {
        throw HttpError(404, "User not found");
      }
      const isBlocked = !user.isBlocked;
      const updateData = isBlocked ? { isBlocked, token: "" } : { isBlocked };

      await UserModel.findByIdAndUpdate(_id, updateData, {
        new: true,
      });
    })
  );
  const updatedUsers = await UserModel.find(
    {},
    "-password -token -verificationToken -verify -resetPasswordToken -resetPasswordExpires -createdAt -updatedAt",
    {
      skip: 0,
      limit: 500,
    }
  );
  const totalHits = await UserModel.countDocuments({});
  res.json({ totalHits, users: updatedUsers });
};

const sentMailToUsers = async (req: Request, res: Response): Promise<void> => {
  const BATCH_SIZE = 50; // по 50 за раз
  const PAUSE_MS = 30000; // 30 секунд між пачками (збільши якщо ще буде рвати)
  const users = await UserModel.find({});
  const stream = await StreamModel.findOne({});
  const sent: string[] = [];
  const failed: string[] = [];
  if (!stream) {
    res.status(400).json({ message: "Stream not found" });
    return;
  }
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (user) => {
        if (user.subscription === "admin") return;
        try {
          // const updatedUser = await checkSubscriptionStatus(user);
          await sendMailToUsers({ user, stream });
          sent.push(user.email);
        } catch (e) {
          failed.push(user.email);
          if (e instanceof Error) {
            console.log("❌ Error:", user.email, e.message);
          }
        }
      })
    );

    if (i + BATCH_SIZE < users.length) {
      console.log(`⌛ Waiting ${PAUSE_MS / 1000}s before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
    }
  }
  res.json({
    message: "Emails sent",
    sent: sent.length,
    failed: failed.length,
    failedEmails: failed,
  });
};

export default {
  getAllUser: ctrlWrapper(getAllUser),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  updateUsersSubscription: ctrlWrapper(updateUsersSubscription),
  checkUsersSubscription: ctrlWrapper(checkUsersSubscription),
  updateUserBlockStatus: ctrlWrapper(updateUserBlockStatus),
  sentMailToUsers: ctrlWrapper(sentMailToUsers),
};
