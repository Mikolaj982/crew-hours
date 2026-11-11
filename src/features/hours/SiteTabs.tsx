import { Tab, Tabs } from '@mui/material';
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
    <Tabs
      value={selectedSiteId}
      onChange={(_event, siteId: string) => onSelect(siteId)}
      variant="scrollable"
      allowScrollButtonsMobile
      aria-label="Budowy"
    >
      {sites.map((site) => (
        <Tab
          key={site.id}
          sx={{ maxWidth: 240, overflowWrap: 'anywhere' }}
          value={site.id}
          label={site.is_active ? site.name : `${site.name} (archiwum)`}
        />
      ))}
    </Tabs>
  );
};
