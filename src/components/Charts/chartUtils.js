import {
  chartColorsByField,
  highToLowRankedSeverities,
  knownColumnNames,
  rankedSeverities,
} from "../../constants";
import { capitalize, mapIndexed, toggleItemInList } from "../../utils";
import * as R from "ramda";

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

export const loadChartData = R.curry((field, severity, response) => {
  const { barData, pieData } = decorateChartColors(
    severity,
    calcGroupedDataForPieChart(field, response.data),
    calcGroupedDataForBarChart(field, response.data)
  );
  return { pieData, barData };
});

const calcBarOptions = R.pipe(
  R.assocPath(["plugins", "legend", "display"], false)
);

export const decorateOptionsWithClickHandler = (setSeverity) => {
  const onClick = (e, chart) => {
    setSeverity((currentSeverities) => {
      const clickedSeverity = R.prop(chart[0].index, rankedSeverities);
      const updatedSeverities = toggleItemInList(
        clickedSeverity,
        currentSeverities
      );
      return R.assoc(knownColumnNames.severity, updatedSeverities);
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
    R.pipe(
      R.defaultTo([]),
      mapIndexed((dataset, i) =>
        R.assoc("backgroundColor", R.prop(i, updatedBackgroundColors), dataset)
      )
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

const decorateChartColors = (severities, pieData, barData) => {
  const updatedBackgroundColors = calcSeverityBackgroundColors(
    knownColumnNames.severity,
    severities
  );
  const pieDataWithColors = updatePieDataBackgroundColors(
    updatedBackgroundColors
  )(pieData);
  const barDataWithColors = updateBarDataBackgroundColors(
    updatedBackgroundColors
  )(barData);
  return {
    pieData: pieDataWithColors,
    barData: barDataWithColors,
  };
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
      stack: 1,
      barThickness: 60,
    }),
    fieldValues
  );
  return {
    labels,
    datasets,
  };
};
