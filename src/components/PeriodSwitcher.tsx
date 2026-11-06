import { Button, IconButton, Stack, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type PeriodSwitcherProps = {
  label: string;
  prevLabel: string;
  nextLabel: string;
  todayLabel: string;
  isCurrent: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export const PeriodSwitcher = ({
  label,
  prevLabel,
  nextLabel,
  todayLabel,
  isCurrent,
  onPrev,
  onNext,
  onToday,
}: PeriodSwitcherProps) => {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <IconButton aria-label={prevLabel} onClick={onPrev}>
        <ChevronLeftIcon />
      </IconButton>
      <Typography
        variant="h6"
        component="p"
        sx={{
          minWidth: { md: '11em' },
          fontSize: { xs: '1rem', md: '1.25rem' },
          textAlign: 'center',
          '&::first-letter': { textTransform: 'uppercase' },
        }}
      >
        {label}
      </Typography>
      <IconButton aria-label={nextLabel} onClick={onNext}>
        <ChevronRightIcon />
      </IconButton>
      {!isCurrent && (
        <Button variant="outlined" size="small" onClick={onToday}>
          {todayLabel}
        </Button>
      )}
    </Stack>
  );
};
