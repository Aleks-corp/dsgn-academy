"use client";

import Button from "@/components/buttons/Button";
import SubCard from "../SubCard";
import { freeDescription } from "@/constants/sub.desc.constants";

export default function FreeSubProfile() {
  return (
    <div className="w-full">
      <p className="font-inter text-xs font-medium leading-4 tracking-thin mb-4">
        🎁 Відкрийте всі уроки та бонуси
      </p>
      <SubCard
        title="Безкоштовний"
        subTitle="Базовий доступ для ознайомлення"
        description={freeDescription}
        submitComponent={
          <Button
            type="button"
            text="Поточний план"
            className="w-full"
            disabled
          />
        }
        subscription="free"
      />
    </div>
  );
}
