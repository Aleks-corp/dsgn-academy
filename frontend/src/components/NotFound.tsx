import Image from "next/image";
import NavLink from "./Link";

export default function NotFoundWrap() {
  return (
    <div className="flex max-h-[80vh] items-center justify-center pt-20">
      <div className="flex flex-col md:flex-row gap-4 max-w-5xl w-full items-center">
        <Image
          src="/not-found.png"
          width={503}
          height={706}
          alt="Not Found"
          className="w-64 md:flex md:flex-1/2 md:w-xl"
        />
        <div className="md:flex-1/2">
          <p className="font-inter text-4xl lg:text-5xl lg:leading-14 tracking-[-1.44px] mb-4 max-w-2xs md:max-w-96 m-auto md:m-0">
            Ой... Я, здається,
            <br /> звернув не туди.
          </p>
          <p className="font-inter text-base lg:text-lg text-muted leading-7 tracking-[-0.36px] mb-8">
            Давайте повернемо вас туди, де живуть милі речі.
          </p>
          <NavLink text="На головну" rout="/"></NavLink>
        </div>
      </div>
    </div>
  );
}
