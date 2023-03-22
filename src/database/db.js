import Dexie from "dexie";
import * as R from "ramda";
import { modelTypes } from "../constants";
import findings from "./data/raw-findings";
import groupedFindings from "./data/grouped-findings";
import { isNotNil } from "../utils";

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
  const [list, filteredCount] = await db.open().then(async () => {
    let result = db[model];
    result = applySortToList(params, result);
    result = applyFilterToList(params, result);
    const filteredCount = await result.count();
    const paginatedList = await calcPaginatedList(params, result);
    return [paginatedList, filteredCount];
  });

  const totalCount = await db[model].count();

  return {
    data: list,
    meta: { totalCount, filteredCount },
  };
};

function applySortToList(params, collection) {
  const sortField = params.get("sort[sortField]") || params.get("sort[field]");
  if (sortField) {
    const sortedCollection = collection.orderBy(sortField);
    const sortDirection = params.get("sort[direction]");
    if (R.equals("desc", sortDirection)) {
      return sortedCollection.reverse();
    }
    return sortedCollection;
  }
  return collection;
}

function applyFilterToList(params, collection) {
  const filteredCollection = filterByGroupFindingId(params, collection);
  return filteredCollection;
}

function filterByGroupFindingId(params, collection) {
  const groupIdFilterValue = params.get("filter[grouped_finding_id]");
  if (isNotNil(groupIdFilterValue)) {
    collection = collection.filter(
      R.propEq("grouped_finding_id", parseInt(groupIdFilterValue, 10))
    );
  }
  return collection;
}

async function calcPaginatedList(params, collection) {
  const perPageCount = params.get("perPageCount") || 100;
  const pageOffsetCount = params.get("pageOffsetCount") || 0;
  const offsetCount = perPageCount * pageOffsetCount;
  const paginatedList = await collection
    .offset(offsetCount)
    .limit(perPageCount)
    .toArray();
  return paginatedList;
}
