import { addDays, format, parse } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Stack, Typography } from '@mui/material';
import { useTimeEntries } from './useTimeEntries';
import { useEmployees } from '../employees/useEmployees';
import { buildHoursMatrix, getVisibleEmployees } from './matrix';
import { formatHours } from './calendar';
import { DayHoursField } from './DayHoursField';

type DayViewProps = {
  siteId: string;
  day: string;
  onDayChange: (day: string) => void;
};

export const DayView = ({ siteId, day, onDayChange }: DayViewProps) => {
  const month = day.slice(0, 7);
  const entriesQuery = useTimeEntries(month, siteId);
  const employeesQuery = useEmployees();

  const date = parse(day, 'yyyy-MM-dd', new Date());

  const goTo = (offset: number) => {
    onDayChange(format(addDays(date, offset), 'yyyy-MM-dd'));
  };

  const switcher = (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <button aria-label="Poprzedni dzień" onClick={() => goTo(-1)}>
        ◀
      </button>
      <Typography>
        {format(date, 'EEEE, d MMMM yyyy', { locale: pl })}
      </Typography>
      <button aria-label="Następny dzień" onClick={() => goTo(1)}>
        ▶
      </button>
    </Stack>
  );

  if (entriesQuery.isPending || employeesQuery.isPending) {
    return (
      <Stack spacing={2}>
        {switcher}
        <div>Ładowanie godzin...</div>
      </Stack>
    );
  }

  if (entriesQuery.isError || employeesQuery.isError) {
    return (
      <Stack spacing={2}>
        {switcher}
        <div>Nie udało się załadować godzin.</div>
      </Stack>
    );
  }

  const matrix = buildHoursMatrix(entriesQuery.data);
  const rows = getVisibleEmployees(employeesQuery.data, matrix);
  const dayTotal = rows.reduce(
    (sum, employee) => sum + (matrix[employee.id]?.[day] ?? 0),
    0,
  );

  return (
    <Stack spacing={2}>
      {switcher}
      {rows.length === 0 ? (
        <p>Brak pracowników do wyświetlenia.</p>
      ) : (
        rows.map((employee) => (
          <DayHoursField
            key={`${employee.id}-${day}`}
            label={
              employee.is_active ? employee.name : `${employee.name} (archiwum)`
            }
            employeeId={employee.id}
            siteId={siteId}
            date={day}
            savedHours={matrix[employee.id]?.[day]}
          />
        ))
      )}
      <Typography sx={{ fontWeight: 'bold' }}>
        Suma dnia: {formatHours(dayTotal)} h
      </Typography>
    </Stack>
  );
};
