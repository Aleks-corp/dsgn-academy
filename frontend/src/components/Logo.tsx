import { handleRouter } from "@/lib/handleRouter";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Beta from "./Beta";

export default function Logo() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => handleRouter(router, "/")}
      className="cursor-pointer"
    >
      <div className="relative flex items-center gap-2 bg-white px-6 py-3 rounded-3xl">
        <Beta />
        <Image
          src="/logo.svg"
          alt="dsgn academy logo"
          width={52}
          height={28}
          priority
          className="w-auto h-[30px]"
        />
        <h1 className="font-sora text-start text-foreground text-base font-extrabold leading-[15px] tracking-[-0.64px]">
          dsgn <span className="flex">academy</span>
        </h1>
      </div>
    </button>
  );
}
