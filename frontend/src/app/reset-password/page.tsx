"use client";

import Image from "next/image";
import ResetForm from "@/components/form&inputs/ResetForm";

const ResetPage = () => {
  return (
    <div className="flex w-full">
      <div className="w-full lg:w-[45%]">
        <ResetForm />
      </div>
      <div className="w-0 lg:w-[55%] overflow-hidden rounded-xl">
        <Image
          src={"/images/reglog.jpg"}
          alt="Registration Logo"
          width={780}
          height={860}
          className="object-cover w-full h-full rounded-xl"
        />
      </div>
    </div>
  );
};

export default ResetPage;
