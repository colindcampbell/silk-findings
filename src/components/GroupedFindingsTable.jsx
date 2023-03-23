import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { modelTypes, rankedSeverities } from "../constants";
import { AsyncTable } from "./AsyncTable";
import { GroupedFindingsRowDetails } from "./GroupedFindingsRowDetails";

import { useState, useMemo } from "react";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import * as R from "ramda";

const initialFilter = {
  severity: rankedSeverities,
  quick: "",
};

export const GroupedFindingsTable = () => {
  const [filter, setFilter] = useState(initialFilter);
  const apiFilterValue = useMemo(
    () => R.over(R.lensProp("severity"), R.join(","))(filter),
    [filter]
  );

  return (
    <>
      <Box
        sx={{ padding: 1, borderBottom: 1, borderColor: "divider" }}
        className="d-f jc-sb"
      >
        <TextField variant="standard" placeholder="Search..." />
        <SeveritySelect
          value={R.prop("severity", filter)}
          setValue={(val) => {
            setFilter(R.assoc("severity", val));
          }}
        />
      </Box>
      <AsyncTable
        label="Grouped Findings"
        model={modelTypes.groupedFindings}
        RowDetailRenderer={GroupedFindingsRowDetails}
        hasPagination
        filter={apiFilterValue}
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
    const {
      target: { value },
    } = event;
    setValue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
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
