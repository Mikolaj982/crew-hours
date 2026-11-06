import { useState } from 'react';
import { Alert, Card, CardContent, CardHeader } from '@mui/material';
import type { Tables } from '../../types/database.types';
import { AddSiteForm } from './AddSiteForm';
import { useSetSiteActive } from './useSetSiteActive';
import { ArchivableList } from '../../components/ArchivableList';
import { ArchiveSection } from '../../components/ArchiveSection';
import { UndoSnackbar } from '../../components/UndoSnackbar';
import type { UndoMessage } from '../../components/UndoSnackbar';

type SitesPanelProps = {
  sites: Tables<'sites'>[];
};

export const SitesPanel = ({ sites }: SitesPanelProps) => {
  const { mutate, isPending, isError, variables } = useSetSiteActive();
  const [undo, setUndo] = useState<UndoMessage | null>(null);

  const activeSites = sites.filter((site) => site.is_active);
  const archivedSites = sites.filter((site) => !site.is_active);
  const pendingId = isPending ? variables.siteId : undefined;

  const setActive = (site: Tables<'sites'>, isActive: boolean) => {
    mutate(
      { siteId: site.id, isActive },
      {
        onSuccess: () =>
          setUndo({
            text: `${isActive ? 'Przywrócono' : 'Zarchiwizowano'}: ${site.name}`,
            onUndo: () => mutate({ siteId: site.id, isActive: !isActive }),
          }),
        onError: (error) => console.error('Error moving site status', error),
      },
    );
  };

  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardHeader title="Budowy" subheader={`Aktywne: ${activeSites.length}`} />
      <CardContent sx={{ pt: 0 }}>
        <AddSiteForm />
        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Nie udało się zmienić statusu budowy.
          </Alert>
        )}
        <ArchivableList
          items={activeSites}
          archived={false}
          pendingId={pendingId}
          emptyText="Nie ma jeszcze budów. Dodaj pierwszą powyżej."
          onToggle={(site) => setActive(site, false)}
        />
        <ArchiveSection count={archivedSites.length}>
          <ArchivableList
            items={archivedSites}
            archived
            pendingId={pendingId}
            emptyText=""
            onToggle={(site) => setActive(site, true)}
          />
        </ArchiveSection>
      </CardContent>
      <UndoSnackbar message={undo} onClose={() => setUndo(null)} />
    </Card>
  );
};
