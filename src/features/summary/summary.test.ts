import { buildSummary } from './summary';
import { describe, it, expect } from 'vitest';

describe('summary', () => {
  it('builds summary correctly', () => {
    const rows = [
      {
        site_id: 'site1',
        site_name: 'Site 1',
        employee_id: 'emp1',
        employee_name: 'Alice',
        total_hours: 5,
      },
      {
        site_id: 'site1',
        site_name: 'Site 1',
        employee_id: 'emp2',
        employee_name: 'Bob',
        total_hours: 3,
      },
      {
        site_id: 'site2',
        site_name: 'Site 2',
        employee_id: 'emp1',
        employee_name: 'Alice',
        total_hours: 2,
      },
    ];

    const summary = buildSummary(rows);

    expect(summary).toEqual({
      sites: [
        { id: 'site1', name: 'Site 1', total: 8 },
        { id: 'site2', name: 'Site 2', total: 2 },
      ],
      employees: [
        { id: 'emp1', name: 'Alice', bySite: { site1: 5, site2: 2 }, total: 7 },
        { id: 'emp2', name: 'Bob', bySite: { site1: 3 }, total: 3 },
      ],
      total: 10,
    });
  });

  it('handles empty input', () => {
    const summary = buildSummary([]);
    expect(summary).toEqual({ sites: [], employees: [], total: 0 });
  });

  it('sorts employees by name', () => {
    const rows = [
      {
        site_id: 'site1',
        site_name: 'Site 1',
        employee_id: 'emp2',
        employee_name: 'Bob',
        total_hours: 3,
      },
      {
        site_id: 'site1',
        site_name: 'Site 1',
        employee_id: 'emp1',
        employee_name: 'Alice',
        total_hours: 5,
      },
    ];

    const summary = buildSummary(rows);
    expect(summary.employees).toEqual([
      { id: 'emp1', name: 'Alice', bySite: { site1: 5 }, total: 5 },
      { id: 'emp2', name: 'Bob', bySite: { site1: 3 }, total: 3 },
    ]);
  });

  it('keeps totals consistent across sites and employees', () => {
    const row = (
      site_id: string,
      employee_id: string,
      total_hours: number,
    ) => ({
      site_id,
      site_name: site_id,
      employee_id,
      employee_name: employee_id,
      total_hours,
    });

    const rows = [
      row('site1', 'emp1', 40.5),
      row('site1', 'emp2', 32),
      row('site2', 'emp1', 16.5),
      row('site2', 'emp3', 8),
      row('site3', 'emp2', 7.5),
      row('site3', 'emp3', 24),
    ];

    const sum = (values: number[]) => values.reduce((acc, v) => acc + v, 0);
    const summary = buildSummary(rows);

    expect(summary.total).toBe(sum(rows.map((r) => r.total_hours)));
    expect(sum(summary.sites.map((s) => s.total))).toBe(summary.total);
    expect(sum(summary.employees.map((e) => e.total))).toBe(summary.total);

    for (const employee of summary.employees) {
      expect(sum(Object.values(employee.bySite))).toBe(employee.total);
    }
  });
});
