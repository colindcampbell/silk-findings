import "../styles/App.css";
import { modelTypes } from "../constants";
import { GroupedFindingsRowDetails } from "./GroupedFindingsRowDetails";
import { AsyncTable } from "./AsyncTable";

function App() {
  return (
    <div className="App">
      <AsyncTable
        label="Grouped Findings"
        model={modelTypes.groupedFindings}
        RowDetailRenderer={GroupedFindingsRowDetails}
        hasPagination
      />
    </div>
  );
}

export default App;
