import Dexie from "dexie";
import * as R from "ramda";
import { modelTypes } from "../constants";
import findings from "./data/raw-findings";
import groupedFindings from "./data/grouped-findings";
import { applyFilterToList, applySortToList, calcPaginatedList } from "./utils";

const db = new Dexie("silk");
db.version(1).stores({
  [modelTypes.findings]:
    "id, model, source_security_tool_name, source_collbartion_tool_name, severityWeight, finding_created, ticket_created, grouped_finding_id",
  [modelTypes.groupedFindings]:
    "id, model, remediation, severityWeight, grouped_finding_created, sla, security_analyst, owner, workflow, status, progress",
});
db[modelTypes.findings].bulkAdd(findings);
db[modelTypes.groupedFindings].bulkAdd(groupedFindings);

export const handleListResponse = async (model, request) => {
  const params = new URLSearchParams(R.path(["url", "search"], request));

  const [list, totalCount] = await db.open().then(async () => {
    let result = db[model];
    result = applySortToList(params, result);
    result = applyFilterToList(params, result);
    const totalCount = await result.count();
    const paginatedList = await calcPaginatedList(params, result);
    return [paginatedList, totalCount];
  });

  return {
    data: list,
    meta: { totalCount },
  };
};

export const handleGroupedResponse = async (model, request) => {
  const params = new URLSearchParams(R.path(["url", "search"], request));
  const field = params.get("field");

  const records = await db.open().then(async () => {
    let result = db[model];
    result = applySortToList(params, result);
    return result.toArray();
  });

  const grouped = R.reduce(
    (acc, record) => {
      const recordValue = R.prop(field, record);
      const accValue = R.propOr(0, recordValue, acc);
      return {
        ...acc,
        [recordValue]: accValue + 1,
      };
    },
    {},
    records
  );

  return {
    data: grouped,
  };
};
