import "../styles/App.css";
import { modelTypes } from "../constants";
import { AsyncTable } from "./AsyncTable";
import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import { Charts } from "./Charts";
import useResizeObserver from "use-resize-observer";
import { GroupedFindingsTable } from "./GroupedFindingsTable";

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
        className="d-f fd-c ovf-h h-100 w-100"
      >
        <TabContext value={value}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider" }}
            className="w-100"
          >
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Grouped Findings" value="1" />
              <Tab label="Raw Findings" value="2" />
            </TabList>
          </Box>
          <TabPanel
            sx={{
              padding: 1,
              width: width - 16,
              ...(value !== "1" && { display: "none" }),
            }}
            value="1"
            className="f-1 d-f fd-c ovf-h h-100 w-100"
          >
            <Accordion sx={{ marginBottom: 1 }} className="ovf-h">
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
                  field="severity"
                  sort={{ field: "severityWeight", direction: "asc" }}
                />
              </AccordionDetails>
            </Accordion>
            <Paper className="f-1 d-f fd-c ovf-h w-100" elevation={1}>
              <GroupedFindingsTable />
            </Paper>
          </TabPanel>
          <TabPanel
            sx={{ padding: 1, ...(value !== "2" && { display: "none" }) }}
            value="2"
            className="f-1 d-f ovf-a h-100"
          >
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
