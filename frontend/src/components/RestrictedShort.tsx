import Image from "next/image";
import NavLink from "./links/Link";

export default function RestrictedShort() {
  return (
    <>
      <div className="absolute top-0 botom-0 right-0 left-0 w-full h-full flex flex-col justify-center items-center text-center z-5">
        <div className="w-10 h-10 md:w-14 md:h-14">
          <Image
            src="/icons/crown.svg"
            alt="Crown"
            width={58}
            height={58}
            className="w-full h-full"
          />
        </div>
        <p className="font-medium text-base leading-5 md:text-xl md:leading-7 tracking-thinest text-white mt-1 mb-2 md:mt-7 md:mb-3 select-none">
          Це відео доступне тільки <br className="block md:hidden" /> з
          преміум-доступом
        </p>
        <p className="text-xs leading-4 md:leading-5 text-white mb-4 md:mb-7 select-none">
          Преміум-доступ — це не тільки відео без обмежень,
          <br /> а ще й внесок у розвиток українського контенту.
        </p>
        <NavLink rout="/check-subscription" text="Придбати преміум" />
      </div>
      <div className="absolute top-0 botom-0 right-0 left-0 w-full h-full bg-black opacity-70 z-4 "></div>
    </>
  );
}
