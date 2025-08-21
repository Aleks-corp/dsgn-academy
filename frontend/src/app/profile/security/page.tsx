"use client";

import { withUserGuard } from "@/components/guards&providers/WithUserGuard";
// import Button from "@/components/buttons/Button";

function ProfilePage() {
  //   const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      Profile -sec
      {/* <Button type="button" text="Вийти" onClick={handleLogout} /> */}
    </div>
  );
}
export default withUserGuard(ProfilePage);
