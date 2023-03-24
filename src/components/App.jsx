import "../styles/App.css";
import { modelTypes } from "../constants";
import { AsyncTable } from "./AsyncTable";
import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import MuiTabPanel from "@mui/lab/TabPanel";
import Paper from "@mui/material/Paper";
import useResizeObserver from "use-resize-observer";
import { GroupedFindingsTable } from "./GroupedFindingsTable";
import { notEquals } from "../utils";
import { ChartsContainer } from "./Charts";

const App = () => {
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
            <ChartsContainer width={width} />
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
};

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
