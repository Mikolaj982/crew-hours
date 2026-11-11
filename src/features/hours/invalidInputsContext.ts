import { createContext, useContext } from 'react';

export type InvalidInput = {
  label: string;
  focus: () => void;
};

export type ReportInvalid = (key: string, input: InvalidInput | null) => void;

type InvalidInputsState = {
  invalidInputs: InvalidInput[];
  hasInvalid: () => boolean;
};

export const ReportInvalidContext = createContext<ReportInvalid>(() => {});

export const InvalidInputsContext = createContext<InvalidInputsState>({
  invalidInputs: [],
  hasInvalid: () => false,
});

export const useReportInvalid = () => useContext(ReportInvalidContext);

export const useInvalidInputs = () => useContext(InvalidInputsContext);
