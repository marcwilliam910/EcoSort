import {
  useEffect,
  useState,
  memo,
  useCallback,
  useContext,
  lazy,
  Suspense,
} from "react";
import {deleteData, fetchData} from "../../../../firebase config/firebaseCRUD";
import {deleteAlert, errorAlert} from "../../../../utils/SweetAlerts";
// import DynamicChart, {LineChart} from "./Charts";
const LineChart = lazy(() =>
  import("./Charts").then((module) => ({default: module.LineChart}))
);
const DynamicChart = lazy(() =>
  import("./Charts").then((module) => ({default: module.DynamicChart}))
);

import {FaPrint} from "react-icons/fa";
import {BiLoader} from "react-icons/bi";
import {FaEdit} from "react-icons/fa";
import {RiDeleteBin6Fill} from "react-icons/ri";
import noData from "@/assets/png/no_data-removebg.png";
import noDataWebp from "@/assets/webp/no_data-removebg.webp";
import {pdf} from "@react-pdf/renderer";
import SelectComponent from "@/components/shadcn/SelectComponent";
import Label from "@/components/shared/Label";
import Input from "@/components/shared/Input";
import Modal from "@/components/shared/Modal";
import {ThemeContext} from "@/contexts/ThemeContextProvider";

const initalForm: Record = {
  id: "",
  data: {
    type: "Paper", // edit this
    weight: "",
    amount: "",
    date: "",
  },
};

interface RecordData {
  amount: string;
  date: string;
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
  const [records, setRecords] = useState<Record[]>([]);
  const [recordToShow, setRecordToShow] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(initalForm);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [months, setMonths] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
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

  const {isDarkMode} = useContext(ThemeContext);

  const modalFormInputs = [
    {
      label: {html: "select", value: "Waste Type"},
      input: {
        id: "type",
        type: "select",
        options: [
          {label: "Paper", value: "Paper"},
          {label: "Metal Can", value: "Metal Can"},
          {label: "Plastic Bottle", value: "Plastic Bottle"},
        ],
        onChange: handleFormChangeInModal,
        value: formData.data.type,
      },
    },
    {
      label: {html: "amount", value: "Amount"},
      input: {
        type: "number",
        id: "amount",
        onChange: handleFormChangeInModal,
        value: formData.data.amount,
      },
    },
    {
      label: {html: "date", value: "Date"},
      input: {
        type: "date",
        id: "date",
        onChange: handleFormChangeInModal,
        value: formData.data.date,
        max: new Date().toISOString().split("T")[0],
      },
    },
    {
      label: {html: "weight", value: "Weight in kg"},
      input: {
        type: "number",
        id: "weight",
        onChange: handleFormChangeInModal,
        value: formData.data.weight,
      },
    },
  ];

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
    const yearlySales: YearlyData[] = [];
    const yearlyWeight: YearlyData[] = [];
    const values: YearlyDataValues = {
      Paper: 0,
      "Metal Can": 0,
      "Plastic Bottle": 0,
    };

    const currentMonth = monthNames[new Date().getMonth()];
    const currentDataRecords: Record[] = [];
    const monthSet = new Set<string>();
    const yearSet = new Set<string>();

