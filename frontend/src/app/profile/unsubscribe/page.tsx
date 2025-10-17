"use client";

import { withUserGuard } from "@/guards/WithUserGuard";
import { unsubscribe } from "@/redux/auth/auth.thunk";
import { useAppDispatch } from "@/redux/hooks";
import { useState } from "react";
import Button from "@/components/buttons/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import MaskIcon from "@/components/MaskIcon";

const reasons = [
  "Я рідко користуюся сервісом",
  "Не знайшов(ла) те, що мені потрібно",
  "Ціна зависока",
  "Технічні проблеми / незручний інтерфейс",
  "Я підписався(лась) випадково",
];

function UnsubscribePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reason = `Причина: ${selected}. \n Відгук: ${feedback}`;
    try {
      const res = await dispatch(unsubscribe(reason));
      if (res.meta && res.meta.requestStatus === "fulfilled") {
        if (res.payload.message === "Успішне виконання") {
          toast.success(res.payload.message, { duration: 4000 });
          router.push("/profile/unsubscribe/success");
        } else {
          toast.error(res.payload.message, { duration: 4000 });
        }
        console.log("🚀 ~ res:", res.payload);
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  };
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto lg:mx-0">
        <h2 className="font-inter text-xl text-foreground font-medium leading-7 tracking-thinest">
          Ми будемо сумувати, що ви йдете 💔
        </h2>
        <p className="font-inter text-muted text-xs font-medium leading-4 tracking-thin">
          Нам дуже шкода, що ви вирішили відписатися. Design Academy створена,
          щоб допомагати і надихати. Ми постійно працюємо над тим, щоб ставати
          кращими для вас.
          <span className="block font-bold">
            Будь ласка, поділіться причиною — ваша думка для нас дуже важлива 🙏
          </span>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2.5">
          <div className="flex flex-col">
            {reasons.map((reason) => (
              <label
                key={reason}
                className="flex p-1.5 items-center justify-between select-none hover:bg-muted-background cursor-pointer"
              >
                <span className="text-xs text-foreground font-medium font-inter leading-4 tracking-thin">
                  {reason}
                </span>
                <input
                  type="radio"
                  name="unsubscribe-reason"
                  value={reason}
                  checked={selected === reason}
                  onChange={() => setSelected(reason)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-md bg-muted-background shadow-select`}
                >
                  {selected === reason && (
                    <MaskIcon
                      src="icons/nav-icons/check.svg"
                      className={`w-4 h-4 text-muted transition-opacity duration-200 ${
                        selected === reason ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  )}
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-foreground font-medium font-inter leading-4 tracking-thin">
            Залишити свій відгук:
          </p>
          <div className="flex flex-col gap-2">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full min-h-[106px] rounded-xl border border-[#E2E2E2] p-3 pr-4 text-xs bg-icon-bg placeholder:text-muted-text placeholder:text-[11px] placeholder:font-medium placeholder:leading-4 placeholder:tracking-thin focus:outline-none"
              placeholder="Поділіться своїми думками чи пропозиціями — нам дуже допоможе ваша щирість."
            />
          </div>
          <Button
            type="submit"
            text="Скасувати підписку"
            disabled={!selected}
            style="accent"
            className="w-fit"
          />
        </form>
      </div>
    </div>
  );
}
export default withUserGuard(UnsubscribePage);
