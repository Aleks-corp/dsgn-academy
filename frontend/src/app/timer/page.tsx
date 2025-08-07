import HeroSection from "@/components/timerPage/HeroSection";
import TimerSection from "@/components/timerPage/TimerSection";
import FaqSection from "@/components/timerPage/FaqSection";

export default function TimerPage() {
  return (
    <div className="flex flex-col items-center gap-3 w-full mx-auto mt-16">
      <HeroSection />
      <TimerSection />
      <FaqSection />
    </div>
  );
}
