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

export const modelStoreHandler = (set, get) => ({
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

export const useGroupedFindingsStore = create(modelStoreHandler);
export const useGroupedFindingsApiFilter = () =>
  useGroupedFindingsStore(apiFilterSelector);

export const useRawFindingsStore = create(modelStoreHandler);
export const useRawFindingsApiFilter = () =>
  useRawFindingsStore(apiFilterSelector);

export const modelStoreHooks = {
  [modelTypes.findings]: useRawFindingsStore,
  [modelTypes.groupedFindings]: useGroupedFindingsStore,
};
