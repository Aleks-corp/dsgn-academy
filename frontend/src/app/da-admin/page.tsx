"use client";

// import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { signOut } from "@/redux/auth/auth.thunk";
import Button from "@/components/buttons/Button";

import { withAdminGuard } from "@/guards&providers/WithAdminGuard";
// import { handleRouter } from "@/lib/handleRouter";

function AdminPage() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(signOut());
  };

  return (
    <div className="w-full">
      <p>Admin Page</p>
      <Button type="button" text="Вийти" onClick={handleLogout} />
    </div>
  );
}
export default withAdminGuard(AdminPage);
// export default AdminPage;
