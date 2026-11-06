import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { formatHours } from './calendar';
import { parseHours } from './parseHours';
import { useSaveTimeEntry } from './useSaveTimeEntry';

type UseHoursInputParams = {
  employeeId: string;
  siteId: string;
  date: string;
  savedHours: number | undefined;
};

export const useHoursInput = ({
  employeeId,
  siteId,
  date,
  savedHours,
}: UseHoursInputParams) => {
  const [text, setText] = useState(
    savedHours === undefined ? '' : formatHours(savedHours),
  );
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useSaveTimeEntry();

  const save = () => {
    const result = parseHours(text);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setError(null);

    if (result.hours === (savedHours ?? null)) {
      return;
    }

    mutate(
      { employeeId, siteId, date, hours: result.hours },
      { onError: () => setError('Nie udało się zapisać. Spróbuj ponownie.') },
    );
  };

  const blurOnEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && event.target instanceof HTMLElement) {
      event.target.blur();
    }
  };

  return { text, setText, error, isPending, save, blurOnEnter };
};
