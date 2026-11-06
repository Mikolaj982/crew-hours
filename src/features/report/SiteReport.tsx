import { format, parse } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Alert,
  Box,
  Paper,
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
import { Loading } from '../../components/Loading';

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
    return <Loading />;
  }

  if (sitesQuery.isError || employeesQuery.isError || entriesQuery.isError) {
    return <Alert severity="error">Nie udało się załadować raportu.</Alert>;
  }

  const site = sitesQuery.data.find((s) => s.id === siteId);

  if (!site) {
    return <Alert severity="warning">Nie znaleziono budowy.</Alert>;
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
  const monthName = format(parse(month, 'yyyy-MM', new Date()), 'LLLL yyyy', {
    locale: pl,
  });
  const period = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      {companyName && (
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: 'block', lineHeight: 1.5 }}
        >
          {companyName}
        </Typography>
      )}
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
        {site.name}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Godziny pracy · {period}
      </Typography>

      {people.length === 0 ? (
        <Alert severity="info">Brak godzin w tym miesiącu.</Alert>
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
              <TableRow
                key={day.date}
                sx={day.isWeekend ? { bgcolor: 'action.hover' } : undefined}
              >
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

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          mt: 2,
          p: 2,
          borderRadius: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Typography>Razem</Typography>
        <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>
          {formatHours(total)} h
        </Typography>
      </Box>
    </Paper>
  );
};
