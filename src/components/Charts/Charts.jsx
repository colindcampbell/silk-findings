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
import { modelTypes } from "../../constants";
import * as R from "ramda";
import { useGroupedFindingsFilter } from "../GroupedFindingsTable";
import { useQuery } from "@tanstack/react-query";
import { modelGetOperation } from "../../service";
import { decorateOptionsWithClickHandler, loadChartData } from "./chartUtils";

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

export const Charts = ({ field, sort }) => {
  const [severity, setSeverity] = useGroupedFindingsFilter(
    R.props(["severity", "setSeverity"])
  );

  const { isLoading, data: { barData = {}, pieData = {} } = {} } = useQuery({
    queryKey: [
      modelTypes.groupedFindings,
      "grouped",
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
    [setSeverity]
  );

  if (isLoading) {
    return "loading...";
  }
  return (
    <>
      <Doughnut options={pieOptions} data={pieData} />
      <Bar options={barOptions} data={barData} />
    </>
  );
};
