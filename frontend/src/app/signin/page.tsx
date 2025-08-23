"use client";

import Image from "next/image";
import SignInForm from "@/components/form&inputs/SignInForm";
import { withAlphaGuard } from "@/guards&providers/WithAlphaGuard";

function SignInPage() {
  return (
    <div className="flex w-full items-center">
      <div className="flex w-full lg:w-[45%]">
        <SignInForm />
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
}
export default withAlphaGuard(SignInPage);
// export default SignInPage
