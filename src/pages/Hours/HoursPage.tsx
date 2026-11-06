import { Link, useSearchParams } from 'react-router';
import { format } from 'date-fns';
import { useSites } from '../../features/sites/useSites';
import { SiteTabs } from '../../features/hours/SiteTabs';
import { MonthSwitcher } from '../../features/hours/MonthSwitcher';

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export const HoursPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: sites, isPending, isError } = useSites();

  const monthParam = searchParams.get('month');
  const month =
    monthParam && MONTH_PATTERN.test(monthParam)
      ? monthParam
      : format(new Date(), 'yyyy-MM');

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

  const setParam = (key: 'site' | 'month', value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      return next;
    });
  };

  return (
    <div>
      <h1>Godziny</h1>
      <SiteTabs
        sites={tabSites}
        selectedSiteId={selectedSite.id}
        onSelect={(id) => setParam('site', id)}
      />
      <MonthSwitcher
        month={month}
        onChange={(value) => setParam('month', value)}
      />
    </div>
  );
};
