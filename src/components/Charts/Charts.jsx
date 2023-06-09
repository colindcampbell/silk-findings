import { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { apiActions, knownColumnNames, sortDirections } from "../../constants";
import * as R from "ramda";
import { useQuery } from "@tanstack/react-query";
import { modelGetOperation } from "../../service";
import { decorateOptionsWithClickHandler, loadChartData } from "./chartUtils";
import { Loading } from "../Loading";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { modelStateHooks } from "../../hooks/useModelState";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels
);

const chartSort = {
  field: knownColumnNames.severityWeight,
  direction: sortDirections.asc,
};

export const ChartsContainer = ({ width, model }) => {
  return (
    <Accordion
      TransitionProps={{
        timeout: "auto",
      }}
      sx={{ marginBottom: 1 }}
      className="ovf-h"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="severity-graphs-content"
        id="severity-graphs-header"
      >
        <Typography>Severity Graphs</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ height: 360, width: width - 32 }}
        className="d-f ovf-a jc-c"
      >
        <Charts
          field={knownColumnNames.severity}
          sort={chartSort}
          model={model}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export const Charts = ({ field, sort, model }) => {
  const useModelState = R.prop(model, modelStateHooks);
  const [severity, setSeverity] = useModelState(
    R.props([knownColumnNames.severity, "setSeverity"])
  );

  const { isLoading, data: { barData = {}, pieData = {} } = {} } = useQuery({
    queryKey: [
      model,
      apiActions.group,
      {
        field,
        sort,
      },
    ],
    queryFn: modelGetOperation,
    keepPreviousData: true,
    select: loadChartData(field, severity),
  });

  const [pieOptions, barOptions] = useMemo(
    () => decorateOptionsWithClickHandler(setSeverity),
    []
  );

  return (
    <Loading isLoading={isLoading}>
      <Doughnut options={pieOptions} data={pieData} />
      <Bar options={barOptions} data={barData} />
    </Loading>
  );
};
