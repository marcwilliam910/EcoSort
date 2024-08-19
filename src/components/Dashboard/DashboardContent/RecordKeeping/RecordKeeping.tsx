import { useEffect, useState } from "react";
import Modal from "./Modal";
import { deleteData, fetchData } from "../../../../config/firebase";
import { deleteAlert, errorAlert } from "../../../../utils/SweetAlerts";
import DynamicChart from "../Monitoring/Charts";
import { FaPrint } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import noData from "../../../../assets/no data.jpg";

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

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <BiLoader className="text-3xl animate-spin" />
  //     </div>
  //   );
  // }

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
            className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 md:px-4 md:py-2.5 md:text-base"
          >
            Add New Record
          </button>
          {records.length != 0 && (
            <button className="flex items-center gap-0.5 hover:underline text-base md:mr-5">
              <FaPrint className="size-3 sm:size-4" />
              <p className="font-bold">Print</p>
            </button>
          )}
        </div>
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16">
            <h1 className="text-lg font-bold text-red-500 md:text-xl lg:text-2xl xl:text-3xl">
              Oops! No Record Available
            </h1>
            <img
              src={noData}
              alt="No Data Available"
              className="size-64 md:size-96"
            />
          </div>
        ) : (
          <>
            <div className="flex gap-3 text-xs sm:text-sm">
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
                <BiLoader className="size-10 animate-spin md:size-16" />
              </div>
            ) : (
              <div className="relative flex flex-col gap-2 overflow-y-scroll max-h-[28rem] border border-zinc-400">
                <div className="sticky top-0 left-0 grid p-2 text-[.80rem] font-bold bg-zinc-300 grid-cols-tableDefault place-items-center sm:text-base md:text-lg md:font-extrabold">
                  <h2>Type</h2>
                  <h2>Weight</h2>
                  <h2>Amount</h2>
                  <h2>Date</h2>
                  <h2>Action</h2>
                </div>
                <div className="divide-y-2 ">
                  {records
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

            <div className="flex flex-wrap items-center justify-center w-full gap-10 pt-10">
              <DynamicChart type="pie" />
              <DynamicChart type="bar" />
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
    <div className="grid py-2 text-xs text-center grid-cols-tableDefault place-items-center sm:text-sm md:text-base">
      <p>{type}</p>
      <p>{weight}kg</p>
      <p>₱{amount}</p>
      <p className="text-center">{date.toDateString()}</p>
      <div className="flex flex-wrap items-center justify-center gap-1 text-zinc-50 md:gap-2">
        <button
          className="p-1.5 bg-yellow-500 rounded-sm hover:bg-yellow-600 sm:p-2"
          onClick={onEdit}
        >
          <FaEdit className="size-3 sm:size-4 " />
        </button>
        <button
          className="p-1.5 bg-red-500 rounded-sm hover:bg-red-700 sm:p-2"
          onClick={onDelete}
        >
          <RiDeleteBin6Fill className="size-3 sm:size-4 " />
        </button>
      </div>
    </div>
  );
}
