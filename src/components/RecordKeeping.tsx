import { useState } from "react";
import Modal from "./Modal";
import { FaPrint } from "react-icons/fa";
import Chart from "react-google-charts";

export default function RecordKeeping() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<string>("Recent");

  const data = [
    ["Category", "Weight", { role: "style" }],
    ["Paper", 58, "blue"],
    ["Metal Can", 35, "yellow"],
    ["Plastic Bottle", 45, "orange"],
  ];

  return (
    <div className="p-5 ">
      {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
      <div className="space-y-5">
        <div className="flex items-end justify-between">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Record
          </button>
          <button className="flex items-center gap-0.5 hover:underline">
            <FaPrint className="size-3" />
            <p className="text-xs font-bold">Print</p>
          </button>
        </div>

        <div className="flex gap-3 text-xs">
          <div>
            <label htmlFor="filter">Filter by: </label>
            <select
              id="filter"
              className="py-0.5 border border-black"
              defaultValue={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="Recent">Recent</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>

          {filterBy !== "Recent" && (
            <div>
              <label htmlFor="item">{filterBy}: </label>
              <select id="item" className="py-0.5 border border-black">
                <option value="jan">Jan</option>
                <option value="feb">Feb</option>
                <option value="march">March</option>
              </select>
            </div>
          )}
        </div>

        <div className="relative flex flex-col gap-2 overflow-y-scroll max-h-[28rem]">
          <div className="sticky top-0 left-0 grid p-2 text-sm font-bold bg-zinc-300 grid-cols-tableDefault place-items-center ">
            <h2>Category</h2>
            <h2>Weight</h2>
            <h2>Date</h2>
            <h2>Action</h2>
          </div>
          <div className="divide-y-2 ">
            <TableRow category="Paper" weight="10kg" date="2022-01-01" />
            <TableRow category="Paper" weight="10kg" date="2022-01-01" />
            <TableRow category="Paper" weight="10kg" date="2022-01-01" />
            <TableRow category="Paper" weight="10kg" date="2022-01-01" />
            <TableRow category="Paper" weight="10kg" date="2022-01-01" />
            <TableRow category="Metal Can" weight="5kg" date="2022-02-01" />
            <TableRow category="Platic Bottle" weight="2kg" date="2022-03-01" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-10 pt-5">
          <div className="p-5 shadow-xl">
            <h1 className="font-semibold text-center">Monthly Weight Record</h1>
            <PieChart data={data} />
          </div>
          <div className="p-5 shadow-xl">
            <h1 className="font-semibold text-center">Monthly Weight Record</h1>
            <PieChart data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface TableRowProps {
  category: string;
  weight: string;
  date: string; // YYYY-MM-DD format
}

function TableRow({ category, weight, date }: TableRowProps) {
  return (
    <div className="grid py-2 text-xs grid-cols-tableDefault place-items-center">
      <p>{category}</p>
      <p>{weight}</p>
      <p className="text-center">{date}</p>
      <div className="flex flex-col gap-1">
        <button className="px-2 py-1 text-white bg-yellow-500 hover:bg-yellow-600">
          Edit
        </button>
        <button className="px-2 py-1 text-white bg-red-600 hover:bg-red-700">
          Delete
        </button>
      </div>
    </div>
  );
}

function PieChart({ data }) {
  const options = {
    vAxis: {
      title: "Weight in kg",
      titleTextStyle: { color: "#333" },
    },
    legend: "none",
  };
  return <Chart chartType="ColumnChart" data={data} options={options} />;
}
