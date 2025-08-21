"use client";

import Image from "next/image";
import SignUpForm from "@/components/form&inputs/SignUpForm";
import { withAlphaGuard } from "@/components/guards&providers/WithAlphaGuard";

function SignupPage() {
  return (
    <div className="flex w-full">
      <div className="w-full lg:w-[45%]">
        <SignUpForm />
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
}

export default withAlphaGuard(SignupPage);
// export default SignupPage
