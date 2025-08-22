import { UseFormRegisterReturn } from "react-hook-form";

type InputWithIconProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "onChange" | "onBlur" | "ref"
> & {
  icon?: React.ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
  hookformprop?: UseFormRegisterReturn;
};

export default function FormInputWithIcon({
  icon,
  wrapperClassName = "",
  inputClassName = "",
  hookformprop,
  ...props
}: InputWithIconProps) {
  return (
    <div className={`relative w-3xs ${wrapperClassName}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        {...props}
        {...hookformprop}
        className={`${
          icon ? "pl-10" : ""
        } font-inter font-medium text-xs leading-4 tracking-[-0.12px] w-full border-1 border-border px-6 py-3 rounded-xl bg-icon focus:border-border-focus focus:outline-0 ${inputClassName}`}
      />
    </div>
  );
}
