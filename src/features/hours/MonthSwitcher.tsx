import { addMonths, format, parse } from 'date-fns';
import { pl } from 'date-fns/locale';

type MonthSwitcherProps = {
  month: string;
  onChange: (month: string) => void;
};

export const MonthSwitcher = ({ month, onChange }: MonthSwitcherProps) => {
  const date = parse(month, 'yyyy-MM', new Date());

  const goTo = (offset: number) => {
    onChange(format(addMonths(date, offset), 'yyyy-MM'));
  };

  return (
    <div>
      <button aria-label="Poprzedni miesiąc" onClick={() => goTo(-1)}>
        ◀
      </button>
      <span>{format(date, 'LLLL yyyy', { locale: pl })}</span>
      <button aria-label="Następny miesiąc" onClick={() => goTo(1)}>
        ▶
      </button>
    </div>
  );
};
