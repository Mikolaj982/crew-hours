import { Alert, Stack } from '@mui/material';
import { useEmployees } from '../../features/employees/useEmployees';
import { useSites } from '../../features/sites/useSites';
import { EmployeesPanel } from '../../features/employees/EmployeesPanel';
import { SitesPanel } from '../../features/sites/SitesPanel';
import { Loading } from '../../components/Loading';

export const StaffAndSitesPage = () => {
  const employeesQuery = useEmployees();
  const sitesQuery = useSites();

  if (employeesQuery.isPending || sitesQuery.isPending) {
    return <Loading />;
  }

  if (employeesQuery.isError) {
    return (
      <Alert severity="error">Nie udało się załadować listy pracowników.</Alert>
    );
  }

  if (sitesQuery.isError) {
    return <Alert severity="error">Nie udało się załadować listy budów.</Alert>;
  }

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ alignItems: { md: 'flex-start' } }}
    >
      <EmployeesPanel employees={employeesQuery.data} />
      <SitesPanel sites={sitesQuery.data} />
    </Stack>
  );
};
