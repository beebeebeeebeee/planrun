function toDateString(date: Date | string): string {
  const dt = typeof date === "string" ? new Date(date) : date;
  const year = dt.getFullYear();
  const month = (dt.getMonth() + 1).toString().padStart(2, "0");
  const day = dt.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStartOfWeek(date: Date): Date {
  const dt = new Date(date);
  const day = dt.getDay();
  const diff = dt.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(dt.setDate(diff));
}

function getStartOfWeekWithWeekNumberAndYear(
  year: number,
  weekNumber: number
): Date {
  const date = new Date(year, 0, 1 + (weekNumber - 1) * 7); // Elle's method
  date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc
  return date;
}

function getEndOfWeek(date: Date): Date {
  const dt = new Date(date);
  const day = dt.getDay();
  const diff = dt.getDate() + (day === 0 ? 0 : 7 - day);

  return new Date(dt.setDate(diff));
}

function getWeekNumber(date: Date): number {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayOfYear = (+today - +onejan + 86400000) / 86400000;
  return Math.ceil(dayOfYear / 7);
}

function isBetween(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

function getAllWeekRangeOfAMonth(date: Date): Record<number, [Date, Date]> {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstWeekNumber = getWeekNumber(firstDayOfMonth);
  const lastWeekNumber = getWeekNumber(lastDayOfMonth);

  return Array.from({ length: lastWeekNumber - firstWeekNumber + 1 }).reduce<
    Record<number, [Date, Date]>
  >((acc, _, i) => {
    const weekNumber = firstWeekNumber + i;
    const startOfWeek = getStartOfWeekWithWeekNumberAndYear(year, weekNumber);
    const endOfWeek = getEndOfWeek(startOfWeek);
    if (startOfWeek.getMonth() !== month && endOfWeek.getMonth() !== month)
      return acc;
    return {
      ...acc,
      [weekNumber]: [startOfWeek, getEndOfWeek(startOfWeek)],
    };
  }, {});
}

export const dateUtil = {
  toDateString,
  getStartOfWeek,
  getEndOfWeek,
  getWeekNumber,
  getAllWeekRangeOfAMonth,
  isBetween,
};
