import { knownColumnNames, modelTypes } from "../constants";
import { AsyncTable } from "./AsyncTable";
import { GroupedFindingsRowDetails } from "./GroupedFindingsRowDetails";
import { FilterBar } from "./FilterBar";
import * as R from "ramda";
import {
  useGroupedFindingsApiFilter,
  useGroupedFindingsStore,
} from "../hooks/useModelState";

export const GroupedFindingsTable = () => {
  const [severity, text, setFilter] = useGroupedFindingsStore(
    R.props([knownColumnNames.severity, "text", "setFilter"])
  );
  const apiFilter = useGroupedFindingsApiFilter();

  return (
    <>
      <FilterBar
        text={text}
        setText={setFilter("text")}
        severity={severity}
        setSeverity={setFilter(knownColumnNames.severity)}
      />
      <AsyncTable
        label="Grouped Findings"
        model={modelTypes.groupedFindings}
        RowDetailRenderer={GroupedFindingsRowDetails}
        hasPagination
        filter={apiFilter}
        setFilter={setFilter}
      />
    </>
  );
};
