
class TimeUtility {
    public static getCurrentWeekDates(dates: string[]) {
      // Get the current date
      const today = new Date();
  
      // Get the start date of the current week (Monday)
      const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
  
      dates.push(TimeUtility.makeDateFromNum(1679356800000));
  
      // Create an array of date strings for each day of the week
      for (let i = 1; i < 7; i++) {
        const currentDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        dates.push(currentDate.toLocaleDateString());
      }
      return dates;
    }
  
    public static makeDateFromNum(date: number) {
      const newDate = new Date(date);
  
      const secNewDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDay());
  
      return secNewDate.toLocaleDateString();
    }
  
    public static makeDateFromString(date: string) {
      const newDate = new Date(Number(date));
  
      const secNewDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDay());
  
      return secNewDate.toLocaleDateString();
    }
  }

export default TimeUtility