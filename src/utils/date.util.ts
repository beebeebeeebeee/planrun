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

function getEndOfWeek(date: Date): Date {
  const dt = new Date(date);
  const day = dt.getDay();
  const diff = dt.getDate() + (day === 0 ? 0 : 7 - day);

  return new Date(dt.setDate(diff));
}

function getWeekNumber(date: Date): number {
  const dt = new Date(date);
  const firstDayOfYear = new Date(dt.getFullYear(), 0, 1);
  const pastDaysOfYear = (dt.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function isBetween(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}


export const dateUtil = {
  toDateString,
  getStartOfWeek,
  getEndOfWeek,
  getWeekNumber,
  isBetween,
};
