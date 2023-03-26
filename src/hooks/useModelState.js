import {
  highToLowRankedSeverities,
  knownColumnNames,
  modelTypes,
} from "../constants";
import * as R from "ramda";
import { isFunction } from "../utils";
import { create } from "zustand";

const initialState = {
  severity: highToLowRankedSeverities,
  text: "",
};

export const modelStateHandler = (set, get) => ({
  ...initialState,
  setFilter: R.curry((key, value) => {
    set(R.assoc(key, isFunction(value) ? value(get().severity) : value));
  }),
  setSeverity: (arg) => set(isFunction(arg) ? arg(get().severity) : arg),
});

export const apiFilterSelector = R.pipe(
  R.pick([knownColumnNames.severity, "text"]),
  R.over(R.lensProp(knownColumnNames.severity), R.join(","))
);

export const useGroupedFindingsState = create(modelStateHandler);
export const useGroupedFindingsApiFilter = () =>
  useGroupedFindingsState(apiFilterSelector);

export const useRawFindingsState = create(modelStateHandler);
export const useRawFindingsApiFilter = () =>
  useRawFindingsState(apiFilterSelector);

export const modelStateHooks = {
  [modelTypes.findings]: useRawFindingsState,
  [modelTypes.groupedFindings]: useGroupedFindingsState,
};
