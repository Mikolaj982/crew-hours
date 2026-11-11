import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { useSites } from '../../features/sites/useSites';
import { SiteTabs } from '../../features/hours/SiteTabs';
import { MonthSwitcher } from '../../features/hours/MonthSwitcher';
import { HoursGrid } from '../../features/hours/HoursGrid';
import { MobileHours } from '../../features/hours/MobileHours';
import { InvalidInputsProvider } from '../../features/hours/InvalidInputsProvider';
import { UnsavedHoursGuard } from '../../features/hours/UnsavedHoursGuard';
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

const DAY_PANEL_STATE = 'dayPanel';

export const HoursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: sites, isPending, isError } = useSites();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const location = useLocation();
  const navigate = useNavigate();

  const month = parseMonthParam(searchParams.get('month'));
  const dayParam = searchParams.get('day');
  const openDay =
    dayParam && getMonthDays(month).some((day) => day.date === dayParam)
      ? dayParam
      : null;
  const isPanelInHistory = location.state === DAY_PANEL_STATE;

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
    updates: Partial<Record<'site' | 'month' | 'day', string | null>>,
    options?: { replace?: boolean; state?: unknown },
  ) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      return next;
    }, options);
  };

  const closeDayPanel = () => {
    if (isPanelInHistory) {
      navigate(-1);
    } else {
      setParams({ day: null }, { replace: true });
    }
  };

  return (
    <InvalidInputsProvider>
      <UnsavedHoursGuard />
      <Stack spacing={2}>
        <Paper variant="outlined">
          <SiteTabs
            sites={tabSites}
            selectedSiteId={selectedSite.id}
            onSelect={(id) => setParams({ site: id })}
          />
        </Paper>
        {isMobile ? (
          <MobileHours
            siteId={selectedSite.id}
            month={month}
            openDay={openDay}
            onMonthChange={(value) => setParams({ month: value })}
            onOpenDay={(value) =>
              setParams({ day: value }, { state: DAY_PANEL_STATE })
            }
            onDayChange={(value) =>
              setParams(
                { day: value, month: value.slice(0, 7) },
                { replace: true, state: location.state },
              )
            }
            onClose={closeDayPanel}
          />
        ) : (
          <>
            <MonthSwitcher
              month={month}
              onChange={(value) => setParams({ month: value })}
            />
            <HoursGrid
              key={`${selectedSite.id}-${month}`}
              siteId={selectedSite.id}
              month={month}
            />
          </>
        )}
      </Stack>
    </InvalidInputsProvider>
  );
};
