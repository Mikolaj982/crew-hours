import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';

type Item = {
  id: string;
  name: string;
};

type ArchivableListProps<T extends Item> = {
  items: T[];
  archived: boolean;
  pendingId: string | undefined;
  emptyText: string;
  onToggle: (item: T) => void;
};

export const ArchivableList = <T extends Item>({
  items,
  archived,
  pendingId,
  emptyText,
  onToggle,
}: ArchivableListProps<T>) => {
  if (items.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 2, px: 2 }}>
        {emptyText}
      </Typography>
    );
  }

  const actionLabel = archived ? 'Przywróć' : 'Archiwizuj';

  return (
    <List dense>
      {items.map((item) => (
        <ListItem
          key={item.id}
          divider
          secondaryAction={
            <Tooltip title={actionLabel}>
              <IconButton
                edge="end"
                aria-label={`${actionLabel}: ${item.name}`}
                disabled={pendingId === item.id}
                onClick={() => onToggle(item)}
              >
                {archived ? <UnarchiveOutlinedIcon /> : <ArchiveOutlinedIcon />}
              </IconButton>
            </Tooltip>
          }
        >
          <ListItemText
            primary={item.name}
            sx={archived ? { color: 'text.secondary' } : undefined}
          />
        </ListItem>
      ))}
    </List>
  );
};
