export function dateWithTimeStringFormatter(date: number): string {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}
export function dateToNumber(date: Date): number {
    return date.getTime();
}

export function dateStringFormatter(date: number): string {
    return dateWithTimeStringFormatter(date).replace(/..\w:.\w:.\w*/g, "");
}

export function getCurrentWeekDates(dates: string[] = [], offset:number = 0): string[] {
    const today = new Date(); // Get the current date

    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + offset); // Get the start date of the current week (Monday)

    for (let i = 0; i < 7; i++) { // Create an array of date strings for each day of the week
      const currentDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 2 + i);
      const dateInNum = dateToNumber(currentDate);
      dates.push(dateStringFormatter(dateInNum));
    }
    return dates;
}

export function getDayThisWeek(day: number = 0, weekOffset: number = 0) : number {
    if (day < 0 || 6 < day) return -1;
    const today = new Date();
    const dayOfWeek = today.getDay();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek + 1 + day + (weekOffset * 7)).getTime();
}

export function dateInThisWeek(date: number, weekOffset: number = 0) : boolean {
    const monThis : number = getDayThisWeek()
    const monNext : number = getDayThisWeek(0, weekOffset + 1)
    return monThis <= date && date < monNext;
}

export function numberToWeekDay(day: number) : string {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(day);
    return weekdays[date.getDay()];
}

export function getCurrentMonthInterval(): [number, number] {
  const today = new Date(); // Get the current date
  const startMonth: number = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  const endMonth: number = new Date(today.getFullYear(), today.getMonth() + 1, 1).getTime() - 1;
  return [startMonth, endMonth];
}
