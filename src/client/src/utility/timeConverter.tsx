export function dateWithTimeStringFormatter(date: number): string {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}
export function dateToNumber(date: Date): number {
    return date.getTime();
}

export function dateStringFormatter(date: number): string {
    return dateWithTimeStringFormatter(date).replace(/..\w:.\w:.\w*/g, "");
}

export function getCurrentWeekDates(dates: string[], offset:number = 0): string[] {
    const today = new Date(); // Get the current date

    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + offset); // Get the start date of the current week (Monday)

    for (let i = 0; i < 7; i++) { // Create an array of date strings for each day of the week
      const currentDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 2 + i);
      const dateInNum = dateToNumber(currentDate);
      dates.push(dateStringFormatter(dateInNum));
    }
    return dates;
}
