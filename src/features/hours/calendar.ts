import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  isWeekend,
  parse,
} from 'date-fns';
import { pl } from 'date-fns/locale';

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export const parseMonthParam = (param: string | null) =>
  param && MONTH_PATTERN.test(param) ? param : format(new Date(), 'yyyy-MM');

export const getMonthRange = (month: string) => {
  const start = parse(month, 'yyyy-MM', new Date());

  return {
    from: format(start, 'yyyy-MM-dd'),
    to: format(addMonths(start, 1), 'yyyy-MM-dd'),
  };
};

export type MonthDay = {
  date: string;
  dayOfMonth: number;
  weekday: string;
  isWeekend: boolean;
  isToday: boolean;
};

export const getMonthDays = (month: string): MonthDay[] => {
  const start = parse(month, 'yyyy-MM', new Date());

  return eachDayOfInterval({ start, end: endOfMonth(start) }).map((day) => ({
    date: format(day, 'yyyy-MM-dd'),
    dayOfMonth: day.getDate(),
    weekday: format(day, 'EEEEEE', { locale: pl }),
    isWeekend: isWeekend(day),
    isToday: isToday(day),
  }));
};

const hoursFormatter = new Intl.NumberFormat('pl-PL', {
  maximumFractionDigits: 1,
});

export const formatHours = (hours: number) => hoursFormatter.format(hours);
