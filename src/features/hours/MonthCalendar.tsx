import { getISODay, parse } from 'date-fns';
import { Box, ButtonBase, Typography } from '@mui/material';
import { formatHours, getMonthDays } from './calendar';

type MonthCalendarProps = {
  month: string;
  totals: Record<string, number>;
  onSelectDay: (date: string) => void;
};

const WEEKDAYS = ['pn', 'wt', 'śr', 'cz', 'pt', 'so', 'nd'];

export const MonthCalendar = ({
  month,
  totals,
  onSelectDay,
}: MonthCalendarProps) => {
  const days = getMonthDays(month);
  const leadingBlanks = getISODay(parse(month, 'yyyy-MM', new Date())) - 1;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        gap: 0.5,
      }}
    >
      {WEEKDAYS.map((weekday) => (
        <Typography
          key={weekday}
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          {weekday}
        </Typography>
      ))}

      {Array.from({ length: leadingBlanks }, (_, index) => (
        <Box key={`blank-${index}`} />
      ))}

      {days.map((day) => {
        const total = totals[day.date];
        return (
          <ButtonBase
            key={day.date}
            onClick={() => onSelectDay(day.date)}
            aria-label={`${day.dayOfMonth}, ${
              total ? `${formatHours(total)} h` : 'brak godzin'
            }`}
            sx={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              minHeight: 56,
              pt: 0.5,
              borderRadius: 1,
              border: day.isToday ? 2 : 1,
              borderColor: day.isToday ? 'primary.main' : 'divider',
              bgcolor: day.isWeekend ? 'action.hover' : 'background.paper',
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: day.isToday ? 'bold' : 'medium' }}
            >
              {day.dayOfMonth}
            </Typography>
            {total !== undefined && (
              <Typography
                variant="caption"
                sx={{ color: 'primary.main', fontWeight: 'bold' }}
              >
                {formatHours(total)}
              </Typography>
            )}
          </ButtonBase>
        );
      })}
    </Box>
  );
};
