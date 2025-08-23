"use client";

import Image from "next/image";
import SignUpForm from "@/components/form&inputs/SignUpForm";
import { withAlphaGuard } from "@/guards&providers/WithAlphaGuard";

function SignupPage() {
  return (
    <div className="flex w-full items-center">
      <div className="flex w-full lg:w-[45%]">
        <SignUpForm />
      </div>
      <div className="w-0 lg:w-[55%] h-full min-h-[650px] max-h-[calc(100vh-120px)] overflow-hidden rounded-xl">
        <Image
          src={"/images/reglog.jpg"}
          alt="Registration Logo"
          width={2340}
          height={2280}
          className="object-cover object-center w-full h-full min-h-[650px] max-h-[calc(100vh-120px)] rounded-xl"
        />
      </div>
    </div>
  );
}

export default withAlphaGuard(SignupPage);
// export default SignupPage
