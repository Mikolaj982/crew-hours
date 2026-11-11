import { useRef, useState } from 'react';
import { format, parse } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import { useSites } from '../sites/useSites';
import { useEmployees } from '../employees/useEmployees';
import { useTimeEntries } from '../hours/useTimeEntries';
import { buildHoursMatrix } from '../hours/matrix';
import { getMonthDays } from '../hours/calendar';
import { Loading } from '../../components/Loading';
import { ReportGrid } from './ReportGrid';
import {
  canShareFiles,
  downloadFile,
  renderPng,
  shareFile,
  toFileName,
} from './exportImage';

type SiteReportProps = {
  siteId: string;
  month: string;
};

const companyName = import.meta.env.VITE_COMPANY_NAME;

export const SiteReport = ({ siteId, month }: SiteReportProps) => {
  const sitesQuery = useSites();
  const employeesQuery = useEmployees();
  const entriesQuery = useTimeEntries(month, siteId);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

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
  const monthName = format(parse(month, 'yyyy-MM', new Date()), 'LLLL yyyy', {
    locale: pl,
  });
  const period = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const canShare = canShareFiles();

  const handleExport = async (mode: 'share' | 'download') => {
    if (!gridRef.current) {
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const file = await renderPng(
        gridRef.current,
        toFileName('raport', site.name, month),
      );

      if (mode === 'share') {
        await shareFile(file, `${site.name}, ${period}`);
      } else {
        downloadFile(file);
      }
    } catch (error) {
      console.error('Error exporting report', error);
      setExportError('Nie udało się przygotować pliku. Spróbuj ponownie.');
    } finally {
      setIsExporting(false);
    }
  };

  if (people.length === 0) {
    return (
      <Alert severity="info">Brak godzin na tej budowie w tym miesiącu.</Alert>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {canShare && (
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            disabled={isExporting}
            onClick={() => handleExport('share')}
          >
            Udostępnij
          </Button>
        )}
        <Button
          variant={canShare ? 'outlined' : 'contained'}
          startIcon={<DownloadIcon />}
          disabled={isExporting}
          onClick={() => handleExport('download')}
        >
          Pobierz PNG
        </Button>
      </Stack>

      {exportError && <Alert severity="error">{exportError}</Alert>}

      <Box>
        <Typography variant="caption" color="text.secondary">
          Podgląd pliku. Na telefonie przesuń w bok, aby zobaczyć cały miesiąc.
        </Typography>
        <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
          <ReportGrid
            ref={gridRef}
            companyName={companyName}
            siteName={site.name}
            period={period}
            days={getMonthDays(month)}
            people={people}
            matrix={matrix}
          />
        </Paper>
      </Box>
    </Stack>
  );
};
