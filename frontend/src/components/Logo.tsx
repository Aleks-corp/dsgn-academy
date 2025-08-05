import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.svg"
        alt="dsgn academy logo"
        width={52}
        height={28}
        priority
      />
      <h1 className="font-sora text-foreground text-base font-extrabold leading-[15px] tracking-[-0.64px]">
        DSGN <span className="flex">academy</span>
      </h1>
    </div>
  );
}
