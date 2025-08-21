"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Button from "@/components/buttons/Button";
// import { FcGoogle } from "react-icons/fc";
// import { SiLinkedin } from "react-icons/si";

export default function SignWith() {
  const [loading, setLoading] = useState<"google" | "linkedin" | null>(null);

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5">
      <h2 className="mb-4 text-center text-xl font-semibold">
        Або за допомогою
      </h2>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          onClick={() => {
            signIn("google", { callbackUrl: "/oauth/finish" });
            setLoading("google");
          }}
          disabled={!!loading}
          className="flex items-center justify-center gap-2 "
          // icon={<FcGoogle size={18} />}
          text={loading === "google" ? "Вхід через Google..." : "Google"}
        />

        <Button
          type="button"
          onClick={() => {
            signIn("linkedin", { callbackUrl: "/oauth/finish" });
            setLoading("linkedin");
          }}
          disabled={!!loading}
          className="flex items-center justify-center gap-2"
          // icon={<SiLinkedin size={18} color="white" />}
          text={loading === "linkedin" ? "Вхід через LinkedIn..." : "LinkedIn"}
        />
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Продовжуючи, ви погоджуєтесь з умовами використання.
      </p>
    </div>
  );
}
