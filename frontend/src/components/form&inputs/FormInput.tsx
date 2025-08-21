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
        } font-inter leading-4 tracking-[-0.13px] w-full border-0 px-6 py-4 rounded-xl bg-icon shadow-input focus:shadow-input-hover focus:outline-0 ${inputClassName}`}
      />
    </div>
  );
}
