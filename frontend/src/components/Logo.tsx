import Image from "next/image";
import { redirect } from "next/navigation";
import Beta from "@/components/Beta";
import { MiniTimer } from "@/components/timerPage/MiniTimer";

export default function Logo() {
  return (
    <button
      type="button"
      onClick={() => redirect("/")}
      className="relative flex items-center gap-2 bg-white pl-5 pr-6 py-3 rounded-3xl cursor-pointer"
    >
      <Beta />
      <div className="absolute -top-3 left-10">
        <MiniTimer />
      </div>
      <Image
        className="object-contain"
        src="/logo.svg"
        alt="dsgn academy logo"
        width={53}
        height={28}
        priority
      />
      <p className="font-sora text-start text-foreground text-base font-extrabold leading-3.5 tracking-[-0.64px]">
        dsgn
        <br />
        academy
      </p>
    </button>
  );
}
