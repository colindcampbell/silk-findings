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
import { calcLabelFromName, isNotNil } from "../utils";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import useResizeObserver from "use-resize-observer";

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
  RowDetailRenderer,
  hasPagination,
}) => {
  const { ref, width: tableContainerWidth } = useResizeObserver();
  return (
    <>
      <TableContainer className="f-1 ofv-a" ref={ref}>
        <MuiTable size="small" stickyHeader aria-label={label}>
          <TableHead>
            <TableRow>
              {isNotNil(RowDetailRenderer) && <TableCell />}
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
                <TableBodyRow
                  key={row.id}
                  columns={columns}
                  RowDetailRenderer={RowDetailRenderer}
                  tableContainerWidth={tableContainerWidth}
                  {...row}
                />
              ),
              records
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {hasPagination && (
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={perPageCount}
          page={pageOffsetCount}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </>
  );
};

const TableBodyRow = ({
  columns,
  RowDetailRenderer,
  tableContainerWidth,
  ...row
}) => {
  const hasRowDetails = isNotNil(RowDetailRenderer);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <TableRow
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          ...(hasRowDetails && { "& > *": { borderBottom: "unset" } }),
        }}
      >
        {hasRowDetails && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setIsOpen((val) => !val)}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {R.map(
          ({ name }) => (
            <TableCell component="th" scope="row" key={`${row.id}-${name}`}>
              {R.prop(name, row)}
            </TableCell>
          ),
          columns
        )}
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell
            style={{ padding: 0 }}
            colSpan={R.pipe(R.length, R.add(1))(columns)}
          >
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  padding: 0.5,
                  paddingBottom: 0,
                  width: tableContainerWidth - 8, // subtract margin
                  position: "sticky",
                  left: 0,
                }}
              >
                <RowDetailRenderer columns={columns} {...row} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

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
