import { Link, NavLink, Outlet, useLocation } from 'react-router';
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import { supabase } from '../../lib/supabase';

const NAV_ITEMS = [
  { to: '/', label: 'Godziny', icon: <AccessTimeIcon /> },
  { to: '/summary', label: 'Podsumowanie', icon: <SummarizeIcon /> },
  { to: '/staff', label: 'Pracownicy i budowy', icon: <GroupsIcon /> },
];

const BOTTOM_NAV_HEIGHT = 56;

export const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { pathname } = useLocation();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 4 }}>
            Godzinówka
          </Typography>
          {!isMobile && (
            <Stack direction="row" spacing={1}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end
                  color="inherit"
                  startIcon={item.icon}
                  sx={{
                    opacity: 0.8,
                    '&.active': { opacity: 1, bgcolor: 'rgba(0,0,0,0.15)' },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Wyloguj">
            <IconButton
              color="inherit"
              aria-label="Wyloguj"
              onClick={() => supabase.auth.signOut()}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container
        component="main"
        maxWidth="xl"
        sx={{ py: 3, pb: isMobile ? `${BOTTOM_NAV_HEIGHT + 24}px` : 3 }}
      >
        <Outlet />
      </Container>

      {isMobile && (
        <Paper
          elevation={8}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        >
          <BottomNavigation showLabels value={pathname}>
            {NAV_ITEMS.map((item) => (
              <BottomNavigationAction
                key={item.to}
                component={Link}
                to={item.to}
                value={item.to}
                label={item.to === '/staff' ? 'Ludzie' : item.label}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
};
