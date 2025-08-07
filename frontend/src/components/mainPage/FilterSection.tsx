export default function FilterSection() {
  return (
    <section className="flex flex-col items-center text-center py-8 gap-4">
      <div className="flex gap-2 flex-wrap justify-center mt-4">
        <button className="px-4 py-2 bg-[#F3F4F6] rounded-full text-sm font-medium">
          Всі відео
        </button>
        <button className="px-4 py-2 bg-[#F3F4F6] rounded-full text-sm">
          Figma Config
        </button>
        <button className="px-4 py-2 bg-[#F3F4F6] rounded-full text-sm">
          Дизайн-системи
        </button>
        <button className="px-4 py-2 bg-[#F3F4F6] rounded-full text-sm">
          Мобільні інтерфейси
        </button>
        {/* ...інші фільтри */}
      </div>
    </section>
  );
}
