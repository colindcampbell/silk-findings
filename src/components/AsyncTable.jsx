import Paper from "@mui/material/Paper";
import { Table } from "./Table";
import { useAsyncTable } from "../hooks/useAsyncTable";
import { Loading } from "./Loading";

export const AsyncTable = ({
  filter,
  hasPagination,
  label,
  model,
  RowDetailRenderer,
  setFilter,
}) => {
  const {
    columns,
    createSortHandler,
    isLoading,
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
    filter,
  });

  return (
    <Loading isLoading={isLoading}>
      <Paper className="d-f f-1 fd-c w-100 h-100 ovf-h">
        <Table
          columns={columns}
          createSortHandler={createSortHandler}
          hasPagination={hasPagination}
          label={label}
          model={model}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          pageOffsetCount={pageOffsetCount}
          perPageCount={perPageCount}
          records={records}
          RowDetailRenderer={RowDetailRenderer}
          setFilter={setFilter}
          sort={sort}
          totalCount={totalCount}
        />
      </Paper>
    </Loading>
  );
};
