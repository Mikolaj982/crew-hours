import type { Tables } from '../../types/database.types';
import { useSetSiteActive } from './useSetSiteActive';
import type { SetSiteActiveParams } from './api';
import { EmptyList } from '../../components/EmptyList';

type SitesListProps = {
  sites: Tables<'sites'>[];
};

export const SitesList = ({ sites }: SitesListProps) => {
  const { mutate, isPending, isError } = useSetSiteActive();

  const handleActive = (data: SetSiteActiveParams) => {
    mutate(data, {
      onError: (error) => {
        console.error('Error moving site status', error);
      },
    });
  };
  return (
    <ul>
      {isError && <p>Wystąpił błąd podczas pobierania listy</p>}
      {sites.length === 0 ? (
        <EmptyList message="Brak budów do wyświetlenia" />
      ) : (
        sites.map((site) => (
          <li key={site.id}>
            {site.name}
            <p>{site.is_active ? 'aktywna' : 'nieaktywna'}</p>
            <button
              disabled={isPending}
              onClick={() =>
                handleActive({ siteId: site.id, isActive: !site.is_active })
              }
            >
              {site.is_active ? 'archiwizuj' : 'przywróć'}
            </button>
          </li>
        ))
      )}
    </ul>
  );
};
