import { addDays, format, isToday, parse } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import { useTimeEntries } from './useTimeEntries';
import { useEmployees } from '../employees/useEmployees';
import { buildHoursMatrix, getVisibleEmployees } from './matrix';
import { formatHours } from './calendar';
import { DayHoursField } from './DayHoursField';
import { Loading } from '../../components/Loading';
import { PeriodSwitcher } from '../../components/PeriodSwitcher';

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
    <PeriodSwitcher
      label={format(date, 'EEEE, d MMMM', { locale: pl })}
      prevLabel="Poprzedni dzień"
      nextLabel="Następny dzień"
      todayLabel="Dziś"
      isCurrent={isToday(date)}
      onPrev={() => goTo(-1)}
      onNext={() => goTo(1)}
      onToday={() => onDayChange(format(new Date(), 'yyyy-MM-dd'))}
    />
  );

  const renderContent = () => {
    if (entriesQuery.isPending || employeesQuery.isPending) {
      return <Loading />;
    }

    if (entriesQuery.isError || employeesQuery.isError) {
      return <Alert severity="error">Nie udało się załadować godzin.</Alert>;
    }

    const matrix = buildHoursMatrix(entriesQuery.data);
    const rows = getVisibleEmployees(employeesQuery.data, matrix);
    const dayTotal = rows.reduce(
      (sum, employee) => sum + (matrix[employee.id]?.[day] ?? 0),
      0,
    );

    if (rows.length === 0) {
      return (
        <Alert severity="info">
          Brak pracowników. Dodaj ich w zakładce „Ludzie”.
        </Alert>
      );
    }

    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1}>
          {rows.map((employee) => (
            <DayHoursField
              key={`${employee.id}-${day}`}
              label={
                employee.is_active
                  ? employee.name
                  : `${employee.name} (archiwum)`
              }
              employeeId={employee.id}
              siteId={siteId}
              date={day}
              savedHours={matrix[employee.id]?.[day]}
            />
          ))}
        </Stack>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography>Suma dnia</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>
            {formatHours(dayTotal)} h
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <Stack spacing={2}>
      {switcher}
      {renderContent()}
    </Stack>
  );
};
