import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AsyncTable } from "./AsyncTable";
import { modelTypes } from "../constants";

export function GroupedFindingsRowDetails(props) {
  const { id } = props;
  const [value, setValue] = useState("1");

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ width: "100%", typography: "body1", height: 300 }}
      className="d-f fd-c ovf-a"
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Findings" value="1" />
            <Tab label="Graphs" value="2" />
            <Tab label="Details" value="3" />
          </TabList>
        </Box>
        <TabPanel sx={{ padding: 1.5 }} value="1" className="f-1 d-f ovf-a">
          <AsyncTable
            label="Findings"
            model={modelTypes.findings}
            fixedFilter={{ grouped_finding_id: id }}
            hasPagination={false}
          />
        </TabPanel>
        <TabPanel sx={{ padding: 1.5 }} value="3">
          <Grid container component="dl" spacing={2}>
            <Grid item>
              <Typography component="dt" variant="h6">
                Some Heading or Definition Term
              </Typography>
              <Typography component="dd" variant="body2">
                Some Definition data
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
