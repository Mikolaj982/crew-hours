import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isWeekend,
  parse,
} from 'date-fns';
import { pl } from 'date-fns/locale';

export type MonthDay = {
  date: string;
  dayOfMonth: number;
  weekday: string;
  isWeekend: boolean;
};

export const getMonthDays = (month: string): MonthDay[] => {
  const start = parse(month, 'yyyy-MM', new Date());

  return eachDayOfInterval({ start, end: endOfMonth(start) }).map((day) => ({
    date: format(day, 'yyyy-MM-dd'),
    dayOfMonth: day.getDate(),
    weekday: format(day, 'EEEEEE', { locale: pl }),
    isWeekend: isWeekend(day),
  }));
};

const hoursFormatter = new Intl.NumberFormat('pl-PL', {
  maximumFractionDigits: 1,
});

export const formatHours = (hours: number) => hoursFormatter.format(hours);
