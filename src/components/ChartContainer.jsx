import { useEffect, useState } from "react";
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
import { chartColorsByField, modelTypes } from "../constants";
import * as R from "ramda";
import axios from "axios";
import { capitalize, mapIndexed } from "../utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const pieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: false,
    },
  },
  onClick: (e, chart) => {
    console.log("🚀 ~ file: ChartContainer.jsx:44 ~ chart:", chart[0].index); // use index to get the value that was clicked
  },
};

const barOptions = R.pipe(R.assocPath(["plugins", "legend", "display"], false))(
  pieOptions
);

export const ChartContainer = ({ field, sort }) => {
  const [pieData, setPieData] = useState();
  const [barData, setBarData] = useState();
  const [isLoading, setIsLoading] = useState(true);
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

const calcLabels = (fieldValues, rawData) =>
  R.map(
    (fieldValue) =>
      `${capitalize(fieldValue)} (${R.prop(fieldValue, rawData)})`,
    fieldValues
  );

const calcGroupedDataForPieChart = (field, rawData) => {
  const fieldValues = R.keys(rawData);
  const labels = calcLabels(fieldValues, rawData);
  const datasets = [
    {
      label: capitalize(field),
      data: R.values(rawData),
      backgroundColor: R.map(
        (fieldValue) => R.path([field, fieldValue], chartColorsByField),
        fieldValues
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
