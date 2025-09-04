interface IButton {
  text?: string | React.ReactElement;
  onClick?: () => void;
  type: "submit" | "reset" | "button" | undefined;
  style?: "accent";
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
export default function Button({
  text,
  onClick,
  type,
  style,
  className,
  icon,
  disabled,
}: IButton) {
  return (
    <button
      type={type}
      className={`${
        style === "accent"
          ? "bg-accent text-text-white hover:bg-accent-hover transition-colors duration-300 disabled:opacity-40"
          : "btn-gradient"
      } ${
        icon ? "px-5" : "px-6"
      } inline-flex justify-center items-center gap-1 py-2 rounded-xl shadow-btn cursor-pointer disabled:cursor-default ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {text && (
        <p className="font-inter font-semibold text-sm leading-5 tracking-thiner ">
          {text}
        </p>
      )}
    </button>
  );
}
