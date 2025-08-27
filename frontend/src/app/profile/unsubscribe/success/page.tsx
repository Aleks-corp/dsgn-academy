"use client";

import { withUserGuard } from "@/guards/WithUserGuard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function UnsubscribeSuccessPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => router.push("/"), 10000);
    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-8 w-full max-w-md mx-auto lg:mx-0">
        <h2 className="font-inter text-xl text-foreground font-medium leading-7 tracking-thinest ">
          Дякуємо за ваш відгук 💙
        </h2>
        <p className="font-inter text-muted text-xs font-medium leading-4 tracking-thin">
          Дякуємо, що поділилися з нами своїми думками 🙏
        </p>
        <p className="font-inter text-muted text-xs font-medium leading-4 tracking-thin">
          Саме завдяки таким відгукам ми можемо розвиватися й робити Design
          Academy зручнішою та кориснішою для вас.
        </p>
      </div>
    </div>
  );
}
export default withUserGuard(UnsubscribeSuccessPage);
