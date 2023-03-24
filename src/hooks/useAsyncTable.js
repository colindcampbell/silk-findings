import { modelConstants, sortDirections } from "../constants";
import * as R from "ramda";
import { useState, useMemo } from "react";
import { isNotNil } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { modelGetOperation } from "../service";

export const useAsyncTable = ({ model, hasPagination = true, filter }) => {
  const { perPageCount, pageOffsetCount, onPageChange, onRowsPerPageChange } =
    usePagination(hasPagination, model);

  const { sort, createSortHandler } = useSort({ model, onPageChange });

  const queryBundle = useQuery({
    queryKey: [
      model,
      "filter",
      {
        sort,
        perPageCount,
        pageOffsetCount,
        ...(isNotNil(filter) && { filter }),
      },
    ],
    queryFn: modelGetOperation,
    keepPreviousData: true,
  });

  const exports = useMemo(
    () => ({
      columns: R.path([model, "columns"], modelConstants),
      createSortHandler,
      isLoading: R.prop("isLoading", queryBundle),
      records: R.pathOr([], ["data", "data"], queryBundle),
      sort,
      ...(hasPagination && {
        onPageChange,
        onRowsPerPageChange,
        pageOffsetCount,
        perPageCount,
        totalCount: R.pathOr(0, ["data", "meta", "totalCount"], queryBundle),
      }),
    }),
    [queryBundle, createSortHandler, onPageChange, onRowsPerPageChange, sort]
  );

  return exports;
};

const useSort = ({ model, onPageChange }) => {
  const [sort, setSort] = useState(
    R.path([model, "defaultSort"], modelConstants)
  );
  const createSortHandler = (name, sortField, defaultSort) => (e) => {
    setSort(calcNewSort(name, sortField, defaultSort));
    onPageChange(e, 0); // reset pagination when sort changes
  };
  return { sort, createSortHandler };
};

const usePagination = (hasPagination, model) => {
  const [perPageCount, setPerPageCount] = useState(100);
  const [pageOffsetCount, setPageOffsetCount] = useState(0);

  if (!hasPagination) {
    return {};
  }

  const handlePageChange = (e, newPageOffsetCount) => {
    setPageOffsetCount(newPageOffsetCount);
    // Scroll the table back to the top when the page changes
    const scrollTargetEl = document.getElementById(`${model}-content`);
    if (scrollTargetEl) {
      scrollTargetEl.scrollIntoView(true);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setPerPageCount(parseInt(e.target.value, 10));
    handlePageChange(e, 0);
  };

  return {
    perPageCount,
    pageOffsetCount,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
  };
};

const calcNewSort =
  (name, sortField, defaultSort = sortDirections.desc) =>
  (sort = {}) => {
    const oppositeOfDefault = R.equals(defaultSort, sortDirections.desc)
      ? sortDirections.asc
      : sortDirections.desc;
    const direction =
      R.equals(sort?.field, name) && R.equals(sort?.direction, defaultSort)
        ? oppositeOfDefault
        : defaultSort;
    return {
      direction,
      field: name,
      sortField,
    };
  };
