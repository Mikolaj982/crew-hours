import { useParams, useSearchParams } from 'react-router';
import { parseMonthParam } from '../../features/hours/calendar';
import { SiteReport } from '../../features/report/SiteReport';

export const ReportPage = () => {
  const { siteId } = useParams();
  const [searchParams] = useSearchParams();
  const month = parseMonthParam(searchParams.get('month'));

  if (!siteId) {
    return <div>Nie wybrano budowy.</div>;
  }

  return <SiteReport siteId={siteId} month={month} />;
};
