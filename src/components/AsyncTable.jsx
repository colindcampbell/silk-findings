import Paper from "@mui/material/Paper";
import { Table } from "./Table";
import { useAsyncTable } from "../hooks/useAsyncTable";
import { Loading } from "./Loading";

export const AsyncTable = ({
  label,
  model,
  hasPagination,
  RowDetailRenderer,
  filter,
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
    isLoading,
  } = useAsyncTable({
    model,
    hasPagination,
    filter,
  });

  return (
    <Loading isLoading={isLoading}>
      <Paper className="d-f f-1 fd-c w-100 h-100 ovf-h">
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
    </Loading>
  );
};
