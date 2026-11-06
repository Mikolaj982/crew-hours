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
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      {siteId ? (
        <SiteReport siteId={siteId} month={month} />
      ) : (
        <Alert severity="warning">Nie wybrano budowy.</Alert>
      )}
      <Button
        component={Link}
        to={`/summary?month=${month}`}
        startIcon={<ArrowBackIcon />}
        size="small"
        sx={{ mt: 3 }}
      >
        Wróć do podsumowania
      </Button>
    </Box>
  );
};
