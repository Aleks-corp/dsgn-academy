"use client";

import Image from "next/image";
import ForgotForm from "@/components/form&inputs/ForgotForm";
import { withAlphaGuard } from "@/guards/WithAlphaGuard";

function ForgotPage() {
  return (
    <div className="flex w-full items-center">
      <div className="w-full lg:w-[45%]">
        <ForgotForm />
      </div>
      <div className="w-0 lg:w-[55%] h-full min-h-[500px] overflow-hidden rounded-xl">
        <Image
          src={"/images/reglog.jpg"}
          alt="Registration Logo"
          width={2340}
          height={2280}
          className="object-cover object-center w-full h-full min-h-[500px] max-h-[calc(100vh-120px)] rounded-xl"
        />
      </div>
    </div>
  );
}
export default withAlphaGuard(ForgotPage);
// export default SignInPage
