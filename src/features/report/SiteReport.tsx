import { format, parse } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useSites } from '../sites/useSites';
import { useEmployees } from '../employees/useEmployees';
import { useTimeEntries } from '../hours/useTimeEntries';
import { buildHoursMatrix } from '../hours/matrix';
import { formatHours, getMonthDays } from '../hours/calendar';

type SiteReportProps = {
  siteId: string;
  month: string;
};

const companyName = import.meta.env.VITE_COMPANY_NAME;

export const SiteReport = ({ siteId, month }: SiteReportProps) => {
  const sitesQuery = useSites();
  const employeesQuery = useEmployees();
  const entriesQuery = useTimeEntries(month, siteId);

  if (
    sitesQuery.isPending ||
    employeesQuery.isPending ||
    entriesQuery.isPending
  ) {
    return <div>Ładowanie...</div>;
  }

  if (sitesQuery.isError || employeesQuery.isError || entriesQuery.isError) {
    return <div>Nie udało się załadować raportu.</div>;
  }

  const site = sitesQuery.data.find((s) => s.id === siteId);

  if (!site) {
    return <div>Nie znaleziono budowy.</div>;
  }

  const matrix = buildHoursMatrix(entriesQuery.data);
  const people = employeesQuery.data.filter((employee) => matrix[employee.id]);
  const days = getMonthDays(month).filter((day) =>
    people.some((employee) => matrix[employee.id]?.[day.date] !== undefined),
  );
  const sumEmployee = (employeeId: string) =>
    Object.values(matrix[employeeId] ?? {}).reduce((sum, h) => sum + h, 0);
  const sumDay = (date: string) =>
    people.reduce((sum, e) => sum + (matrix[e.id]?.[date] ?? 0), 0);
  const total = entriesQuery.data.reduce((sum, entry) => sum + entry.hours, 0);
  const period = format(parse(month, 'yyyy-MM', new Date()), 'LLLL yyyy', {
    locale: pl,
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h5">{site.name}</Typography>
      {companyName && <Typography>{companyName}</Typography>}
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Godziny pracy: {period}
      </Typography>

      {people.length === 0 ? (
        <p>Brak godzin w tym miesiącu.</p>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Dzień</TableCell>
              {people.map((employee) => (
                <TableCell key={employee.id} align="center">
                  {employee.name}
                </TableCell>
              ))}
              <TableCell align="right">Suma</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day.date}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {day.weekday} {day.dayOfMonth}
                </TableCell>
                {people.map((employee) => {
                  const hours = matrix[employee.id]?.[day.date];
                  return (
                    <TableCell key={employee.id} align="center">
                      {hours !== undefined && formatHours(hours)}
                    </TableCell>
                  );
                })}
                <TableCell align="right">
                  {formatHours(sumDay(day.date))}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Razem</TableCell>
              {people.map((employee) => (
                <TableCell
                  key={employee.id}
                  align="center"
                  sx={{ fontWeight: 'bold' }}
                >
                  {formatHours(sumEmployee(employee.id))}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {formatHours(total)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Box>
  );
};
