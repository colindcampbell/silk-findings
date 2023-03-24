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
import { useCallback, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import useResizeObserver from "use-resize-observer";
import { getCellRenderer } from "./CellRenderers";
import "../styles/Table.css";

export const Table = ({
  columns,
  createSortHandler,
  hasPagination,
  label,
  model,
  onPageChange,
  onRowsPerPageChange,
  pageOffsetCount,
  perPageCount,
  records,
  RowDetailRenderer,
  sort,
  totalCount,
}) => {
  const { ref, width: tableContainerWidth } = useResizeObserver();
  return (
    <>
      <TableContainer className="f-1 ofv-a" ref={ref}>
        <MuiTable
          size="small"
          stickyHeader
          aria-label={label}
          id={`${model}-content`}
        >
          <TableHead>
            <TableRow>
              {isNotNil(RowDetailRenderer) && <TableCell />}
              {R.map(
                ({ name, ...columnConfig }) => (
                  <TableHeaderCell
                    key={`${name}-header`}
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
                  key={`${row.id}-${row.model}`}
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
          sx={{ borderTop: 1, borderColor: "divider" }}
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
  const toggleIsOpen = useCallback(() => {
    setIsOpen((val) => !val);
  }, [setIsOpen]);
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
              onClick={toggleIsOpen}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {R.map(({ name, type, props = {} }) => {
          const Renderer = getCellRenderer(type);
          const value = R.prop(name, row);
          return (
            <TableCell component="th" scope="row" key={`${row.id}-${name}`}>
              <Renderer
                value={value}
                field={name}
                {...row}
                {...props}
                toggleIsOpen={toggleIsOpen}
              />
            </TableCell>
          );
        }, columns)}
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell
            style={{ padding: 1 }}
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
  createSortHandler,
  defaultSort = "desc",
  isSortEnabled,
  label: passedLabel,
  name,
  sort = {},
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
