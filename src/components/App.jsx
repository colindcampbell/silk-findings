import "../styles/App.css";
import { knownColumnNames, modelTypes } from "../constants";
import { AsyncTable } from "./AsyncTable";
import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import MuiTabPanel from "@mui/lab/TabPanel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import { Charts } from "./Charts";
import useResizeObserver from "use-resize-observer";
import { GroupedFindingsTable } from "./GroupedFindingsTable";
import { notEquals } from "../utils";

function App() {
  const [value, setValue] = useState("1");

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const { ref, width } = useResizeObserver();
  return (
    <div className="App" ref={ref}>
      <Box
        sx={{ width: "100%", typography: "body1" }}
        className="d-f fd-c ovf-h h-100"
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="Findings Categories">
              <Tab label="Grouped Findings" value="1" />
              <Tab label="Raw Findings" value="2" />
            </TabList>
          </Box>
          <TabPanel currentTab={value} value="1" width={width}>
            <Accordion
              TransitionProps={{
                timeout: "auto",
              }}
              sx={{ marginBottom: 1 }}
              className="ovf-h"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Severity Graphs</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ height: 360, width: width - 32 }}
                className="d-f ovf-a jc-c"
              >
                <Charts
                  field={knownColumnNames.severity}
                  sort={{ field: "severityWeight", direction: "asc" }}
                  model={modelTypes.groupedFindings}
                />
              </AccordionDetails>
            </Accordion>
            <Paper className="f-1 d-f fd-c ovf-h w-100" elevation={1}>
              <GroupedFindingsTable />
            </Paper>
          </TabPanel>
          <TabPanel currentTab={value} value="2" width={width}>
            <AsyncTable
              label="Findings"
              model={modelTypes.findings}
              hasPagination
            />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default App;

const TabPanel = ({ width, value, currentTab, children }) => {
  return (
    <MuiTabPanel
      sx={{
        padding: 1,
        width: width - 16,
        ...(notEquals(value, currentTab) && { display: "none" }),
      }}
      value={value}
      className="f-1 d-f fd-c ovf-h h-100 w-100"
    >
      {children}
    </MuiTabPanel>
  );
};
