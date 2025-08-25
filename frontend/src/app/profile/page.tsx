"use client";

import { signOut } from "@/redux/auth/auth.thunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { withUserGuard } from "@/guards/WithUserGuard";
// import Image from "next/image";
// import Button from "@/components/buttons/Button";
import { selectUser } from "@/redux/selectors/auth.selectors";
import { Pencil } from "lucide-react";
import {
  userSubscriptionConst,
  userSubscriptionConstText,
} from "@/constants/user.constants";
import { formatDateToDDMMYYYY } from "@/lib/date.utils";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(signOut());
  };

  const editNameHandler = async () => {};

  if (!profile) {
    return null;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-8 w-full max-w-96 mx-auto lg:mx-0">
        <h2 className="font-inter text-xl text-foreground font-medium leading-5 tracking-[-0.6px] ">
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
            <p className="font-inter text-xs font-medium leading-4 tracking-[-0.12px]">
              {profile.name}
            </p>
            <button type="button" onClick={editNameHandler}>
              <Pencil
                size={14}
                strokeWidth={1.5}
                absoluteStrokeWidth
                color="#7b7b7b"
              />
            </button>
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

        {/* <Button type="button" text="Вийти" onClick={handleLogout} /> */}
      </div>
      <button
        type="button"
        className="inline-flex mt-8 font-inter text-xs font-medium leading-4 tracking-[-0.12px] text-muted-text hover:text-foreground transition-all duration-300 cursor-pointer"
        onClick={handleLogout}
      >
        Вийти з акаунта
      </button>
    </div>
  );
}
export default withUserGuard(ProfilePage);
