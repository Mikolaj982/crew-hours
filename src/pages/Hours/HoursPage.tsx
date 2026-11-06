import { Link, useSearchParams } from 'react-router';
import { format } from 'date-fns';
import { useSites } from '../../features/sites/useSites';
import { SiteTabs } from '../../features/hours/SiteTabs';
import { MonthSwitcher } from '../../features/hours/MonthSwitcher';
import { HoursGrid } from '../../features/hours/HoursGrid';
import { DayView } from '../../features/hours/DayView';
import { getMonthDays, parseMonthParam } from '../../features/hours/calendar';
import {
  Alert,
  Button,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Loading } from '../../components/Loading';

export const HoursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: sites, isPending, isError } = useSites();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const today = format(new Date(), 'yyyy-MM-dd');
  const month = parseMonthParam(searchParams.get('month'));

  const dayParam = searchParams.get('day');
  const isDayInMonth = (date: string) =>
    getMonthDays(month).some((monthDay) => monthDay.date === date);
  const day =
    dayParam && isDayInMonth(dayParam)
      ? dayParam
      : isDayInMonth(today)
        ? today
        : `${month}-01`;

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <Alert severity="error">Nie udało się załadować listy budów.</Alert>;
  }

  if (sites.length === 0) {
    return (
      <Alert
        severity="info"
        action={
          <Button component={Link} to="/staff" color="inherit" size="small">
            Dodaj budowę
          </Button>
        }
      >
        Nie ma jeszcze żadnej budowy.
      </Alert>
    );
  }

  const siteId =
    searchParams.get('site') ?? sites.find((site) => site.is_active)?.id;
  const selectedSite = sites.find((site) => site.id === siteId);

  if (!selectedSite) {
    return (
      <Alert
        severity="warning"
        action={
          <Button component={Link} to="/staff" color="inherit" size="small">
            Budowy
          </Button>
        }
      >
        Nie znaleziono budowy. Mogła zostać usunięta albo wszystkie budowy są
        zarchiwizowane.
      </Alert>
    );
  }

  const tabSites = sites.filter(
    (site) => site.is_active || site.id === selectedSite.id,
  );

  const setParams = (
    updates: Partial<Record<'site' | 'month' | 'day', string>>,
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        next.set(key, value);
      }
      return next;
    });
  };

  return (
    <Stack spacing={2}>
      <Paper variant="outlined">
        <SiteTabs
          sites={tabSites}
          selectedSiteId={selectedSite.id}
          onSelect={(id) => setParams({ site: id })}
        />
      </Paper>
      {isMobile ? (
        <DayView
          siteId={selectedSite.id}
          day={day}
          onDayChange={(value) =>
            setParams({ day: value, month: value.slice(0, 7) })
          }
        />
      ) : (
        <>
          <MonthSwitcher
            month={month}
            onChange={(value) => setParams({ month: value })}
          />
          <HoursGrid siteId={selectedSite.id} month={month} />
        </>
      )}
    </Stack>
  );
};
