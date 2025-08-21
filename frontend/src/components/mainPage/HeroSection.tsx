export default function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center p-5 pt-3 gap-4 mt-14">
      <span className="text-sm text-muted-foreground leading-5 md:leading-11 mt-14 select-none">
        🇺🇦 Платформа для тих, хто хоче стати сильнішим дизайнером
      </span>
      <h1 className="text-5xl md:text-[80px] font-medium text-muted-foreground leading-14 md:leading-[86px] tracking-[-3px] uppercase select-none">
        ДИЗАЙН АКАДЕМІЯ
      </h1>
      <div className="text-sm md:text-lg text-muted-foreground leading-7 max-w-sm mb-14 select-none">
        Збираємо найкращі відео для дизайнерів, перекладаємо українською, та
        зручно оформляємо.
      </div>
    </section>
  );
}
