export default function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center pb-16 pt-10 gap-4">
      <span className="text-xs text-muted-foreground leading-5 md:leading-11 select-none">
        🇺🇦 Платформа для тих, хто хоче стати сильнішим дизайнером
      </span>
      <h1 className="text-5xl md:text-[80px] font-medium text-muted-foreground leading-14 md:leading-[86px] tracking-thinest uppercase select-none">
        ДИЗАЙН АКАДЕМІЯ
      </h1>
      <div className="text-sm text-muted-foreground leading-5 max-w-sm md:text-lg md:leading-7 md:max-w-xl select-none">
        Збираємо найкращі відео для дизайнерів, перекладаємо українською, та
        зручно оформляємо.
      </div>
    </section>
  );
}
