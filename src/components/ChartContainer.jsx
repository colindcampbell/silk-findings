import { useEffect, useState, useMemo } from "react";
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
import {
  chartColorsByField,
  modelTypes,
  highToLowRankedSeverities,
  rankedSeverities,
} from "../constants";
import * as R from "ramda";
import axios from "axios";
import { capitalize, mapIndexed, toggleItemInList } from "../utils";
import { useGroupedFindingsFilter } from "./GroupedFindingsTable";

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

const basePieOptions = {
  responsive: true,
  animation: false,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: false,
    },
    datalabels: {
      color: "#444",
    },
  },
};

export const ChartContainer = ({ field, sort }) => {
  const [pieData, setPieData] = useState();
  const [barData, setBarData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const [severity, setSeverity] = useGroupedFindingsFilter(
    R.props(["severity", "setSeverity"])
  );

  useEffect(() => {
    axios
      .get(`/${modelTypes.groupedFindings}/grouped`, {
        params: {
          field,
          sort,
        },
      })
      .then((response) => {
        setIsLoading(false);
        setPieData(calcGroupedDataForPieChart(field, response.data.data));
        setBarData(calcGroupedDataForBarChart(field, response.data.data));
      });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      updateChartColors(severity, setPieData, setBarData);
    }
  }, [severity, isLoading]);

  const [pieOptions, barOptions] = useMemo(
    () => decorateOptionsWithClickHandler(setSeverity, setPieData, setBarData),
    [setSeverity, setPieData, setBarData]
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

const calcBarOptions = R.pipe(
  R.assocPath(["plugins", "legend", "display"], false)
);

const decorateOptionsWithClickHandler = (setSeverity) => {
  const onClick = (e, chart) => {
    setSeverity((currentSeverities) => {
      const clickedSeverity = R.prop(chart[0].index, rankedSeverities);
      const updatedSeverities = toggleItemInList(
        clickedSeverity,
        currentSeverities
      );
      return R.assoc("severity", updatedSeverities);
    });
  };
  const pieOptions = R.assoc("onClick", onClick, basePieOptions);
  const barOptions = calcBarOptions(pieOptions);
  return [pieOptions, barOptions];
};

const updatePieDataBackgroundColors = (updatedBackgroundColors) =>
  R.assocPath(["datasets", 0, "backgroundColor"], updatedBackgroundColors);

const updateBarDataBackgroundColors = (updatedBackgroundColors) =>
  R.over(
    R.lensProp("datasets"),
    mapIndexed((dataset, i) =>
      R.assoc("backgroundColor", R.prop(i, updatedBackgroundColors), dataset)
    )
  );

const calcFieldPercentage = (fieldValue, rawData) => {
  const count = R.prop(fieldValue, rawData);
  const totalCount = R.pipe(R.values, R.sum)(rawData);
  return `${Math.round((count / totalCount) * 100)}%`;
};

const calcLabels = (fieldValues, rawData) =>
  R.map(
    (fieldValue) =>
      `${capitalize(fieldValue)} (${calcFieldPercentage(fieldValue, rawData)})`,
    fieldValues
  );

const calcBackgroundColors = (baseColors) => (field, values) =>
  R.map(
    (value) =>
      R.includes(value, values)
        ? R.path([field, value], chartColorsByField)
        : "#BBBBBB",
    baseColors
  );

const calcSeverityBackgroundColors = calcBackgroundColors(rankedSeverities);

const updateChartColors = (severities, setPieData, setBarData) => {
  const updatedBackgroundColors = calcSeverityBackgroundColors(
    "severity",
    severities
  );
  setPieData(updatePieDataBackgroundColors(updatedBackgroundColors));
  setBarData(updateBarDataBackgroundColors(updatedBackgroundColors));
};

const calcGroupedDataForPieChart = (field, rawData) => {
  const fieldValues = R.keys(rawData);
  const labels = calcLabels(fieldValues, rawData);
  const datasets = [
    {
      label: capitalize(field),
      data: R.values(rawData),
      backgroundColor: calcSeverityBackgroundColors(
        field,
        highToLowRankedSeverities
      ),
    },
  ];
  return {
    labels,
    datasets,
  };
};

const calcGroupedDataForBarChart = (field, rawData) => {
  const fieldValues = R.keys(rawData);
  const labels = calcLabels(fieldValues, rawData);
  const datasets = mapIndexed(
    (fieldValue, i) => ({
      data: R.assoc(i, R.prop(fieldValue, rawData), []),
      backgroundColor: R.path([field, fieldValue], chartColorsByField),
    }),
    fieldValues
  );
  return {
    labels,
    datasets,
  };
};
