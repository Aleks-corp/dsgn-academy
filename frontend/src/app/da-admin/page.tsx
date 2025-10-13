"use client";

// import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { signOut } from "@/redux/auth/auth.thunk";
import Button from "@/components/buttons/Button";

import { withAdminGuard } from "@/guards/WithAdminGuard";
import { sendMailToAll } from "@/redux/admin/admin.thunk";
import toast from "react-hot-toast";
import { useState } from "react";
// import { handleRouter } from "@/lib/handleRouter";

function AdminPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    const res = await dispatch(sendMailToAll());
    if (res?.payload.message === "Emails sent") {
      const sent = res.payload.sent || 0;
      const failed = res.payload.failed || 0;
      const failedEmails = res.payload.failedEmails || [];

      // Тостер на 2 хвилини
      toast.success(
        `✅ Відправлено: ${sent}\n❌ Не відправлено: ${failed}${
          failed > 0 ? `\nДеталі у консолі.` : ""
        }`,
        {
          duration: 120000,
          style: {
            whiteSpace: "pre-line", // Щоб \n працювали
          },
        }
      );

      // Додатково alert (за бажанням)
      if (failed > 0) {
        alert(
          `Відправлено: ${sent}\nНе відправлено: ${failed}\n\nНе доставлені листи:\n${failedEmails.join(
            ", "
          )}`
        );
      }
    } else {
      toast.error("Помилка відправки листів", { duration: 10000 });
      alert("Сталася помилка під час відправки листів.");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    dispatch(signOut());
  };

  return (
    <div className="w-full">
      <div>Admin Panel</div>
      <br />
      <p>
        Не відправляти часто, відправка йде по 50 шт з паузою, й може займати
        10-15 хв
      </p>
      <Button
        type="button"
        text="Розсилка Стріма"
        style="accent"
        onClick={handleSend}
        disabled={isLoading}
      />
      {isLoading && " Відправка..."}
      <br />
      <br />
      <Button type="button" text="Вийти" onClick={handleLogout} />
    </div>
  );
}
export default withAdminGuard(AdminPage);
