import * as R from "ramda";
import { rankedSeverities } from "../constants";
import { existsAndIsNotEmpty, isNotNil } from "../utils";

export const decorateList = (model, list) =>
  R.map(
    R.pipe(
      R.assoc("model", model),
      R.converge(R.assoc("severityWeight"), [
        R.pipe(R.prop("severity"), R.indexOf(R.__, rankedSeverities)),
        R.identity,
      ])
    )
  )(list);

export const applySortToList = (params, collection) => {
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
};

export const applyFilterToList = (params, collection) => {
  const filteredCollection = R.pipe(
    filterByGroupFindingId(params),
    filterBySeverity(params),
    filterByText(params)
  )(collection);
  return filteredCollection;
};

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

export const calcPaginatedList = async (params, collection) => {
  const perPageCount = params.get("perPageCount") || 100;
  const pageOffsetCount = params.get("pageOffsetCount") || 0;
  const offsetCount = perPageCount * pageOffsetCount;
  const paginatedList = await collection
    .offset(offsetCount)
    .limit(perPageCount)
    .toArray();
  return paginatedList;
};
