import Link from "next/link";
interface ILink {
  text: string;
  count?: number;
  icon?: React.ReactNode;
  rout: string;
  className?: string;
}
export default function NavLinkIcon({
  text,
  count,
  icon,
  rout,
  className,
}: ILink) {
  return (
    <Link
      className={`flex w-full h-10 justify-between items-center p-1 pr-3 ${className}`}
      href={rout}
      passHref
    >
      <div className="flex justify-center items-center gap-2.5">
        {icon}
        <p className="font-inter font-medium text-xs leading-4 tracking-thin overflow-ellipsis">
          {text}
        </p>
      </div>
      {count && count !== 0 && (
        <div className="flex justify-center items-center px-1.5 py-0.5 rounded-md bg-muted-background shadow-count">
          <p className="font-inter text-muted text-[11px] font-medium leading-4 tracking-thin">
            {count}
          </p>
        </div>
      )}
    </Link>
  );
}
