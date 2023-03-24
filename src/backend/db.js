import Dexie from "dexie";
import * as R from "ramda";
import { modelTypes } from "../constants";
import findings from "./data/raw-findings";
import groupedFindings from "./data/grouped-findings";
import {
  applyFilterToList,
  applySortToList,
  calcGroupedValues,
  calcPaginatedList,
} from "./utils";

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

  const [records, totalCount] = await db.open().then(async () => {
    let collection = db[model];
    collection = applySortToList(params, collection);
    collection = applyFilterToList(params, collection);
    const totalCount = await collection.count();
    const paginatedList = await calcPaginatedList(params, collection);
    return [paginatedList, totalCount];
  });

  return {
    data: records,
    meta: { totalCount },
  };
};

export const handleGroupedResponse = async (model, request) => {
  const params = new URLSearchParams(R.path(["url", "search"], request));

  const records = await db.open().then(async () => {
    let collection = db[model];
    collection = applySortToList(params, collection);
    return collection.toArray();
  });

  const grouped = calcGroupedValues(params, records);

  return {
    data: grouped,
  };
};
