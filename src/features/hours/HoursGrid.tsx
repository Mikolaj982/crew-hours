import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTimeEntries } from './useTimeEntries';
import { useEmployees } from '../employees/useEmployees';
import { buildHoursMatrix } from './matrix';
import { formatHours, getMonthDays } from './calendar';

type HoursGridProps = {
  siteId: string;
  month: string;
};

const stickyCell: SxProps<Theme> = {
  position: 'sticky',
  left: 0,
  zIndex: 1,
  bgcolor: 'background.paper',
  whiteSpace: 'nowrap',
};

const weekendCell: SxProps<Theme> = { bgcolor: 'action.hover' };

export const HoursGrid = ({ siteId, month }: HoursGridProps) => {
  const entriesQuery = useTimeEntries(month, siteId);
  const employeesQuery = useEmployees();

  if (entriesQuery.isPending || employeesQuery.isPending) {
    return <div>Ładowanie godzin...</div>;
  }

  if (entriesQuery.isError || employeesQuery.isError) {
    return <div>Nie udało się załadować godzin.</div>;
  }

  const matrix = buildHoursMatrix(entriesQuery.data);
  const days = getMonthDays(month);
  const rows = employeesQuery.data.filter(
    (employee) => employee.is_active || matrix[employee.id],
  );

  if (rows.length === 0) {
    return <p>Brak pracowników do wyświetlenia.</p>;
  }

  const sumRow = (employeeId: string) =>
    Object.values(matrix[employeeId] ?? {}).reduce((sum, h) => sum + h, 0);

  const sumDay = (date: string) =>
    rows.reduce((sum, employee) => sum + (matrix[employee.id]?.[date] ?? 0), 0);

  const total = entriesQuery.data.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={stickyCell}>Pracownik</TableCell>
            {days.map((day) => (
              <TableCell
                key={day.date}
                align="center"
                sx={day.isWeekend ? weekendCell : undefined}
              >
                {day.dayOfMonth}
                <br />
                {day.weekday}
              </TableCell>
            ))}
            <TableCell align="right">Suma</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell sx={stickyCell}>
                {employee.name}
                {!employee.is_active && ' (archiwum)'}
              </TableCell>
              {days.map((day) => {
                const hours = matrix[employee.id]?.[day.date];
                return (
                  <TableCell
                    key={day.date}
                    align="center"
                    sx={day.isWeekend ? weekendCell : undefined}
                  >
                    {hours !== undefined && formatHours(hours)}
                  </TableCell>
                );
              })}
              <TableCell align="right">
                {formatHours(sumRow(employee.id))}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={stickyCell}>Suma dnia</TableCell>
            {days.map((day) => {
              const hours = sumDay(day.date);
              return (
                <TableCell
                  key={day.date}
                  align="center"
                  sx={day.isWeekend ? weekendCell : undefined}
                >
                  {hours > 0 && formatHours(hours)}
                </TableCell>
              );
            })}
            <TableCell align="right">{formatHours(total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
