export function durationNumberToString(duration: string) {
  const hours = Math.floor(parseInt(duration) / 3600);
  const minutes = Math.floor((parseInt(duration) % 3600) / 60);
  const secs = parseInt(duration) % 60;
  return [
    hours > 0 ? String(hours).padStart(2, "0") : null,
    String(minutes).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":"); // формат 00:00
}

export function durationStringToString(input: string | number): string {
  // Якщо вже рядок типу 12:15 — просто повертаємо
  if (typeof input === "string") {
    // перевірка, що рядок схожий на "mm:ss" чи "hh:mm:ss"
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(input)) {
      return input;
    }
    // якщо рядок, але не у форматі часу — пробуємо перетворити на число
    const parsed = parseInt(input, 10);
    if (!isNaN(parsed)) input = parsed;
    else return input; // повертаємо як є
  }

  // Якщо це число (секунди)
  if (typeof input === "number") {
    const hours = Math.floor(input / 3600);
    const minutes = Math.floor((input % 3600) / 60);
    const seconds = input % 60;

    if (hours > 0) {
      return [
        hours,
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
      ].join(":");
    } else {
      return [
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
      ].join(":");
    }
  }

  return "";
}
