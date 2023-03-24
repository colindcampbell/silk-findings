import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import * as R from "ramda";
import { highToLowRankedSeverities, knownColumnNames } from "../constants";
import { useCallback, useState } from "react";
import { debounce } from "debounce";
import { SeverityCell } from "./CellRenderers";
import { capitalize } from "../utils";

export const FilterBar = ({ severity, setSeverity, text, setText }) => {
  return (
    <Box
      sx={{ padding: 1, borderBottom: 1, borderColor: "divider" }}
      className="d-f jc-sb"
    >
      <TextSearch value={text} setValue={setText} />
      <SeveritySelect value={severity} setValue={setSeverity} />
    </Box>
  );
};

const TextSearch = ({ value, setValue }) => {
  const setValueDebounced = debounce(setValue, 400);
  const [localValue, setLocalValue] = useState(value);
  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setLocalValue(val);
    R.isEmpty(val) ? setValue(val) : setValueDebounced(e.target.value);
  }, []);
  return (
    <Input
      placeholder="Search..."
      type="search"
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      value={localValue}
      onChange={handleChange}
    />
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

const SeveritySelect = ({ value, setValue }) => {
  const handleChange = (event) => {
    const newValue = R.path(["target", "value"], event);
    setValue(
      // On autofill we get a stringified value.
      R.is(String, newValue) ? value.split(",") : newValue
    );
  };
  return (
    <FormControl sx={{ m: 0 }}>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={value}
        onChange={handleChange}
        input={<Input label="Severity" />}
        renderValue={(selected) => <SelectInputRenderer selected={selected} />}
        MenuProps={MenuProps}
        displayEmpty
      >
        {highToLowRankedSeverities.map((name) => (
          <MenuItem key={name} value={name} sx={{ padding: 0 }}>
            <Checkbox checked={value.indexOf(name) > -1} />
            <SeverityCell value={name} field={knownColumnNames.severity} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const SelectInputRenderer = ({ selected }) => {
  return (
    <div className="d-f g-4 ai-c">
      Severity:
      {R.pipe(
        R.filter(R.includes(R.__, selected)),
        R.map((severity) => (
          <SeverityCell
            key={severity}
            value={severity}
            field={knownColumnNames.severity}
          />
        ))
      )(highToLowRankedSeverities)}
    </div>
  );
};
