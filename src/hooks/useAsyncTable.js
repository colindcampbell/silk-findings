import { modelConstants } from "../constants";
import * as R from "ramda";
import { useState, useMemo } from "react";
import { isNotNil } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { modelGetOperation } from "../service";

export const useAsyncTable = ({ model, hasPagination = true, filter }) => {
  const { sort, createSortHandler } = useSort({ model });

  const { perPageCount, pageOffsetCount, onPageChange, onRowsPerPageChange } =
    usePagination(hasPagination);

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
      isLoading: R.prop("isLoading", queryBundle),
      records: R.pathOr([], ["data", "data"], queryBundle),
      createSortHandler,
      columns: R.path([model, "columns"], modelConstants),
      sort,
      ...(hasPagination && {
        perPageCount,
        pageOffsetCount,
        onPageChange,
        onRowsPerPageChange,
        totalCount: R.pathOr(0, ["data", "meta", "totalCount"], queryBundle),
      }),
    }),
    [queryBundle, createSortHandler, onPageChange, onRowsPerPageChange, sort]
  );

  return exports;
};

const useSort = ({ model }) => {
  const [sort, setSort] = useState(
    R.path([model, "defaultSort"], modelConstants)
  );
  const createSortHandler = (name, sortField, defaultSort) => () => {
    setSort(calcNewSort(name, sortField, defaultSort));
  };
  return { sort, createSortHandler };
};

const usePagination = (hasPagination) => {
  const [perPageCount, setPerPageCount] = useState(100);
  const [pageOffsetCount, setPageOffsetCount] = useState(0);

  if (!hasPagination) {
    return {};
  }

  const handlePageChange = (e, newPageOffsetCount) => {
    setPageOffsetCount(newPageOffsetCount);
  };

  const handleRowsPerPageChange = (e) => {
    setPerPageCount(parseInt(e.target.value, 10));
    setPageOffsetCount(0);
  };
  return {
    perPageCount,
    pageOffsetCount,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
  };
};

const calcNewSort =
  (name, sortField, defaultSort = "desc") =>
  (sort = {}) => {
    const oppositeOfDefault = R.equals(defaultSort, "desc") ? "asc" : "desc";
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
