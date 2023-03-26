import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AsyncTable } from "./AsyncTable";
import { modelTypes } from "../constants";
import * as R from "ramda";
import { DefinitionList } from "./DefinitionList";
import { calcLabelFromName } from "../utils";

export const GroupedFindingsRowDetails = ({ id, columns, ...row }) => {
  const [value, setValue] = useState("1");

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ width: "100%", typography: "body1", padding: 0 }}
      className="d-f fd-c ovf-a"
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Findings" value="1" />
            <Tab label="Details" value="2" />
          </TabList>
        </Box>
        <TabPanel
          sx={{ padding: 0, ...(value !== "1" && { display: "none" }) }}
          value="1"
          className="f-1 d-f ovf-a"
        >
          <AsyncTable
            label="Findings"
            model={modelTypes.findings}
            filter={{ grouped_finding_id: id }}
            hasPagination={false}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 0, margin: 0 }} value="2">
          <DefinitionList
            items={R.map(
              ({ name, label }) => ({
                label: label || calcLabelFromName(name),
                value: R.pipe(
                  R.prop(name),
                  R.when(R.is(String), calcLabelFromName)
                )(row),
              }),
              columns
            )}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
