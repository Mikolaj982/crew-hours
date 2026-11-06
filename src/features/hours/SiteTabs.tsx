import type { Tables } from '../../types/database.types';

type SiteTabsProps = {
  sites: Tables<'sites'>[];
  selectedSiteId: string;
  onSelect: (siteId: string) => void;
};

export const SiteTabs = ({
  sites,
  selectedSiteId,
  onSelect,
}: SiteTabsProps) => {
  return (
    <div role="tablist">
      {sites.map((site) => (
        <button
          key={site.id}
          role="tab"
          aria-selected={site.id === selectedSiteId}
          disabled={site.id === selectedSiteId}
          onClick={() => onSelect(site.id)}
        >
          {site.name}
          {!site.is_active && ' (archiwum)'}
        </button>
      ))}
    </div>
  );
};
