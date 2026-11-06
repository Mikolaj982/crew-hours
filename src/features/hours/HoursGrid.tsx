import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTimeEntries } from './useTimeEntries';
import { useEmployees } from '../employees/useEmployees';
import { buildHoursMatrix, getVisibleEmployees } from './matrix';
import { formatHours, getMonthDays } from './calendar';
import { HoursCell } from './HoursCell';
import { dayCellBg } from './dayCellBg';
import { Loading } from '../../components/Loading';

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
  borderRight: 1,
  borderRightColor: 'divider',
};

const totalCell: SxProps<Theme> = { fontWeight: 'bold' };

export const HoursGrid = ({ siteId, month }: HoursGridProps) => {
  const entriesQuery = useTimeEntries(month, siteId);
  const employeesQuery = useEmployees();

  if (entriesQuery.isPending || employeesQuery.isPending) {
    return <Loading />;
  }

  if (entriesQuery.isError || employeesQuery.isError) {
    return <Alert severity="error">Nie udało się załadować godzin.</Alert>;
  }

  const matrix = buildHoursMatrix(entriesQuery.data);
  const days = getMonthDays(month);
  const rows = getVisibleEmployees(employeesQuery.data, matrix);

  if (rows.length === 0) {
    return (
      <Alert severity="info">
        Brak pracowników. Dodaj ich w zakładce „Pracownicy i budowy”.
      </Alert>
    );
  }

  const sumRow = (employeeId: string) =>
    Object.values(matrix[employeeId] ?? {}).reduce((sum, h) => sum + h, 0);

  const sumDay = (date: string) =>
    rows.reduce((sum, employee) => sum + (matrix[employee.id]?.[date] ?? 0), 0);

  const total = entriesQuery.data.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={stickyCell}>Pracownik</TableCell>
            {days.map((day) => (
              <TableCell
                key={day.date}
                align="center"
                sx={{ px: 0.5, bgcolor: dayCellBg(day) }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: day.isToday ? 'bold' : 'medium',
                    color: day.isToday ? 'primary.main' : 'text.primary',
                  }}
                >
                  {day.dayOfMonth}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {day.weekday}
                </Typography>
              </TableCell>
            ))}
            <TableCell align="right" sx={totalCell}>
              Suma
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((employee) => (
            <TableRow key={employee.id} hover>
              <TableCell sx={stickyCell}>
                {employee.name}
                {!employee.is_active && (
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    {' '}
                    (archiwum)
                  </Typography>
                )}
              </TableCell>
              {days.map((day) => (
                <HoursCell
                  key={day.date}
                  employeeId={employee.id}
                  siteId={siteId}
                  date={day.date}
                  savedHours={matrix[employee.id]?.[day.date]}
                  isWeekend={day.isWeekend}
                  isToday={day.isToday}
                />
              ))}
              <TableCell align="right" sx={totalCell}>
                {formatHours(sumRow(employee.id))}
              </TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ '& td': { borderBottom: 0 } }}>
            <TableCell sx={[stickyCell, totalCell]}>Suma dnia</TableCell>
            {days.map((day) => {
              const hours = sumDay(day.date);
              return (
                <TableCell
                  key={day.date}
                  align="center"
                  sx={{
                    px: 0.5,
                    fontWeight: 'medium',
                    bgcolor: dayCellBg(day),
                  }}
                >
                  {hours > 0 && formatHours(hours)}
                </TableCell>
              );
            })}
            <TableCell align="right" sx={totalCell}>
              {formatHours(total)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
