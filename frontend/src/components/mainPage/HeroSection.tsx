export default function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center p-5 pt-3 gap-4 mt-14">
      <span className="text-sm text-muted-foreground leading-11">
        🇺🇦 Платформа для тих, хто хоче стати сильнішим дизайнером
      </span>
      <h1 className="text-[80px] font-medium text-muted-foreground leading-[86px] tracking-[-3px] uppercase">
        ДИЗАЙН АКАДЕМІЯ
      </h1>
      <div className="text-lg text-muted-foreground leading-7 max-w-xl mb-16">
        Збираємо найкращі відео для дизайнерів, перекладаємо українською, та
        зручно оформляємо.
      </div>
    </section>
  );
}
