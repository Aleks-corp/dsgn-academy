import Image from "next/image";
import NavLink from "./links/Link";

export default function Restricted() {
  return (
    <>
      <div className="absolute top-0 botom-0 right-0 left-0 w-full h-full flex flex-col justify-center items-center z-5">
        <Image src="/icons/crown.svg" alt="Crown" width={58} height={58} />
        <p className="font-medium text-xl text-white leading-7 tracking-thinest mt-7 mb-3 select-none">
          Це відео доступне тільки з преміум-доступом.
        </p>
        <p className="text-white leading-5 mb-7 select-none">
          Преміум-доступ — це не тільки відео без обмежень,
          <br /> а ще й внесок у розвиток українського контенту.
        </p>
        <NavLink rout="/check-subscription" text="Придбати преміум" />
      </div>
      <div className="absolute top-0 botom-0 right-0 left-0 w-full h-full bg-black opacity-70 z-4"></div>
    </>
  );
}
