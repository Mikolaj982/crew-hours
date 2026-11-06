import type { Database } from '../../types/database.types';

type SummaryRow =
  Database['public']['Functions']['get_month_summary']['Returns'][number];

export type SiteTotal = {
  id: string;
  name: string;
  total: number;
};

export type EmployeeTotal = {
  id: string;
  name: string;
  bySite: Record<string, number>;
  total: number;
};

export const buildSummary = (rows: SummaryRow[]) => {
  const sites: Record<string, SiteTotal> = {};
  const employees: Record<string, EmployeeTotal> = {};
  let total = 0;

  for (const row of rows) {
    sites[row.site_id] ??= { id: row.site_id, name: row.site_name, total: 0 };
    sites[row.site_id].total += row.total_hours;

    employees[row.employee_id] ??= {
      id: row.employee_id,
      name: row.employee_name,
      bySite: {},
      total: 0,
    };
    employees[row.employee_id].bySite[row.site_id] = row.total_hours;
    employees[row.employee_id].total += row.total_hours;

    total += row.total_hours;
  }

  return {
    sites: Object.values(sites),
    employees: Object.values(employees).sort((a, b) =>
      a.name.localeCompare(b.name, 'pl'),
    ),
    total,
  };
};
