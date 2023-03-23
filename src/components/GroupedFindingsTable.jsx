import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { modelTypes, rankedSeverities } from "../constants";
import { AsyncTable } from "./AsyncTable";
import { GroupedFindingsRowDetails } from "./GroupedFindingsRowDetails";
import { create } from "zustand";

import { useState, useMemo } from "react";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import * as R from "ramda";

const initialState = {
  severity: rankedSeverities,
  quick: "",
};

export const useGroupedFindingsFilter = create((set, get) => ({
  ...initialState,
  setFilter: (key, value) => {
    set(R.assoc(key, value));
  },
  setSeverity: (callback) => set(callback(get().severity)),
}));

const apiFilterSelector = R.pipe(
  R.pick(["severity", "quick"]),
  R.over(R.lensProp("severity"), R.join(","))
);

export const GroupedFindingsTable = () => {
  const [severity, setFilter] = useGroupedFindingsFilter(
    R.props(["severity", "setFilter"])
  );
  const apiFilter = useGroupedFindingsFilter(apiFilterSelector);

  return (
    <>
      <Box
        sx={{ padding: 1, borderBottom: 1, borderColor: "divider" }}
        className="d-f jc-sb"
      >
        <TextField variant="standard" placeholder="Search..." />
        <SeveritySelect
          value={severity}
          setValue={(val) => {
            setFilter("severity", val);
          }}
        />
      </Box>
      <AsyncTable
        label="Grouped Findings"
        model={modelTypes.groupedFindings}
        RowDetailRenderer={GroupedFindingsRowDetails}
        hasPagination
        filter={apiFilter}
      />
    </>
  );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const allSeverities = rankedSeverities;

const SeveritySelect = ({ value, setValue }) => {
  const handleChange = (event) => {
    const newValue = R.path(["target", "value"], event);
    setValue(
      // On autofill we get a stringified value.
      R.is(String, newValue) ? value.split(",") : newValue
    );
  };
  return (
    <FormControl sx={{ m: 0, width: 300 }}>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={value}
        onChange={handleChange}
        input={<Input label="Severity" />}
        renderValue={(selected) => `severity: ${selected.join(", ")}`}
        MenuProps={MenuProps}
        displayEmpty
      >
        {allSeverities.map((name) => (
          <MenuItem key={name} value={name} sx={{ padding: 0 }}>
            <Checkbox checked={value.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
