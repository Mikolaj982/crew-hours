import { useTimeEntries } from './useTimeEntries';

type HoursGridProps = {
  siteId: string;
  month: string;
};

export const HoursGrid = ({ siteId, month }: HoursGridProps) => {
  const { data: entries, isPending, isError } = useTimeEntries(month, siteId);

  if (isPending) {
    return <div>Ładowanie godzin...</div>;
  }

  if (isError) {
    return <div>Nie udało się załadować godzin.</div>;
  }

  if (entries.length === 0) {
    return <p>Brak wpisów w tym miesiącu.</p>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          {entry.date}: {entry.employee_id} — {entry.hours} h
        </li>
      ))}
    </ul>
  );
};
