import {
  highToLowRankedSeverities,
  modelTypes,
  rankedSeverities,
} from "../constants";
import { AsyncTable } from "./AsyncTable";
import { GroupedFindingsRowDetails } from "./GroupedFindingsRowDetails";
import { create } from "zustand";
import { FilterBar } from "./FilterBar";
import * as R from "ramda";

const initialState = {
  severity: highToLowRankedSeverities,
  text: "",
};

export const useGroupedFindingsFilter = create((set, get) => ({
  ...initialState,
  setFilter: R.curry((key, value) => {
    set(R.assoc(key, value));
  }),
  setSeverity: (callback) => set(callback(get().severity)),
}));

const apiFilterSelector = R.pipe(
  R.pick(["severity", "text"]),
  R.over(R.lensProp("severity"), R.join(","))
);

export const GroupedFindingsTable = () => {
  const [severity, text, setFilter] = useGroupedFindingsFilter(
    R.props(["severity", "text", "setFilter"])
  );
  const apiFilter = useGroupedFindingsFilter(apiFilterSelector);

  return (
    <>
      <FilterBar
        text={text}
        setText={setFilter("text")}
        severity={severity}
        setSeverity={setFilter("severity")}
      />
      <AsyncTable
        label="Grouped Findings"
        model={modelTypes.groupedFindings}
        RowDetailRenderer={GroupedFindingsRowDetails}
        hasPagination
        filter={apiFilter}
      />
    </>
  );
};
