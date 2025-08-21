"use client";

import { signOut } from "@/redux/auth/auth.thunk";
import { useAppDispatch } from "@/redux/hooks";

import Button from "@/components/buttons/Button";
import { withUserGuard } from "@/components/guards&providers/WithUserGuard";

function ProfilePage() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(signOut());
  };

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      Профіль
      <Button type="button" text="Вийти" onClick={handleLogout} />
    </div>
  );
}
export default withUserGuard(ProfilePage);
