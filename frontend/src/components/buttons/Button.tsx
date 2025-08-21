interface IButton {
  text?: string;
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
        style === "accent" ? "bg-accent" : "btn-gradient"
      } inline-flex justify-center items-center gap-1 py-2 px-6 rounded-xl shadow-btn cursor-pointer ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {text && <p>{text}</p>}
    </button>
  );
}
