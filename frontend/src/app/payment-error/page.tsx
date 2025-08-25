"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function PaymentErrorPage() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const params = useSearchParams();
  const reason = params.get("reason") || "Невідома помилка";
  const router = useRouter();

  useEffect(() => {
    timerRef.current = setTimeout(
      () => router.push("/check-subscription"),
      6000
    );
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="bg-text-white mx-auto max-w-[548px] rounded-3xl shadow pt-10 pb-16 px-10 text-center">
        <h1 className="text-2xl font-medium leading-7 tracking-thinest text-[#E83838] mb-4">
          На жаль, оплата не пройшла
        </h1>
        {reason && reason !== "Невідома помилка" && (
          <p className="text-lg leading-7 text-muted-foreground">
            Причина: {reason}
          </p>
        )}

        <p className="text-lg leading-7 text-muted-foreground">
          Ви завжди можете повторити спробу. Якщо проблема збережеться — наша
          підтримка готова допомогти <br />
          💙💛.
        </p>
      </div>
    </div>
  );
}
export default PaymentErrorPage;
