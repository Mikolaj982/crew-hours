import { Box, CircularProgress } from '@mui/material';

export const Loading = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress aria-label="Ładowanie" />
    </Box>
  );
};
