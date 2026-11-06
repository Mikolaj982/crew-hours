import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

type DayFlags = {
  isWeekend: boolean;
  isToday: boolean;
};

export const dayCellBg =
  ({ isWeekend, isToday }: DayFlags) =>
  (theme: Theme) => {
    if (isToday) {
      return alpha(theme.palette.primary.main, 0.1);
    }
    if (isWeekend) {
      return theme.palette.action.hover;
    }
    return undefined;
  };
