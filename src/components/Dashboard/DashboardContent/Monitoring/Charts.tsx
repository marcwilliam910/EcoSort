import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  DoughnutController,
  Legend,
  Title,
  Tooltip,
} from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

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

const option = {
  maintainAspectRatio: false,
  responsive: true,
};

interface DynamicChartProps {
  type: "pie" | "bar";
}

export default function DynamicChart({ type }: DynamicChartProps) {
  const ChartComponent = chartType[type];
  return (
    <div className="flex flex-col items-center justify-center w-64 gap-3 py-14 shadow-2xl h-[22rem] px-5 md:w-80 xl:w-96 2xl:w-[29rem]">
      <div>
        <h2 className="font-bold text-gray-600">Monthly Sales</h2>
      </div>
      <ChartComponent
        options={option}
        data={{
          labels: ["Metal Can", "Paper", "Plastic Bottle"],
          datasets: [
            {
              label: "Amount",
              data: [400, 350, 870],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              borderRadius: 5,
              datalabels: {
                color: "#353839",
                font: {
                  weight: "bold",
                },
                formatter(value) {
                  return "₱" + value;
                },
              },
            },
          ],
        }}
      />
      <div>
        <p className="text-sm text-gray-500">Total Sales: ₱1,620</p>
      </div>
    </div>
  );
}
