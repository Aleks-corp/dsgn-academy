export function formatDateToDDMMYYYY(dateString: Date): string {
  if (!dateString) return "";
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // місяці з 0
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
