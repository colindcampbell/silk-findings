import Paper from "@mui/material/Paper";
import { Table } from "./Table";
import { useAsyncTable } from "../hooks/useAsyncTable";

export const AsyncTable = ({
  label,
  model,
  hasPagination,
  RowDetailRenderer,
  fixedFilter,
}) => {
  const {
    columns,
    createSortHandler,
    onPageChange,
    onRowsPerPageChange,
    pageOffsetCount,
    perPageCount,
    records,
    sort,
    totalCount,
  } = useAsyncTable({
    model,
    hasPagination,
    fixedFilter,
  });
  return (
    <Paper className="d-f fd-c w-100 h-100 ovf-h">
      <Table
        columns={columns}
        createSortHandler={createSortHandler}
        label={label}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        pageOffsetCount={pageOffsetCount}
        perPageCount={perPageCount}
        records={records}
        sort={sort}
        totalCount={totalCount}
        RowDetailRenderer={RowDetailRenderer}
        hasPagination={hasPagination}
      />
    </Paper>
  );
};
