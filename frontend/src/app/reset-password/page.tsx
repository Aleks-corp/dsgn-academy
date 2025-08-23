"use client";

import Image from "next/image";
import ResetForm from "@/components/form&inputs/ResetForm";

const ResetPage = () => {
  return (
    <div className="flex w-full items-center">
      <div className="flex w-full lg:w-[45%]">
        <ResetForm />
      </div>
      <div className="w-0 lg:w-[55%] h-full min-h-[550px] overflow-hidden rounded-xl">
        <Image
          src={"/images/reglog.jpg"}
          alt="Registration Logo"
          width={2340}
          height={2280}
          className="object-cover object-center w-full h-full min-h-[550px] max-h-[calc(100vh-120px)] rounded-xl"
        />
      </div>
    </div>
  );
};

export default ResetPage;
