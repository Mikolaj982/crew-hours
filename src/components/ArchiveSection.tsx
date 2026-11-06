import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type ArchiveSectionProps = {
  count: number;
  children: ReactNode;
};

export const ArchiveSection = ({ count, children }: ArchiveSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (count === 0) {
    return null;
  }

  return (
    <>
      <Button
        color="inherit"
        size="small"
        endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        sx={{ mt: 1, color: 'text.secondary' }}
      >
        Archiwum ({count})
      </Button>
      <Collapse in={isOpen}>{children}</Collapse>
    </>
  );
};
