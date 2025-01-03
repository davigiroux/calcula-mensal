export function calculateServiceAmount(
  amount: number,
  year: number,
  month: number,
  weekDay: number
) {
  const numberOfWeekDaysInMonth = calculateNumberOfWeekDaysInMonth(
    year,
    month,
    weekDay
  );

  return numberOfWeekDaysInMonth * amount;
}
export function calculateNumberOfWeekDaysInMonth(
  year: number,
  month: number,
  weekDay: number
) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let numberOfWeekDaysInMonth = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (date.getDay() === weekDay) {
      numberOfWeekDaysInMonth++;
    }
  }
  return numberOfWeekDaysInMonth;
}
