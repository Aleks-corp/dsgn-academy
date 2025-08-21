import Link from "next/link";
interface ILink {
  text: string;
  rout: string;
  style?: "accent";
  icon?: React.ReactNode;
}
export default function NavLink({ text, rout, style, icon }: ILink) {
  return (
    <Link
      className={`${
        style === "accent" ? "bg-accent text-white" : "btn-gradient"
      } inline-flex justify-center items-center gap-1 py-2 px-6 rounded-xl shadow-btn `}
      href={rout}
      passHref
    >
      {icon}
      <p>{text}</p>
    </Link>
  );
}
