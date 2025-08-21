import Logo from "@/components/Logo";
import NavLink from "@/components/links/Link";

export default function HeaderTimer() {
  return (
    <div className="fixed top-0 left-0 w-full pt-5 pb-3 bg-background z-50">
      <header className=" mx-auto flex justify-center w-full max-w-[1440px] px-5">
        <div className="flex w-full mx-auto items-center justify-between gap-6 flex-wrap">
          <Logo />
          <NavLink text="Про нас" rout="/command" />
        </div>
      </header>
    </div>
  );
}
