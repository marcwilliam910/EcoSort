import { useEffect, useState, memo, useCallback } from "react";
import Modal from "./Modal";
import { deleteData, fetchData } from "../../../../config/firebase";
import { deleteAlert, errorAlert } from "../../../../utils/SweetAlerts";
import DynamicChart, { LineChart } from "./Charts";
import { FaPrint } from "react-icons/fa";
import { BiLoader } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import noData from "../../../../assets/no_data-removebg.png";
import PDF from "./PDF";
import { pdf } from "@react-pdf/renderer";

const initalForm = {
  id: "",
  data: {
    type: "",
    weight: "",
    amount: "",
    date: "",
  },
};

interface RecordData {
  amount: string;
  date: string; // or Date if you’re using Date objects
  type: "Paper" | "Metal Can" | "Plastic Bottle";
  weight: string;
}

interface Record {
  id: string;
  data: RecordData;
}

interface ChartData {
  label: string;
  value: number;
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

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function RecordKeeping() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [records, setRecords] = useState<Array<Record>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(initalForm);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [months, setMonths] = useState<Array<string>>([]);
  const [years, setYears] = useState<Array<string>>([]);
  const [recordToShow, setRecordToShow] = useState<Array<Record>>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    monthNames[new Date().getMonth()]
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [totalWasteSales, setTotalWasteSales] = useState<ChartData[]>([]);
  const [totalWasteWeight, setTotalWasteWeight] = useState<ChartData[]>([]);
  const [yearlySalesData, setYearlySalesData] = useState<YearlyData[]>([]);
  const [yearlyWeightData, setYearlyWeightData] = useState<YearlyData[]>([]);

  console.log("Render for Record Keeping");

  useEffect(() => {
    if (selectedYear === new Date().getFullYear().toString()) {
      setSelectedMonth(monthNames[new Date().getMonth()]);
    }
  }, [selectedYear]);

  useEffect(() => {
    // if selectedYear changes, update selectedMonth to the first array item
    if (
      months.length > 0 &&
      selectedYear !== new Date().getFullYear().toString() &&
      !months.includes(selectedMonth)
    ) {
      setSelectedMonth(months[0]);
    }
  }, [months]);

