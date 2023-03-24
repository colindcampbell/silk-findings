import Dexie from "dexie";
import * as R from "ramda";
import { modelTypes } from "../constants";
import findings from "./data/raw-findings";
import groupedFindings from "./data/grouped-findings";
import { existsAndIsNotEmpty, isNotNil } from "../utils";

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

  // const totalCount = await db[model].count();

  return {
    data: list,
    meta: { totalCount: filteredCount },
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
  const filteredCollection = R.pipe(
    filterByGroupFindingId(params),
    filterBySeverity(params),
    filterByText(params)
  )(collection);
  return filteredCollection;
}

const filterByGroupFindingId = R.curry((params, collection) => {
  const groupIdFilterValue = params.get("filter[grouped_finding_id]");
  if (isNotNil(groupIdFilterValue)) {
    collection = collection.filter(
      R.propEq("grouped_finding_id", parseInt(groupIdFilterValue, 10))
    );
  }
  return collection;
});

const filterBySeverity = R.curry((params, collection) => {
  const severityFilter = params.get("filter[severity]");
  if (isNotNil(severityFilter)) {
    collection = collection.filter(
      R.pipe(R.prop("severity"), R.includes(R.__, severityFilter))
    );
  }
  return collection;
});

const filterByText = R.curry((params, collection) => {
  const textFilter = params.get("filter[text]");
  if (existsAndIsNotEmpty(textFilter)) {
    const textFilterNormalized = R.pipe(R.toLower, (val) => val.trim())(
      textFilter
    );
    collection = collection.filter(
      R.pipe(R.values, R.toString, R.toLower, R.includes(textFilterNormalized))
    );
  }
  return collection;
});

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
