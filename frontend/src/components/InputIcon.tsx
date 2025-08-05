type IconInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> & {
  icon?: React.ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
  value: string;
  onChange: (value: string) => void;
};

export default function IconInput({
  icon,
  wrapperClassName = "",
  inputClassName = "",
  value,
  onChange,
  ...props
}: IconInputProps) {
  return (
    <div className={`relative w-3xs ${wrapperClassName}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`${
          icon ? "pl-10" : ""
        } border-0 px-3 py-2 w-3xs rounded-md shadow-input focus:shadow-input-hover focus:outline-0 ${inputClassName}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