  useEffect(() => {
    // console.log(selectedYear, selectedMonth);
    let yearlySales: YearlyData[] = [];
    let yearlyWeight: YearlyData[] = [];
    const values: YearlyDataValues = {
      Paper: 0,
      "Metal Can": 0,
      "Plastic Bottle": 0,
    };

    let currentDataRecords: Record[] = [];
    const monthSet = new Set<string>();
    const yearSet = new Set<string>();

    records.forEach((record) => {
      const { amount, weight, type, date: dateStr }: RecordData = record.data;

      const date: Date = new Date(dateStr);
      const month: string = monthNames[date.getMonth()];
      const year: string = date.getFullYear().toString();

      if (selectedYear === year) {
        // to get the yearly sales and weight
        const isMonthExistingInSales = yearlySales.find(
          (s) => s.month === month
        );
        const isMonthExistingInWeight = yearlyWeight.find(
          (s) => s.month === month
        );
        if (isMonthExistingInSales && isMonthExistingInWeight) {
          isMonthExistingInSales.values[type] += Number(amount);
          isMonthExistingInWeight.values[type] += Number(weight);
        } else {
          yearlySales.push({
            month,
            values: { ...values, [type]: Number(amount) },
          });
          yearlyWeight.push({
            month,
            values: { ...values, [type]: Number(weight) },
          });
        }

        // to make sure only the month with the selected year is showing
        monthSet.add(month);
      }
      yearSet.add(year);

      if (month === selectedMonth && year === selectedYear) {
        currentDataRecords.push(record);
      }
    });

    // to sort the month name
    const sortedMonth = [...monthSet].sort(
      (a, b) => monthNames.indexOf(a) - monthNames.indexOf(b)
    );

    const sortedSalesRecord = yearlySales.sort(
      (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    );
    const sortedWeightRecord = yearlyWeight.sort(
      (a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    );

    setYearlySalesData(sortedSalesRecord);
    setYearlyWeightData(sortedWeightRecord);
    setMonths(sortedMonth);
    setYears([...yearSet]);
    setRecordToShow(currentDataRecords);
  }, [selectedMonth, selectedYear, records]);

  useEffect(() => {
    readRecord();
  }, []);

  useEffect(() => {
    const initialSales = [
      { label: "Metal Can", value: 0 },
      { label: "Plastic Bottle", value: 0 },
      { label: "Paper", value: 0 },
    ];
    const initalWeight = [
      { label: "Metal Can", value: 0 },
      { label: "Plastic Bottle", value: 0 },
      { label: "Paper", value: 0 },
    ];

    recordToShow.forEach((record) => {
      const { type, weight, amount } = record.data;

      initialSales.forEach((item) => {
        if (item.label === type) {
          item.value += parseInt(amount);
        }
      });

      initalWeight.forEach((item) => {
        if (item.label === type) {
          item.value += parseInt(weight);
        }
      });
    });

    setTotalWasteSales(initialSales);
    setTotalWasteWeight(initalWeight);
  }, [recordToShow]);

  async function readRecord() {
    try {
      setIsLoading(true);
      const recordArray = await fetchData("records");
      setRecords(recordArray);
    } catch (error) {
      errorAlert("Failed to fetch records");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteRecord = useCallback(async (id: string) => {
    const permission = await deleteAlert();

    if (permission) {
      try {
        await deleteData("records", id);
        readRecord();
        // if (months.length === 0) {
        //   setSelectedMonth(monthNames[new Date().getMonth()]);
        //   setSelectedYear(new Date().getFullYear().toString());
        // }
      } catch (error) {
        errorAlert("Failed to delete record");
      }
    }
  }, []);

  const handleEditRecord = useCallback(async (id: string) => {
    const editRecord: Record | undefined = records.find(
      (record) => record.id === id
    );
    if (editRecord) {
      setIsEditing(true);
      setFormData(editRecord);
      setIsModalOpen(true);
    } else {
      errorAlert("No record found");
    }
  }, []);

  async function downloadPdf() {
    const flattenedData = recordToShow.map((record) => record.data);

    const blob = await pdf(
      <PDF
        data={flattenedData}
        month={selectedMonth}
        year={selectedYear}
        totalWeight={totalWasteWeight}
        totalSales={totalWasteSales}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank"); // Open PDF in a new tab for viewing
    URL.revokeObjectURL(url); // Clean up
  }

  console.log(totalWasteSales);
  console.log(totalWasteWeight);

  return (
    <div className="p-5">
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          readRecord={readRecord}
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
        />
      )}
      <div className="space-y-5 ">
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
            <button
              className="flex items-center gap-0.5 hover:underline text-xs md:text-base md:mr-5"
              onClick={downloadPdf}
            >
              <FaPrint className="size-2.5 sm:size-3" />
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
                <select
                  id="item"
                  className="py-0.5 border border-black"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="item">Year: </label>
                <select
                  id="item"
                  className="py-0.5 border border-black"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {isLoading ? (
              <div className="grid place-items-center h-52">
                <BiLoader className="size-10 animate-spin md:size-16" />
              </div>
            ) : (
              <div className="relative flex flex-col gap-2 overflow-y-scroll max-h-[28rem] border border-zinc-400 bg-zinc-50">
                <div className="sticky top-0 left-0 grid p-2 text-[.80rem] font-bold bg-green-500 text-white grid-cols-tableDefault place-items-center sm:text-base md:text-lg md:font-extrabold">
                  <h2>Type</h2>
                  <h2>Weight</h2>
                  <h2>Amount</h2>
                  <h2>Date</h2>
                  <h2>Action</h2>
                </div>
                <div className="divide-y-2 ">
                  {recordToShow
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
                        date={new Date(record.data.date).toDateString()}
                        onDelete={() => handleDeleteRecord(record.id)}
                        onEdit={() => handleEditRecord(record.id)}
                      />
                    ))}
                </div>
              </div>
            )}

            <div className="grid w-full grid-cols-1 gap-3 pt-10 sm:grid-cols-2 ">
              <DynamicChart
                type="pie"
                values={totalWasteSales}
                title="Sales"
                month={selectedMonth}
                showLabel={true}
              />
              <DynamicChart
                type="bar"
                values={totalWasteWeight}
                title="Weight"
                month={selectedMonth}
                showLabel={false}
              />
              <LineChart
                year={selectedYear}
                title={"Sales"}
                recordData={yearlySalesData}
              />
              <LineChart
                year={selectedYear}
                title={"Weight"}
                recordData={yearlyWeightData}
              />
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
  date: string;
  amount: string;
  onDelete: () => void;
  onEdit: () => void;
}

const TableRow = memo(function TableRow({
  type,
  weight,
  date,
  amount,
  onDelete,
  onEdit,
}: TableRowProps) {
  console.log("Render for TableRow");

  return (
    <div className="grid py-2 text-xs text-center grid-cols-tableDefault place-items-center sm:text-sm md:text-base">
      <p>{type}</p>
      <p>{weight}kg</p>
      <p>₱{amount}</p>
      <p className="text-center">{date}</p>
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
});
