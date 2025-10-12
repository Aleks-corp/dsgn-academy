"use client";

// import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { signOut } from "@/redux/auth/auth.thunk";
import Button from "@/components/buttons/Button";

import { withAdminGuard } from "@/guards/WithAdminGuard";
import { sendMailToAll } from "@/redux/admin/admin.thunk";
import toast from "react-hot-toast";
// import { handleRouter } from "@/lib/handleRouter";

function AdminPage() {
  const dispatch = useAppDispatch();

  const handleSend = async () => {
    const res = await dispatch(sendMailToAll());
    if (res?.payload.message === "Emails sent") {
      toast.success("Листи відправлено");
    } else {
      toast.error("Помилка відправки листів");
    }
  };

  const handleLogout = () => {
    dispatch(signOut());
  };

  return (
    <div className="w-full">
      <div>Admin Panel</div>
      <br />
      <Button
        type="button"
        text="Розсилка Стріма"
        style="accent"
        onClick={handleSend}
      />
      <br />
      <br />
      <Button type="button" text="Вийти" onClick={handleLogout} />
    </div>
  );
}
export default withAdminGuard(AdminPage);
