import "../styles/App.css";
import { modelTypes } from "../constants";
import Paper from "@mui/material/Paper";
import { Table } from "./Table";
import { useAsyncTable } from "../hooks/useAsyncTable";

function App() {
  return (
    <div className="App">
      <AsyncTable
        label="Grouped Findings"
        model={modelTypes.groupedFindings}
        hasPagination
      />
    </div>
  );
}

export default App;

const AsyncTable = ({ label, model, hasPagination }) => {
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
      />
    </Paper>
  );
};
