import { Link, useSearchParams } from 'react-router';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import { MonthSwitcher } from '../../features/hours/MonthSwitcher';
import { formatHours, parseMonthParam } from '../../features/hours/calendar';
import { useMonthSummary } from '../../features/summary/useMonthSummary';
import { buildSummary } from '../../features/summary/summary';
import { Loading } from '../../components/Loading';
import { ClampedText } from '../../components/ClampedText';

const statCards = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
};

const totalCell = { fontWeight: 'bold' };

const nameCell = { minWidth: 90, maxWidth: 160 };

export const SummaryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const month = parseMonthParam(searchParams.get('month'));
  const { data, isPending, isError } = useMonthSummary(month);

  const renderContent = () => {
    if (isPending) {
      return <Loading />;
    }

    if (isError) {
      return (
        <Alert severity="error">Nie udało się załadować podsumowania.</Alert>
      );
    }

    const { sites, employees, total } = buildSummary(data);

    if (sites.length === 0) {
      return <Alert severity="info">Brak godzin w tym miesiącu.</Alert>;
    }

    return (
      <>
        <Box sx={statCards}>
          {sites.map((site) => (
            <Card key={site.id} variant="outlined" sx={{ minWidth: 0 }}>
              <CardContent sx={{ pb: 0 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  title={site.name}
                >
                  {site.name}
                </Typography>
                <Typography variant="h4" component="p">
                  {formatHours(site.total)} h
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/report/${site.id}?month=${month}`}
                  size="small"
                  startIcon={<IosShareIcon />}
                >
                  Raport do wysłania
                </Button>
              </CardActions>
            </Card>
          ))}
          <Card
            variant="outlined"
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
          >
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Razem
              </Typography>
              <Typography variant="h4" component="p">
                {formatHours(total)} h
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pracownik</TableCell>
                {sites.map((site) => (
                  <TableCell key={site.id} align="right" sx={nameCell}>
                    <ClampedText text={site.name} />
                  </TableCell>
                ))}
                <TableCell align="right" sx={totalCell}>
                  Razem
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell sx={nameCell}>
                    <ClampedText text={employee.name} />
                  </TableCell>
                  {sites.map((site) => {
                    const hours = employee.bySite[site.id];
                    return (
                      <TableCell key={site.id} align="right">
                        {hours === undefined ? (
                          <Typography component="span" color="text.disabled">
                            –
                          </Typography>
                        ) : (
                          formatHours(hours)
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell align="right" sx={totalCell}>
                    {formatHours(employee.total)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ '& td': { borderBottom: 0, ...totalCell } }}>
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
      </>
    );
  };

  return (
    <Stack spacing={2}>
      <MonthSwitcher
        month={month}
        onChange={(value) => setSearchParams({ month: value })}
      />
      {renderContent()}
    </Stack>
  );
};
