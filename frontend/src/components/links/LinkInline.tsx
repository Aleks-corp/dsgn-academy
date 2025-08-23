import Link from "next/link";
interface ILink {
  text: string;
  href: string;
  className?: string;
  tabIndex?: number | undefined;
}
export default function LinkInline({ text, href, className, tabIndex }: ILink) {
  return (
    <div className="flex justify-center">
      <Link
        href={href}
        className={`text-muted font-inter font-medium text-[11px] leading-4 tracking-thin hover:text-foreground transition-colors duration-300 ${className}`}
        passHref
        tabIndex={tabIndex}
      >
        {text}
      </Link>
    </div>
  );
}
