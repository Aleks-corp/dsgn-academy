"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { withAdminGuard } from "@/guards/WithAdminGuard";

function PaymentSuccessPage() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    timerRef.current = setTimeout(() => router.push("/"), 6000);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="bg-text-white mx-auto max-w-[548px] rounded-3xl shadow pt-10 pb-16 px-10 text-center">
        <h1 className="text-2xl font-medium leading-7 tracking-thinest text-[#25A22B] mb-4">
          Оплата пройшла успішно
        </h1>
        <p className="text-lg leading-7 text-muted-foreground">
          Дякуємо, що обрали нас!
        </p>
        <p className="text-lg leading-7 text-muted-foreground">
          Ваша підписка активована. <br />
          Ви не лише отримали доступ до матеріалів, а й підтримали розвиток
          україномовного контенту для дизайнерів 💙💛.
        </p>
      </div>
    </div>
  );
}
export default withAdminGuard(PaymentSuccessPage);
