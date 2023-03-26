import { knownColumnNames, modelTypes } from "../constants";
import { AsyncTable } from "./AsyncTable";
import { FilterBar } from "./FilterBar";
import * as R from "ramda";
import {
  useRawFindingsApiFilter,
  useRawFindingsStore,
} from "../hooks/useModelState";

export const RawFindingsTable = () => {
  const [severity, text, setFilter] = useRawFindingsStore(
    R.props([knownColumnNames.severity, "text", "setFilter"])
  );
  const apiFilter = useRawFindingsApiFilter();

  return (
    <>
      <FilterBar
        text={text}
        setText={setFilter("text")}
        severity={severity}
        setSeverity={setFilter(knownColumnNames.severity)}
      />
      <AsyncTable
        label="Raw Findings"
        model={modelTypes.findings}
        hasPagination
        filter={apiFilter}
        setFilter={setFilter}
      />
    </>
  );
};
