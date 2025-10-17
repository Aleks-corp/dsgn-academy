"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeName, signOut } from "@/redux/auth/auth.thunk";
import { setNewName } from "@/redux/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { withUserGuard } from "@/guards/WithUserGuard";
// import Image from "next/image";
// import Button from "@/components/buttons/Button";
import { selectUser } from "@/selectors/auth.selectors";
import {
  userSubscriptionConst,
  userSubscriptionConstText,
} from "@/constants/user.constants";
import { formatDateToDDMMYYYY } from "@/lib/date.utils";
import Input from "@/components/form&inputs/Input";
import Button from "@/components/buttons/Button";
import MaskIcon from "@/components/MaskIcon";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUser);
  const [name, setName] = useState(profile?.name);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const handleLogout = () => {
    dispatch(signOut());
  };

  const handleEdit = async () => {
    try {
      if (name && name.length >= 3 && name.length <= 18) {
        const res = await dispatch(changeName({ name }));
        if (res.meta && res.meta.requestStatus === "fulfilled") {
          if (res.payload.name) {
            setNewName(res.payload.name);
          }
        }

        toast.success("Ваше ім'я успішно змінено");
        setVisibleEdit(!visibleEdit);
      } else {
        toast.error(
          "І'мя має складатись з не менше ніж 3 символів і не більше 18 символів"
        );
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-8 w-full max-w-md mx-auto lg:mx-0">
        <h2 className="font-inter text-xl text-foreground font-medium leading-7 tracking-[-0.6px] ">
          Профіль
        </h2>
        {/* <div className="flex justify-between items-center">
          <div>
            <p className="mb-2 font-inter text-xs font-medium leading-4 tracking-[-0.12px]">
              Аватар
            </p>
            <p className="font-inter text-[11px] font-medium leading-4 tracking-[-0.11px] text-muted-text">
              рекомендований розмір 150x150 px (PNG/JPG)
            </p>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={profile.avatar ? profile.avatar : "/images/avatar.jpg"}
              width={48}
              height={48}
              alt="Аватар"
            />
          </div>
        </div> */}
        <div className="flex justify-between items-center">
          <p className="font-inter text-xs font-medium leading-4 tracking-[-0.12px]">
            І&apos;мя
          </p>
          <div className="flex gap-2 items-center">
            <AnimatePresence>
              {visibleEdit ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-2 items-center"
                >
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="max-w-52 max-h-10"
                  />
                  <Button
                    text="Змінити"
                    type="button"
                    disabled={!name}
                    onClick={handleEdit}
                  />
                  <div>
                    <button
                      type="button"
                      disabled={!name}
                      onClick={() => setVisibleEdit(false)}
                      className="w-10 h-10 flex justify-center items-center cursor-pointer"
                    >
                      <MaskIcon
                        src="icons/nav-icons/xmark.svg"
                        className="w-5 h-5 text-muted"
                      />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-2 items-center"
                >
                  <p className="font-inter text-xs font-medium leading-4 tracking-[-0.12px]">
                    {name}
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleEdit(true)}
                    className="w-10 h-10 flex justify-center items-center cursor-pointer"
                  >
                    <MaskIcon
                      src="icons/nav-icons/edit-pencil.svg"
                      className="w-4 h-4 text-muted"
                    />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-inter text-xs font-medium leading-4 tracking-[-0.12px]">
            Електронна пошта
          </p>
          <p className="font-inter text-xs font-medium leading-4 tracking-[-0.12px] text-muted-text">
            {profile.email}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-inter text-xs font-medium leading-4 tracking-[-0.12px]">
            Статус підписки
          </p>
          <p className="ont-inter text-xs font-medium leading-4 tracking-[-0.12px] text-muted">
            Ваш тариф: {userSubscriptionConstText[profile.subscription]}
            {profile.subend &&
            profile.subscription !== userSubscriptionConst.FREE &&
            profile.subscription !== userSubscriptionConst.ADMIN
              ? ` до ${formatDateToDDMMYYYY(profile.subend)}`
              : ""}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex font-inter text-xs font-medium leading-4 tracking-[-0.12px] text-muted-text hover:text-foreground transition-all duration-300 cursor-pointer"
          onClick={handleLogout}
        >
          Вийти з акаунта
        </button>
      </div>
    </div>
  );
}
export default withUserGuard(ProfilePage);
