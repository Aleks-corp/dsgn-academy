import { CountdownTimer } from "@/components/Timer";
import Link from "next/link";

export default function TimerSection({ timer }: { timer: number | null }) {
  return (
    <section className="flex flex-col items-center text-center py-8 gap-4 bg-accent rounded-3xl w-full">
      <p className="text-sm text-background leading-11">
        Платформа відкриється через:
      </p>
      <CountdownTimer targetTime={timer} />
      <Link
        className="btn-telegram px-6 py-2 rounded-xl shadow-btn text-foreground text-sm font-inter font-semibold"
        href={"https://forms.gle/Gpum1ZmEpqzsiipR6"}
        target="_blank"
      >
        Заповнити форму та отримати 🎁
      </Link>
      <p className="text-sm text-background leading-11">
        🎁 Подарунки для перших 100 підписників!
      </p>
    </section>
  );
}
