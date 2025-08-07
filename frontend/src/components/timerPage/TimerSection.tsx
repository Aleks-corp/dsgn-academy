import { CountdownTimer } from "@/components/Timer";

export default function TimerSection({ timer }: { timer: number | null }) {
  return (
    <section className="flex flex-col items-center text-center py-8 gap-4 bg-accent rounded-3xl w-full">
      <p className="text-sm text-background leading-11">
        Платформа відкриється через:
      </p>
      <CountdownTimer targetTime={timer} />
      <button className="btn-telegram px-6 py-2 rounded-xl shadow-btn text-foreground text-sm font-inter font-semibold">
        Підписатись у Telegram
      </button>
      <p className="text-sm text-background leading-11">
        🎁 Подарунки для перших 100 підписників!
      </p>
    </section>
  );
}
