// components/MaskIcon.tsx
type Props = {
  src: string;
  className?: string;
};

export default function MaskIcon({ src, className }: Props) {
  return (
    <span
      aria-hidden
      className={`inline-block align-middle ${className ?? ""}`}
      style={{
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    />
  );
}
