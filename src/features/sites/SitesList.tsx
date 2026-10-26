import type { Tables } from '../../types/database.types';
import { useSetSiteActive } from './useSetSiteActive';
import type { SetSiteActiveParams } from './api';

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
    <>
      <ul>
        {sites.map((site) => (
          <li key={site.id}>
            {site.name}
            <span>{site.is_active ? 'aktywna' : 'nieaktywna'}</span>
            <button
              disabled={isPending}
              onClick={() =>
                handleActive({ siteId: site.id, isActive: !site.is_active })
              }
            >
              {site.is_active ? 'archiwizuj' : 'przywróć'}
            </button>
          </li>
        ))}
      </ul>
      {isError && (
        <p style={{ color: 'red' }}>
          Wystąpił błąd podczas przenoszenia budowy
        </p>
      )}
    </>
  );
};
