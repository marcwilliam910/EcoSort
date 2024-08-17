import { useEffect, useState } from "react";
import Modal from "./Modal";
import { FaPrint } from "react-icons/fa";
import Chart from "react-google-charts";
import { deleteData, fetchData } from "../config/firebase";
import { BiLoader } from "react-icons/bi";
import { deleteAlert, errorAlert } from "../utils/SweetAlerts";

const initalForm = {
  id: "",
  data: {
    type: "",
    weight: "",
    amount: "",
    date: "",
  },
};
export default function RecordKeeping() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [records, setRecords] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(initalForm);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const data = [
    ["Category", "Weight", { role: "style" }],
    ["Paper", 58, "blue"],
    ["Metal Can", 35, "yellow"],
    ["Plastic Bottle", 45, "orange"],
  ];

  async function readRecord() {
    try {
      setIsLoading(true);
      const recordArray = await fetchData("records");
      setRecords(recordArray);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    readRecord();
  }, []);

  async function handleDeleteRecord(id: string) {
    const permission = await deleteAlert();

    if (permission) {
      try {
        await deleteData("records", id);
        readRecord();
      } catch (error) {
        errorAlert("Failed to delete record");
      }
    }
  }

  async function handleEditRecord(id: string) {
    const editRecord = records.find((record) => record.id === id);
    setIsEditing(true);
    setFormData(editRecord);
    setIsModalOpen(true);
  }

  return (
    <div className="p-5 ">
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          readRecord={readRecord}
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
        />
      )}
      <div className="space-y-5">
        <div className="flex items-end justify-between">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData(initalForm);
              setIsModalOpen(true);
            }}
            className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Record
          </button>
          <button className="flex items-center gap-0.5 hover:underline">
            <FaPrint className="size-3" />
            <p className="text-xs font-bold">Print</p>
          </button>
        </div>
        {records.length === 0 ? (
          <h1>No Record Available</h1>
        ) : (
          <>
            <div className="flex gap-3 text-xs">
              <div>
                <label htmlFor="item">Month: </label>
                <select id="item" className="py-0.5 border border-black">
                  <option value="jan">Jan</option>
                  <option value="feb">Feb</option>
                  <option value="march">March</option>
                </select>
              </div>
              <div>
                <label htmlFor="item">Year: </label>
                <select id="item" className="py-0.5 border border-black">
                  <option value="jan">2022</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid place-items-center h-52">
                <BiLoader className="size-10 animate-spin" />
              </div>
            ) : (
              <div className="relative flex flex-col gap-2 overflow-y-scroll max-h-[28rem]">
                <div className="sticky top-0 left-0 grid p-2 text-xs font-bold bg-zinc-300 grid-cols-tableDefault place-items-center ">
                  <h2>Type</h2>
                  <h2>Weight</h2>
                  <h2>Amount</h2>
                  <h2>Date</h2>
                  <h2>Action</h2>
                </div>
                <div className="divide-y-2 ">
                  {records.length > 0 &&
                    records
                      .sort(
                        (a, b) =>
                          Number(b.data.date.split("-").join("")) -
                          Number(a.data.date.split("-").join(""))
                      )
                      .map((record) => (
                        <TableRow
                          key={record.id}
                          type={record.data.type}
                          weight={record.data.weight}
                          amount={record.data.amount}
                          date={new Date(record.data.date)}
                          onDelete={() => handleDeleteRecord(record.id)}
                          onEdit={() => handleEditRecord(record.id)}
                        />
                      ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-10 pt-5">
              <div className="p-5 shadow-xl">
                <h1 className="font-semibold text-center">
                  Monthly Weight Record
                </h1>
                <PieChart data={data} type="ColumnChart" />
              </div>
              <div className="p-5 shadow-xl">
                <h1 className="font-semibold text-center">
                  Monthly Sales Record
                </h1>
                <PieChart data={data} type="PieChart" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface TableRowProps {
  type: string;
  weight: string;
  date: Date;
  amount: number;
  onDelete: () => void;
  onEdit: () => void;
}

function TableRow({
  type,
  weight,
  date,
  amount,
  onDelete,
  onEdit,
}: TableRowProps) {
  return (
    <div className="grid py-2 text-[0.70rem] text-center grid-cols-tableDefault place-items-center">
      <p>{type.charAt(0).toLocaleUpperCase() + type.slice(1)}</p>
      <p>{weight}kg</p>
      <p>₱{amount}</p>
      <p className="text-center">{date.toDateString()}</p>
      <div className="flex flex-col gap-1 ">
        <button
          className="px-1 py-1 text-white bg-yellow-500 hover:bg-yellow-600"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="px-1.5 py-1 text-white bg-red-600 hover:bg-red-700"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function PieChart({ data, type }) {
  const options = {
    vAxis: {
      title: "Weight in kg",
      titleTextStyle: { color: "#333", fontSize: 12 },
      textStyle: { fontSize: 10 },
    },
    hAxis: {
      textStyle: { fontSize: 10 },
    },
    legend: {
      position: "bottom",
      textStyle: { fontSize: 10 },
    },
    chartArea: {
      width: "80%",
      height: "70%",
    },
  };

  return <Chart chartType={type} data={data} options={options} />;
}
