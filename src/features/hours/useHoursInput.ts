import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { formatHours } from './calendar';
import { parseHours } from './parseHours';
import { useSaveTimeEntry } from './useSaveTimeEntry';
import { useReportInvalid } from './invalidInputsContext';

type UseHoursInputParams = {
  label: string;
  employeeId: string;
  siteId: string;
  date: string;
  savedHours: number | undefined;
};

export const useHoursInput = ({
  label,
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
  const reportInvalid = useReportInvalid();
  const inputRef = useRef<HTMLInputElement>(null);
  const key = `${employeeId}|${siteId}|${date}`;

  useEffect(() => () => reportInvalid(key, null), [key, reportInvalid]);

  const save = () => {
    const result = parseHours(text);

    if (!result.ok) {
      setError(result.error);
      reportInvalid(key, { label, focus: () => inputRef.current?.focus() });
      return;
    }

    setError(null);
    reportInvalid(key, null);

    if (result.hours === (savedHours ?? null)) {
      return;
    }

    mutate(
      { employeeId, siteId, date, hours: result.hours },
      { onError: () => setError('Nie udało się zapisać. Spróbuj ponownie.') },
    );
  };

  const change = (value: string) => {
    setText(value);

    if (error === null) {
      return;
    }

    const result = parseHours(value);

    if (result.ok) {
      setError(null);
      reportInvalid(key, null);
    } else {
      setError(result.error);
    }
  };

  const blurOnEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && event.target instanceof HTMLElement) {
      event.target.blur();
    }
  };

  return { text, change, error, isPending, save, blurOnEnter, inputRef };
};
