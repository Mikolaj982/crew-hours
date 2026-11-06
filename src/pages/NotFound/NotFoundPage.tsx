import { Link } from 'react-router';
import { Button, Stack, Typography } from '@mui/material';

export const NotFoundPage = () => {
  return (
    <Stack
      spacing={2}
      sx={{ alignItems: 'center', textAlign: 'center', py: 8 }}
    >
      <Typography variant="h2" component="p" color="text.disabled">
        404
      </Typography>
      <Typography variant="h5" component="h1">
        Nie znaleziono strony
      </Typography>
      <Typography color="text.secondary">
        Adres jest nieprawidłowy albo strona została przeniesiona.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Wróć do godzin
      </Button>
    </Stack>
  );
};
