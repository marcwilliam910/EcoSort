import {Pie, Bar, Line} from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  DoughnutController,
  Legend,
  Title,
  Tooltip,
} from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {memo, useContext, useEffect, useState} from "react";
import {ThemeContext} from "@/contexts/ThemeContextProvider";

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
  const [totalWasteValue, setTotalWasteValue] = useState("");

  const {isDarkMode} = useContext(ThemeContext);

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
    <div className="flex flex-col items-center justify-center sm:min-w-full gap-3 cursor-pointer py-14 shadow-2xl h-[22rem] px-5 md:w-80 xl:w-96 2xl:w-[29rem] rounded-xl bg-light-card dark:bg-dark-card transition-colors duration-150">
      <div>
        <h2 className="font-bold text-gray-600 dark:text-dark-text">
          {month + " " + title}
        </h2>
      </div>
      <ChartComponent
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: showLabel,
              labels: {
                color: isDarkMode ? "#FFFFFF" : "#6b7280",
              },
            },
          },
          scales:
            ChartComponent === Bar
              ? {
                  x: {
                    ticks: {
                      color: isDarkMode ? "#E2E8F0" : "#6b7280", // Change X-axis text color
                    },
                  },
                  y: {
                    ticks: {
                      color: isDarkMode ? "#E2E8F0" : "#6b7280", // Change Y-axis text color
                    },
                  },
                }
              : undefined,
        }}
        data={{
          labels: values.map((value) => value.label),
          datasets: [
            {
              label: "",
              data: values.map((value) => value.value),
              backgroundColor: ["#FFFF66", "#FF8C42 ", "#4D94FF"],
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
        <p className="text-sm text-gray-500 dark:text-dark-text">
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
  const [total, setTotal] = useState("");

  const {isDarkMode} = useContext(ThemeContext);

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
    <div className="flex flex-col items-center justify-center gap-3 py-14 rounded-xl shadow-2xl sm:px-10 sm:py-16 sm:gap-5  md:h-[23rem] lg:h-[25rem] lg:py-16 h-[20rem] sm:h-[22rem] bg-light-card cursor-pointer transition-colors duration-150 sm:col-span-2 dark:bg-dark-card">
      <div>
        <h2 className="font-bold text-gray-600 dark:text-dark-text">
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
            legend: {
              labels: {
                color: isDarkMode ? "#FFFFFF" : "#6b7280",
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: isDarkMode ? "#E2E8F0" : "#6b7280", // Change X-axis text color
              },
              grid: {
                color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#D1D5DB", // Color of X-axis grid lines for light mode
                lineWidth: 1, // Width of the grid lines
              },
            },
            y: {
              ticks: {
                color: isDarkMode ? "#E2E8F0" : "#6b7280", // Change Y-axis text color
              },
              grid: {
                color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#D1D5DB", // Color of Y-axis grid lines for light mode
                lineWidth: 1, // Width of the grid lines
              },
            },
          },
        }}
        data={{
          labels: recordData.map((record) => record.month),
          datasets: [
            {
              label: "Metal Can",
              data: recordData.map((record) => record.values?.["Metal Can"]),
              borderColor: "#FFFE28",
              backgroundColor: "#FFFE28",
              borderWidth: 3,
              tension: 0.1,
            },
            {
              label: "Plastic Bottle",
              data: recordData.map(
                (record) => record.values?.["Plastic Bottle"]
              ),
              borderColor: "#FF8C42",
              backgroundColor: "#FF8C42",
              borderWidth: 3,
              tension: 0.1,
            },
            {
              label: "Paper",
              data: recordData.map((record) => record.values.Paper),
              borderColor: "#4D94FF",
              backgroundColor: "#4D94FF",
              borderWidth: 3,
              tension: 0.1,
            },
          ],
        }}
      />

      <div>
        <p className="text-sm text-gray-500 dark:text-dark-text">
          Yearly {title} : {total}
        </p>
      </div>
    </div>
  );
});
