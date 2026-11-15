import { describe, expect, it } from 'vitest';
import { parseHours } from './parseHours';

describe('parseHours', () => {
  it('allows full hours', () => {
    expect(parseHours('8')).toEqual({ ok: true, hours: 8 });
  });

  it('allows half-hours with comma and dot', () => {
    expect(parseHours('7,5')).toEqual({ ok: true, hours: 7.5 });
    expect(parseHours('7.5')).toEqual({ ok: true, hours: 7.5 });
  });

  it('ignores spaces at the beginning and end', () => {
    expect(parseHours('  6 ')).toEqual({ ok: true, hours: 6 });
  });

  it.each(['', '   ', '0', '0,0'])(
    'treats "%s" as no hours (removal of entry)',
    (text) => {
      expect(parseHours(text)).toEqual({ ok: true, hours: null });
    },
  );

  it.each([
    ['0,5', 0.5],
    ['24', 24],
  ])('allows boundary value "%s"', (text, hours) => {
    expect(parseHours(text)).toEqual({ ok: true, hours });
  });

  it.each(['abc', '-1', '8,', ',5', '1e1', '0x10', '7,25', '100'])(
    'rejects "%s" as invalid format',
    (text) => {
      expect(parseHours(text)).toEqual({
        ok: false,
        error: 'Wpisz liczbę, np. 8 albo 7,5',
      });
    },
  );

  it('rejects more than 24 hours', () => {
    expect(parseHours('24,5')).toEqual({
      ok: false,
      error: 'Godziny muszą być w zakresie 0-24',
    });
  });

  it.each(['6,75', '7,3', '0,1'])(
    'rejects "%s", because it is not a full or half hour',
    (text) => {
      const result = parseHours(text);

      expect(result.ok).toBe(false);
    },
  );
});
