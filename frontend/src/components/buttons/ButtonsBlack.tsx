interface IButton {
  text: string;
  textPressed: string;
  onClick?: () => void;
  type: "submit" | "reset" | "button" | undefined;
  className?: string;
  pressed?: boolean;
}
export default function ButtonBlack({
  text,
  textPressed,
  onClick,
  type,
  className,
  pressed,
}: IButton) {
  return (
    <button
      type={type}
      className={`btn-black w-full justify-center items-center gap-1 py-2.5 px-5 rounded-xl cursor-pointer disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={pressed}
    >
      {
        <p className="font-inter text-sm font-semibold text-icon leading-5 tracking-thiner">
          {pressed ? textPressed : text}
        </p>
      }
    </button>
  );
}
