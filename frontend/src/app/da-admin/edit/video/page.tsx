"use client";

import Button from "@/components/buttons/Button";
import Input from "@/components/form&inputs/Input";
import { withAdminGuard } from "@/guards/WithAdminGuard";
import { useRouter } from "next/navigation";
import { useState } from "react";

function EditVideoLinkPage() {
  const [id, setId] = useState("");

  const router = useRouter();

  const handlefetchVideoData = async () => {
    router.push(`/da-admin/add/video/${id}`);
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-semibold">Редагування видео</p>
      <label className="text-sm font-semibold text-muted">
        <p className="mb-2">
          Введіть ID для редагування <br /> або знайдіть потрібне відео і
          натисніть кнопку редагувати
        </p>
        <Input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="1110000000"
          className="max-w-[256px] font-inter text-base font-semibold text-muted"
          required
        />
      </label>
      <Button
        text="Перейти до редагування"
        type="button"
        className="w-fit"
        onClick={handlefetchVideoData}
      />
    </div>
  );
}
export default withAdminGuard(EditVideoLinkPage);
