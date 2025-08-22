"use client";

import { withUserGuard } from "@/components/guards&providers/WithUserGuard";
import FreeSubProfile from "@/components/subscription/Free";
import PremiumSubProfile from "@/components/subscription/Premium";
import RemovedSubProfile from "@/components/subscription/Removed";
import TestSubProfile from "@/components/subscription/Tester";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/selectors/auth.selectors";

function ProfileSubPage() {
  //   const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUser);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-4 w-full mx-auto lg:mx-0">
        <h2 className="font-inter text-xl text-foreground font-medium leading-5 tracking-thinest ">
          Підписка
        </h2>
        <div className="flex gap-4">
          {profile && <FreeSubProfile />}
          {profile && <PremiumSubProfile profile={profile} />}
          {profile && <RemovedSubProfile profile={profile} />}
          {profile && <TestSubProfile profile={profile} />}
        </div>
      </div>
    </div>
  );
}
export default withUserGuard(ProfileSubPage);
