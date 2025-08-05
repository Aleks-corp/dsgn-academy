import Link from "next/link";
import Logo from "./Logo";

export default function HeaderTimer() {
  return (
    <header className="flex justify-center w-full max-w-[1440px]">
      <div className="flex w-full mx-auto items-center justify-between gap-6 flex-wrap">
        <Logo />
        <Link
          className="btn-gradient py-2 px-6 rounded-xl shadow-btn"
          href={"/command"}
        >
          Про нас
        </Link>
      </div>
    </header>
  );
}
