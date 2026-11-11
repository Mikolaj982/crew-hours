import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  InvalidInputsContext,
  ReportInvalidContext,
} from './invalidInputsContext';
import type { InvalidInput, ReportInvalid } from './invalidInputsContext';

type InvalidInputsProviderProps = {
  children: ReactNode;
};

export const InvalidInputsProvider = ({
  children,
}: InvalidInputsProviderProps) => {
  const registry = useRef(new Map<string, InvalidInput>());
  const [invalidInputs, setInvalidInputs] = useState<InvalidInput[]>([]);

  const report = useCallback<ReportInvalid>((key, input) => {
    const map = registry.current;

    if (input) {
      map.set(key, input);
    } else if (!map.delete(key)) {
      return;
    }

    setInvalidInputs([...map.values()]);
  }, []);

  const hasInvalid = useCallback(() => registry.current.size > 0, []);

  const state = useMemo(
    () => ({ invalidInputs, hasInvalid }),
    [invalidInputs, hasInvalid],
  );

  return (
    <ReportInvalidContext.Provider value={report}>
      <InvalidInputsContext.Provider value={state}>
        {children}
      </InvalidInputsContext.Provider>
    </ReportInvalidContext.Provider>
  );
};
