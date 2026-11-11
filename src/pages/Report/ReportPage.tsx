import { Link, useParams, useSearchParams } from 'react-router';
import { Alert, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { parseMonthParam } from '../../features/hours/calendar';
import { SiteReport } from '../../features/report/SiteReport';

export const ReportPage = () => {
  const { siteId } = useParams();
  const [searchParams] = useSearchParams();
  const month = parseMonthParam(searchParams.get('month'));

  return (
    <Box sx={{ maxWidth: 1480, mx: 'auto', p: 2 }}>
      <Button
        component={Link}
        to={`/summary?month=${month}`}
        startIcon={<ArrowBackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Wróć do podsumowania
      </Button>
      {siteId ? (
        <SiteReport siteId={siteId} month={month} />
      ) : (
        <Alert severity="warning">Nie wybrano budowy.</Alert>
      )}
    </Box>
  );
};
