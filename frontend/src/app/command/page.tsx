import Image from "next/image";

function CommandPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-20 max-w-5xl py-4">
      <div className="grid grid-cols-1 md:grid-cols-[216px_64px_1fr] lg:grid-cols-[216px_128px_1fr] gap-y-10 md:gap-y-0 items-start w-full max-w-5xl mx-auto">
        <div className="max-w-[216px]">
          <p className="font-medium text-xl text-foreground mb-2">
            💡 Про Dsgn Academy
          </p>
          <p className="font-medium text-muted text-[12px] leading-4 tracking-[-0.12px]">
            Освіта. Доступна. Українською.
          </p>
        </div>

        <div className="hidden md:block" />
        <div className="flex flex-col gap-8 max-w-[690px] w-full">
          <Image
            className="w-full object-cover rounded-4xl h-[140px]"
            src="/about-image.png"
            width={690}
            height={140}
            alt="About Image"
            priority
          />
          <div className="text-sm md:text-base leading-7 space-y-2">
            <p>
              Dsgn Academy — це освітня платформа для дизайнерів українською
              мовою. Ми перекладаємо найкращі світові курси, відео, інтерв’ю та
              лекції з UI/UX, графічного дизайну, дизайн-систем, Webflow, Figma,
              Spline, Framer та інших тем, щоб зробити їх доступними для
              кожного.
            </p>
            <p>Наша мета — щоб мова ніколи не була бар’єром у навчанні.</p>
            <p>
              Ми відбираємо тільки найкраще, професійно адаптуємо, і щодня
              поповнюємо базу, щоб ти завжди мав що подивитись, чому навчитись і
              над чим зростати.
            </p>
            <p>Це не просто «ще одна платформа з курсами».</p>
            <p>
              Це місце, де зібрано все найкраще з дизайну — з перекладом, без
              води, з повагою до твого часу.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[216px_64px_1fr] lg:grid-cols-[216px_128px_1fr] gap-y-10 md:gap-y-0 items-start w-full max-w-5xl mx-auto">
        <div className="max-w-[216px]">
          <p className="font-medium text-xl text-foreground mb-2">
            📚 Що тут буде
          </p>
          <p className="font-medium text-muted text-[12px] leading-4 tracking-[-0.12px]">
            Найкраще з дизайну в одному місці.
          </p>
        </div>

        <div className="hidden md:block" />
        <div className="flex flex-col gap-8 max-w-[690px] w-full">
          <Image
            className="w-full object-cover rounded-4xl h-[140px]"
            src="/about-image.png"
            width={690}
            height={140}
            alt="About Image"
            priority
          />
          <div className="text-sm md:text-base leading-7 space-y-2">
            <ul className="list-disc ml-4">
              <li>Повні офіційні курси від Figma, Webflow, Framer</li>
              <li>
                Перекладені лекції з Figma Config, Awwwards, Design Systems Conf
                тощо
              </li>
              <li>Інтерв’ю з топовими дизайнерами з sneakpeek.design</li>
              <li> Тематичні відео, пояснення, демо, новинки з інструментів</li>
              <li>Зручний пошук, фільтри, теги</li>
              <li>Класний український переклад, адаптований професійно</li>
            </ul>
            <p>Більшість контенту — безкоштовний.</p>
            <p>
              Деякі повноцінні курси чи преміум відео — платні, щоб покривати
              витрати на переклад, монтаж, технічну підтримку і розвиток
              проєкту.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[216px_64px_1fr] lg:grid-cols-[216px_128px_1fr] gap-y-10 md:gap-y-0 items-start w-full max-w-5xl mx-auto">
        <div className="max-w-[216px]">
          <p className="font-medium text-xl text-foreground mb-2">
            👥 Хто стоїть за цим
          </p>
          <p className="font-medium text-muted text-[12px] leading-4 tracking-[-0.12px]">
            Маленька, але сильна команда
          </p>
        </div>

        <div className="hidden md:block" />
        <div className="flex flex-col gap-8 max-w-[690px] w-full">
          <Image
            className="w-full object-cover rounded-4xl h-[140px]"
            src="/about-image.png"
            width={690}
            height={140}
            alt="About Image"
            priority
          />
          <div className="text-sm md:text-base leading-7 space-y-2">
            <p>За проєктом — маленька, але завзята команда:</p>
            <ul className="list-disc ml-4">
              <li>
                Андрій Мамонтов — дизайнер з 10+ роками досвіду, автор
                Telegram-спільноти @dsgnua.
              </li>
              <li>
                Ірина Гаран — UI/UX дизайнерка та проджект-менеджерка. Разом з
                Андрієм розробляє дизайн платформи та дбає, щоб команда рухалася
                в одному ритмі.
              </li>
              <li>
                Олександр Гаран — FullStack розробник, який реалізовує усю
                технічну магію.
              </li>
            </ul>
            Ми робимо платформу, про яку самі мріяли роками.
            <p>Для себе. І для тебе ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CommandPage;
