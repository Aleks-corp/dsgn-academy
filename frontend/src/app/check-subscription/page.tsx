"use client";

// import { useAppSelector } from "@/redux/hooks";
// import { selectUser } from "@/redux/selectors/auth.selectors";
// import Button from "@/components/buttons/Button";

export default function AllSubscriptionPage() {
  //   const profile = useAppSelector(selectUser);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-8 w-full max-w-96 mx-auto lg:mx-0">
        <h2 className="font-inter text-xl text-foreground font-medium leading-5 tracking-thinest ">
          Підписки
        </h2>
      </div>
    </div>
  );
}
