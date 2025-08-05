const setSubDate = (datetime: number): Date => {
  const currentDate = new Date(datetime);
  const nextDay = currentDate.getDate() > 28 ? 28 : currentDate.getDate();
  const nextMonth =
    currentDate.getMonth() === 11 ? 1 : currentDate.getMonth() + 2;
  const nextYear =
    currentDate.getMonth() === 11
      ? currentDate.getFullYear() + 1
      : currentDate.getFullYear();
  const dateEndString = `${nextYear}-${
    nextMonth < 10 ? `0` + nextMonth : nextMonth
  }-${nextDay < 10 ? `0` + nextDay : nextDay}T09:00:00`;
  const dateEnd = new Date(dateEndString);
  return dateEnd;
};
export default setSubDate;
