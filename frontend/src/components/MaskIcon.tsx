// components/MaskIcon.tsx
type Props = {
  src: string;
  className?: string; // для керування кольором і розміром
};

export default function MaskIcon({ src, className }: Props) {
  return (
    <span
      aria-hidden
      className={`inline-block align-middle ${className ?? ""}`}
      style={{
        // колір іконки
        backgroundColor: "currentColor",
        // власне маска (важливо продублювати -webkit- для Safari/iOS)
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        // задаємо розмір через сам елемент
        width: "20px",
        height: "20px",
      }}
    />
  );
}
