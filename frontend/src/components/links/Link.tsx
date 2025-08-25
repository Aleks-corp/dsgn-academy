import Link from "next/link";
interface ILink {
  text: string;
  rout: string;
  style?: "accent";
  icon?: React.ReactNode;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}
export default function NavLink({
  text,
  rout,
  style,
  icon,
  target,
  rel,
}: ILink) {
  return (
    <Link
      className={`${
        style === "accent"
          ? "bg-accent text-text-white hover:bg-accent-hover transition-colors duration-300"
          : "btn-gradient"
      } inline-flex font-inter font-semibold text-sm leading-5 tracking-thin whitespace-nowrap justify-center items-center gap-1 py-2 px-6 rounded-xl shadow-btn `}
      href={rout}
      target={target}
      rel={rel}
    >
      {icon}
      <p>{text}</p>
    </Link>
  );
}
