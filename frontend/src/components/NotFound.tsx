import Image from "next/image";
import Link from "next/link";

export default function NotFoundWrap() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center pt-12">
      <div className="max-w-3xl w-full flex flex-col items-center">
        <Image
          src="/frame.svg"
          width={302}
          height={174}
          alt="Not Found"
          className="w-full mb-12"
        />
        <div className="max-w-[450px]">
          <p className="text-4xl font-sans-conf font-semibold tracking-tight text-center mb-3">
            Сторінку не знайдено.
          </p>
          <p className="text-xl text-center mb-12 tracking-[-0.4px] ">
            Можливо, вона ще в розробці — або вже зникла в архівах UX.
          </p>
        </div>
        <Link href="/" passHref>
          <button className="btn-gradient text-white px-4 py-2.5 w-full transition cursor-pointer">
            Повернутись на головну
          </button>
        </Link>
      </div>
    </div>
  );
}
