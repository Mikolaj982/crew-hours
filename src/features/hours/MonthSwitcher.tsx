import { addMonths, format, parse } from 'date-fns';
import { pl } from 'date-fns/locale';
import { PeriodSwitcher } from '../../components/PeriodSwitcher';

type MonthSwitcherProps = {
  month: string;
  onChange: (month: string) => void;
};

export const MonthSwitcher = ({ month, onChange }: MonthSwitcherProps) => {
  const date = parse(month, 'yyyy-MM', new Date());
  const currentMonth = format(new Date(), 'yyyy-MM');

  const goTo = (offset: number) => {
    onChange(format(addMonths(date, offset), 'yyyy-MM'));
  };

  return (
    <PeriodSwitcher
      label={format(date, 'LLLL yyyy', { locale: pl })}
      prevLabel="Poprzedni miesiąc"
      nextLabel="Następny miesiąc"
      todayLabel="Bieżący miesiąc"
      isCurrent={month === currentMonth}
      onPrev={() => goTo(-1)}
      onNext={() => goTo(1)}
      onToday={() => onChange(currentMonth)}
    />
  );
};
