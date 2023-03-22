import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";
import * as R from "ramda";
import { calcLabelFromName } from "../utils";

export const Table = ({
  columns,
  createSortHandler,
  label,
  onPageChange,
  onRowsPerPageChange,
  pageOffsetCount,
  perPageCount,
  records,
  sort,
  totalCount,
}) => (
  <>
    <TableContainer className="f-1 ofv-a">
      <MuiTable size="small" stickyHeader aria-label={label}>
        <TableHead>
          <TableRow>
            {R.map(
              ({ name, ...columnConfig }) => (
                <TableHeaderCell
                  key={name}
                  name={name}
                  sort={sort}
                  createSortHandler={createSortHandler}
                  {...columnConfig}
                />
              ),
              columns
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {R.map(
            (row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {R.map(
                  ({ name }) => (
                    <TableCell
                      component="th"
                      scope="row"
                      key={`${row.id}-${name}`}
                    >
                      {R.prop(name, row)}
                    </TableCell>
                  ),
                  columns
                )}
              </TableRow>
            ),
            records
          )}
        </TableBody>
      </MuiTable>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[25, 50, 100]}
      component="div"
      count={totalCount}
      rowsPerPage={perPageCount}
      page={pageOffsetCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  </>
);

const TableHeaderCell = ({
  name,
  label: passedLabel,
  sort = {},
  createSortHandler,
  isSortEnabled,
  defaultSort = "desc",
  sortField,
}) => {
  const label = passedLabel || calcLabelFromName(name);
  return (
    <TableCell>
      {isSortEnabled ? (
        <TableSortLabel
          active={R.equals(sort?.field, name)}
          direction={R.equals(sort.field, name) ? sort.direction : defaultSort}
          onClick={createSortHandler(name, sortField, defaultSort)}
        >
          {label}
          {R.equals(sort?.field, name) ? (
            <Box component="span" sx={visuallyHidden}>
              {sort.direction === "desc"
                ? "sorted descending"
                : "sorted ascending"}
            </Box>
          ) : null}
        </TableSortLabel>
      ) : (
        label
      )}
    </TableCell>
  );
};
