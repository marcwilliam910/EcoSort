import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  DoughnutController,
  Legend,
  Title,
  Tooltip,
} from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { memo, useEffect, useState } from "react";

Chart.register(
  ArcElement,
  DoughnutController,
  Legend,
  Title,
  Tooltip,
  ChartDataLabels
);

const chartType = {
  pie: Pie,
  bar: Bar,
};

interface DynamicChartProps {
  type: "pie" | "bar";
  values: {
    label: string;
    value: number;
  }[];
  title: string;
  month: string;
  showLabel: boolean;
}

interface YearlyData {
  month: string;
  values: YearlyDataValues;
}

interface YearlyDataValues {
  Paper: number;
  "Metal Can": number;
  "Plastic Bottle": number;
}

const DynamicChart = memo(function DynamicChart({
  type,
  values,
  title,
  month,
  showLabel,
}: DynamicChartProps) {
  const ChartComponent = chartType[type];
  const [totalWasteValue, setTotalWasteValue] = useState<string>("");

  useEffect(() => {
    let total = 0;
    values.forEach((value) => {
      total += value.value;
    });

    let displayTotal = total.toString();

    if (title === "Sales") {
      displayTotal = `₱${total}`;
    } else if (title === "Weight") {
      displayTotal = `${total}kg`;
    }

    setTotalWasteValue(displayTotal);
  }, [values]);

  console.log("Render for Dynamic Chart");

  return (
    <div className="flex flex-col items-center justify-center sm:min-w-full gap-3 cursor-pointer duration-300 py-14 shadow-2xl h-[22rem] px-5 md:w-80 xl:w-96 2xl:w-[29rem] rounded-xl bg-zinc-50">
      <div>
        <h2 className="font-bold text-gray-600">{month + " " + title}</h2>
      </div>
      <ChartComponent
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: showLabel,
            },
          },
        }}
        data={{
          labels: values.map((value) => value.label),
          datasets: [
            {
              label: "",
              data: values.map((value) => value.value),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderRadius: 5,
              datalabels: {
                color: "#353839",
                font: {
                  weight: "bold",
                },
                formatter(value) {
                  if (title === "Sales") value = "₱" + value;
                  else value = value + "kg";
                  return value;
                },
              },
            },
          ],
        }}
      />
      <div>
        <p className="text-sm text-gray-500">
          Total {title}: {totalWasteValue}
        </p>
      </div>
    </div>
  );
});

export default DynamicChart;

interface LineChartProps {
  year: string;
  recordData: YearlyData[];
  title: string;
}

export const LineChart = memo(function LineChart({
  year,
  recordData,
  title,
}: LineChartProps) {
  const [total, setTotal] = useState<string>("");

  console.log("Render for Line Chart");

  useEffect(() => {
    let totalValue = 0;
    recordData.forEach((record) => {
      totalValue +=
        record.values.Paper +
        record.values?.["Metal Can"] +
        record.values?.["Plastic Bottle"];
    });

    let displayTotal = totalValue.toString();
    if (title === "Sales") {
      displayTotal = `₱${totalValue}`;
    } else if (title === "Weight") {
      displayTotal = `${totalValue}kg`;
    }

    setTotal(displayTotal);
  }, [recordData]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 rounded-xl shadow-2xl sm:px-10 sm:py-16 sm:gap-5  md:h-[23rem] lg:h-[25rem] lg:py-16 h-[20rem] sm:h-[22rem] bg-zinc-50 cursor-pointer duration-300 sm:col-span-2">
      <div>
        <h2 className="font-bold text-gray-600">
          {year} Total {title}
        </h2>
      </div>
      <Line
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            datalabels: {
              display: false,
            },
          },
        }}
        data={{
          labels: recordData.map((record) => record.month),
          datasets: [
            {
              label: "Metal Can",
              data: recordData.map((record) => record.values?.["Metal Can"]),
              borderColor: "#FF6384",
              backgroundColor: "#FF6384",
              borderWidth: 4,
              tension: 0.1,
            },
            {
              label: "Plastic Bottle",
              data: recordData.map(
                (record) => record.values?.["Plastic Bottle"]
              ),
              borderColor: "#36A2EB",
              backgroundColor: "#36A2EB",
              borderWidth: 4,
              tension: 0.1,
            },
            {
              label: "Paper",
              data: recordData.map((record) => record.values.Paper),
              borderColor: "#FFCE56",
              backgroundColor: "#FFCE56",
              borderWidth: 4,
              tension: 0.1,
            },
          ],
        }}
      />
      <div>
        <p className="text-sm text-gray-500">
          Yearly {title} : {total}
        </p>
      </div>
    </div>
  );
});
