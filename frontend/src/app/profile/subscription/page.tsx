"use client";

import { withUserGuard } from "@/guards&providers/WithUserGuard";
import FreeSubProfile from "@/components/subscription/Free";
import PremiumSubProfile from "@/components/subscription/Premium";
import RemovedSubProfile from "@/components/subscription/Removed";
import TestSubProfile from "@/components/subscription/Tester";
import { userSubscriptionConst } from "@/constants/user.constants";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/selectors/auth.selectors";

function ProfileSubPage() {
  const profile = useAppSelector(selectUser);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full min-w-[358px] max-w-[396px] mx-auto lg:mx-0">
        <h2 className="font-inter text-xl text-foreground font-medium leading-7 tracking-thinest ">
          Підписка
        </h2>
        <div className="flex gap-4 flex-wrap">
          {profile && profile.subscription === userSubscriptionConst.FREE && (
            <FreeSubProfile />
          )}
          {profile &&
            profile.subscription === userSubscriptionConst.PREMIUM &&
            profile.status === "Active" &&
            profile.lastPayedStatus !== "Declined" && (
              <PremiumSubProfile profile={profile} />
            )}
          {profile &&
            profile.subscription === userSubscriptionConst.PREMIUM &&
            (profile.status === "Removed" ||
              profile.lastPayedStatus === "Declined") && (
              <RemovedSubProfile profile={profile} />
            )}
          {profile && profile.subscription === userSubscriptionConst.TESTER && (
            <TestSubProfile profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
export default withUserGuard(ProfileSubPage);
