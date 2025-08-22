"use client";

import ChangePassForm from "@/components/form&inputs/ChangePassForm";
import { withUserGuard } from "@/components/guards&providers/WithUserGuard";
import { useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/selectors/auth.selectors";
// import Button from "@/components/buttons/Button";

function ProfilePage() {
  const profile = useAppSelector(selectUser);

  const handleDelAcc = () => {};

  if (!profile) {
    return null;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col gap-8 w-full max-w-96 mx-auto lg:mx-0">
        <h2 className="font-inter text-xl text-foreground font-medium leading-5 tracking-thinest ">
          Безпека
        </h2>
        <p className="font-inter text-xs font-medium leading-4 tracking-thin">
          Змінити пароль
        </p>
        <ChangePassForm />
      </div>
      <button
        type="button"
        className="inline-flex mt-8 font-inter text-xs font-medium leading-4 tracking-[-0.12px] text-muted-text hover:text-foreground transition-all duration-300"
        onClick={handleDelAcc}
      >
        Видалити акаунт
      </button>
    </div>
  );
}
export default withUserGuard(ProfilePage);
