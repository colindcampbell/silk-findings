import { modelConstants } from "../constants";
import * as R from "ramda";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export const useAsyncTable = ({
  model,
  hasPagination = true,
  fixedFilter = {},
}) => {
  const [records, setRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState();
  const { sort, createSortHandler } = useSort({ model });

  const { perPageCount, pageOffsetCount, onPageChange, onRowsPerPageChange } =
    usePagination(hasPagination);

  useEffect(() => {
    axios
      .get(`/${model}/filter`, {
        params: { sort, perPageCount, pageOffsetCount },
      })
      .then((response) => {
        setRecords(response.data.data);
        setTotalCount(response.data.meta.totalCount);
      });
  }, [sort.field, sort.direction, perPageCount, pageOffsetCount]);

  const exports = useMemo(
    () => ({
      records,
      createSortHandler,
      columns: R.path([model, "columns"], modelConstants),
      sort,
      ...(hasPagination && {
        perPageCount,
        pageOffsetCount,
        onPageChange,
        onRowsPerPageChange,
        totalCount,
      }),
    }),
    [
      records,
      createSortHandler,
      onPageChange,
      onRowsPerPageChange,
      totalCount,
      sort,
    ]
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
