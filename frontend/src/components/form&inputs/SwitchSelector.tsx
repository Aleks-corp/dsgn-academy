import React from "react";
import Switch from "@/components/form&inputs/Switch";

interface SwitchSelectorProps {
  title: string;
  items: { [key: string]: boolean }[];
  setItems: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }[]>>;
  constants: string[];
  optionClass?: string;
  containerClass?: string;
  showBox?: boolean;
}

const SwitchSelector: React.FC<SwitchSelectorProps> = ({
  title,
  items,
  setItems,
  constants,
  optionClass = "flex items-center gap-2",
  containerClass = "flex gap-2",
  showBox = false,
}) => {
  return (
    <>
      <p className="mb-3 text-xs font-medium text-foreground">{title}</p>
      <div className={containerClass}>
        {constants.map((item, index) => (
          <div key={index} className={optionClass}>
            <Switch
              value={
                items.find((i) => Object.keys(i)[0] === item)?.[item] || false
              }
              setValue={(newValue) =>
                setItems((prevItems) =>
                  prevItems.map((i) =>
                    Object.keys(i)[0] === item ? { [item]: newValue } : i
                  )
                )
              }
              name={title === "Категорії" ? item : ""}
            />
            {showBox && (
              <div className="flex-grow">
                <p className="text-base font-medium text-muted-foreground capitalize">
                  {item}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SwitchSelector;
