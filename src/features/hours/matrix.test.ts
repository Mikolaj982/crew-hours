import {
  buildHoursMatrix,
  getDayTotals,
  getVisibleEmployees,
  type TimeEntry,
} from './matrix';
import { describe, expect, it } from 'vitest';

describe('buildHoursMatrix', () => {
  it('builds hours matrix from entries', () => {
    const entries = [
      { employee_id: 'emp1', date: '2023-01-01', hours: 8 },
      { employee_id: 'emp1', date: '2023-01-02', hours: 7 },
      { employee_id: 'emp2', date: '2023-01-01', hours: 6 },
    ];
    const expectedMatrix = {
      emp1: {
        '2023-01-01': 8,
        '2023-01-02': 7,
      },
      emp2: {
        '2023-01-01': 6,
      },
    };
    const result = buildHoursMatrix(entries);
    expect(result).toEqual(expectedMatrix);
  });

  it('handles empty entries', () => {
    const entries: TimeEntry[] = [];
    const expectedMatrix = {};
    const result = buildHoursMatrix(entries);
    expect(result).toEqual(expectedMatrix);
  });
});

describe('getDayTotals', () => {
  it('builds day totals from entries', () => {
    const entries = [
      { employee_id: 'emp1', date: '2023-01-01', hours: 8.5 },
      { employee_id: 'emp1', date: '2023-01-02', hours: 7 },
      { employee_id: 'emp2', date: '2023-01-01', hours: 6 },
    ];

    const expectedTotals = {
      '2023-01-01': 14.5,
      '2023-01-02': 7,
    };

    expect(getDayTotals(entries)).toEqual(expectedTotals);
  });

  it('days without entries do not appear in the result', () => {
    const entries = [
      { employee_id: 'emp1', date: '2023-01-01', hours: 8 },
      { employee_id: 'emp1', date: '2023-01-02', hours: 7.5 },
      { employee_id: 'emp2', date: '2023-01-01', hours: 6 },
    ];

    const result = getDayTotals(entries);
    expect(result).not.toHaveProperty('2023-01-03');
  });
});

describe('getVisibleEmployees', () => {
  it('returns only active employees or those with entries', () => {
    const employees = [
      { id: 'emp1', is_active: true },
      { id: 'emp2', is_active: false },
      { id: 'emp3', is_active: false },
    ];

    const matrix = {
      emp1: { '2023-01-01': 8 },
      emp2: { '2023-01-01': 6 },
    };

    const result = getVisibleEmployees(employees, matrix);
    expect(result).toEqual([
      { id: 'emp1', is_active: true },
      { id: 'emp2', is_active: false },
    ]);
  });

  it('returns an empty array if there are no active employees or entries', () => {
    const employees = [
      { id: 'emp1', is_active: false },
      { id: 'emp2', is_active: false },
    ];

    const matrix = {};
    const result = getVisibleEmployees(employees, matrix);
    expect(result).toEqual([]);
  });
});
