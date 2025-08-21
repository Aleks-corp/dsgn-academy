export default function DurationToString(duration: string) {
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