    records.forEach((record) => {
      const {amount, weight, type, date: dateStr}: RecordData = record.data;

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
            values: {...values, [type]: Number(amount)},
          });
          yearlyWeight.push({
            month,
            values: {...values, [type]: Number(weight)},
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

    // if the current month has no record, still add to month list
    // make sure the current month is still included even when no record
    if (!monthSet.has(currentMonth)) {
      monthSet.add(currentMonth);
    }
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
      {label: "Metal Can", value: 0},
      {label: "Plastic Bottle", value: 0},
      {label: "Paper", value: 0},
    ];
    const initalWeight = [
      {label: "Metal Can", value: 0},
      {label: "Plastic Bottle", value: 0},
      {label: "Paper", value: 0},
    ];

    recordToShow.forEach((record) => {
      const {type, weight, amount} = record.data;

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

    // if user delete all the records in specific month, set selected month to current month
    if (recordToShow.length == 0) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [recordToShow]);

  async function readRecord() {
    try {
      setIsLoading(true);
      const recordArray = await fetchData<RecordData>("records");
      setRecords(recordArray);
    } catch (error) {
      errorAlert("Failed to fetch records", isDarkMode);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteRecord = useCallback(
    async (id: string) => {
      const permission = await deleteAlert(isDarkMode);
      if (permission) {
        try {
          await deleteData("records", id);
          readRecord();
          // if (months.length === 0) {
          //   setSelectedMonth(monthNames[new Date().getMonth()]);
          //   setSelectedYear(new Date().getFullYear().toString());
          // }
        } catch (error) {
          errorAlert("Failed to delete record", isDarkMode);
        }
      }
    },
    [isDarkMode]
  );

  const handleEditRecord = useCallback(
    (id: string) => {
      const editRecord: Record | undefined = records.find(
        (record) => record.id === id
      );
      if (editRecord) {
        setIsEditing(true);
        setFormData(editRecord);
        setIsModalOpen(true);
      } else {
        errorAlert("Something went wrong! No record found", isDarkMode);
      }
    },
    [records, isDarkMode]
  );

  async function downloadPdf() {
    // Dynamically import the PDF component only when needed
    const {default: PDF} = await import("./PDF");

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

  function handleFormChangeInModal(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormData({
      ...formData,
      data: {
        ...formData.data,
        [e.target.id]: e.target.value,
      },
    });
  }

  function Loader() {
    return (
      <div className="grid h-72 place-items-center dark:text-dark-text ">
        <BiLoader className="size-10 animate-spin md:size-16" />
      </div>
    );
  }

  return (
    <div className="p-5">
      {isModalOpen && (
        <Modal<RecordData>
          setIsModalOpen={setIsModalOpen}
          readRecord={readRecord}
          formData={formData}
          isEditing={isEditing}
          title="Record"
          collectionName="records"
        >
          <>
            {modalFormInputs.map((item) => {
              return (
                <div key={item.input.id}>
                  <Label {...item.label} />
                  <Input {...item.input} />
                </div>
              );
            })}
          </>
        </Modal>
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
          {recordToShow.length != 0 && (
            <button
              className="flex items-center gap-0.5 hover:underline text-xs md:text-base md:mr-5 dark:text-dark-text"
              onClick={downloadPdf}
            >
              <FaPrint className="size-2.5 sm:size-3" />
              <p className="font-bold">Print</p>
            </button>
          )}
        </div>
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16">
            <h1 className="text-lg font-bold text-center text-red-500 md:text-xl lg:text-2xl xl:text-3xl">
              Oops! No Record Available
            </h1>
            <picture>
              <source srcSet={noDataWebp} type="image/webp" />
              <source srcSet={noData} type="image/png" />
              <img
                src={noData}
                alt="No Data Available"
                className="size-64 md:size-96"
              />
            </picture>
          </div>
        ) : (
          <>
            <div className="flex gap-3 text-xs sm:text-sm dark:text-dark-text">
              <div className="flex items-center gap-2 ">
                <label htmlFor="item">Month: </label>
                <SelectComponent
                  value={selectedMonth}
                  setValue={setSelectedMonth}
                  data={months}
                />
              </div>
              <div className="flex items-center gap-2 dark:">
                <label htmlFor="item">Year: </label>
                <SelectComponent
                  value={selectedYear}
                  setValue={setSelectedYear}
                  data={years}
                />
              </div>
            </div>
            {recordToShow.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-10 ">
                <h1 className="text-lg font-bold text-center md:text-xl lg:text-2xl xl:text-3xl">
                  No Record for{" "}
                  <span className="text-red-500">{selectedMonth}</span>
                </h1>
                <picture>
                  <source srcSet={noDataWebp} type="image/webp" />
                  <source srcSet={noData} type="image/png" />
                  <img
                    src={noData}
                    alt="No Data Available"
                    className="size-64 md:size-96"
                  />
                </picture>
              </div>
            ) : (
              <>
                {isLoading ? (
                  <Loader />
                ) : (
                  <div className="relative flex flex-col overflow-y-auto max-h-[28rem] border border-zinc-400 bg-light-card dark:bg-dark-card dark:border-dark-border transition-colors duration-150 rounded-xl">
                    <div className="sticky top-0 left-0 grid p-2 text-[.80rem] font-bold bg-light-primary text-white grid-cols-tableDefault place-items-center sm:text-base md:text-lg md:font-extrabold dark:bg-dark-primaryFocusBG/30">
                      <h2>Type</h2>
                      <h2>Weight</h2>
                      <h2>Amount</h2>
                      <h2>Date</h2>
                      <h2>Action</h2>
                    </div>
                    <div className="transition-colors duration-150 divide-y-2 text-light-text dark:text-dark-text dark:divide-dark-border">
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
                            onDelete={handleDeleteRecord}
                            onEdit={handleEditRecord}
                            id={record.id}
                          />
                        ))}
                    </div>
                  </div>
                )}

                <Suspense fallback={<Loader />}>
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
                </Suspense>
              </>
            )}
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
  onDelete: (id: string) => void; // Now accepts an id as a parameter
  onEdit: (id: string) => void; // Now accepts an id as a parameter
  id: string;
}

const TableRow = memo(function TableRow({
  type,
  weight,
  date,
  amount,
  onDelete,
  onEdit,
  id,
}: TableRowProps) {
  return (
    <div className="grid py-2 text-xs text-center duration-150 grid-cols-tableDefault place-items-center sm:text-sm md:text-base hover:bg-zinc-200 dark:hover:bg-dark-primaryHover">
      <p>{type}</p>
      <p>{weight}kg</p>
      <p>₱{amount}</p>
      <p className="text-center">{date}</p>
      <div className="flex flex-wrap items-center justify-center gap-1 text-zinc-50 md:gap-2">
        <button
          className="p-1.5 bg-yellow-500 rounded-sm hover:bg-yellow-600 sm:p-2"
          onClick={() => onEdit(id)}
        >
          <FaEdit className="size-3 sm:size-4 " />
        </button>
        <button
          className="p-1.5 bg-red-500 rounded-sm hover:bg-red-700 sm:p-2"
          onClick={() => onDelete(id)}
        >
          <RiDeleteBin6Fill className="size-3 sm:size-4 " />
        </button>
      </div>
    </div>
  );
});
