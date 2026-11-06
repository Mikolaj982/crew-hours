import { Link, useSearchParams } from 'react-router';
import {
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { MonthSwitcher } from '../../features/hours/MonthSwitcher';
import { formatHours, parseMonthParam } from '../../features/hours/calendar';
import { useMonthSummary } from '../../features/summary/useMonthSummary';
import { buildSummary } from '../../features/summary/summary';

export const SummaryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const month = parseMonthParam(searchParams.get('month'));
  const { data, isPending, isError } = useMonthSummary(month);

  const header = (
    <>
      <h1>Podsumowanie</h1>
      <MonthSwitcher
        month={month}
        onChange={(value) => setSearchParams({ month: value })}
      />
    </>
  );

  if (isPending) {
    return (
      <div>
        {header}
        <div>Ładowanie...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {header}
        <div>Nie udało się załadować podsumowania.</div>
      </div>
    );
  }

  const { sites, employees, total } = buildSummary(data);

  if (sites.length === 0) {
    return (
      <div>
        {header}
        <p>Brak godzin w tym miesiącu.</p>
      </div>
    );
  }

  return (
    <div>
      {header}
      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {sites.map((site) => (
          <Card key={site.id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle2">{site.name}</Typography>
              <Typography variant="h5">{formatHours(site.total)} h</Typography>
              <Link to={`/report/${site.id}?month=${month}`}>
                Raport do wysłania
              </Link>
            </CardContent>
          </Card>
        ))}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2">Razem</Typography>
            <Typography variant="h5">{formatHours(total)} h</Typography>
          </CardContent>
        </Card>
      </Stack>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Pracownik</TableCell>
              {sites.map((site) => (
                <TableCell key={site.id} align="right">
                  {site.name}
                </TableCell>
              ))}
              <TableCell align="right">Razem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                {sites.map((site) => {
                  const hours = employee.bySite[site.id];
                  return (
                    <TableCell key={site.id} align="right">
                      {hours !== undefined && formatHours(hours)}
                    </TableCell>
                  );
                })}
                <TableCell align="right">
                  {formatHours(employee.total)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Razem</TableCell>
              {sites.map((site) => (
                <TableCell key={site.id} align="right">
                  {formatHours(site.total)}
                </TableCell>
              ))}
              <TableCell align="right">{formatHours(total)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
