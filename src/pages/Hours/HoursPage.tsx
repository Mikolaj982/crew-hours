import { Link, useSearchParams } from 'react-router';
import { format } from 'date-fns';
import { useSites } from '../../features/sites/useSites';
import { SiteTabs } from '../../features/hours/SiteTabs';
import { MonthSwitcher } from '../../features/hours/MonthSwitcher';
import { HoursGrid } from '../../features/hours/HoursGrid';
import { DayView } from '../../features/hours/DayView';
import { getMonthDays, parseMonthParam } from '../../features/hours/calendar';
import { useMediaQuery, useTheme } from '@mui/material';

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
    return <div>Ładowanie...</div>;
  }

  if (isError) {
    return <div>Nie udało się załadować listy budów.</div>;
  }

  if (sites.length === 0) {
    return (
      <div>
        <p>Nie ma jeszcze żadnej budowy.</p>
        <Link to="/staff">Dodaj pierwszą budowę</Link>
      </div>
    );
  }

  const siteId =
    searchParams.get('site') ?? sites.find((site) => site.is_active)?.id;
  const selectedSite = sites.find((site) => site.id === siteId);

  if (!selectedSite) {
    return (
      <div>
        <p>Nie znaleziono budowy.</p>
        <Link to="/">Wróć do godzin</Link>
      </div>
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
    <div>
      <h1>Godziny</h1>
      <SiteTabs
        sites={tabSites}
        selectedSiteId={selectedSite.id}
        onSelect={(id) => setParams({ site: id })}
      />
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
    </div>
  );
};
