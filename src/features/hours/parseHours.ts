export type ParseHoursResult =
  { ok: true; hours: number | null } | { ok: false; error: string };

const HOURS_PATTERN = /^\d{1,2}([.,]\d)?$/;

export const parseHours = (text: string): ParseHoursResult => {
  const trimmed = text.trim();

  if (trimmed === '') {
    return { ok: true, hours: null };
  }

  if (!HOURS_PATTERN.test(trimmed)) {
    return { ok: false, error: 'Wpisz liczbę, np. 8 albo 7,5' };
  }

  const hours = Number(trimmed.replace(',', '.'));

  if (hours > 24) {
    return { ok: false, error: 'Godziny muszą być w zakresie 0-24' };
  }

  if (!Number.isInteger(hours * 2)) {
    return { ok: false, error: 'Dozwolone są pełne lub połówkowe godziny' };
  }

  return { ok: true, hours: hours === 0 ? null : hours };
};
