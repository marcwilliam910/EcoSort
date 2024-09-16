import {fetchSingleDocument, updateData} from "@/firebase config/firebaseCRUD";
import {warningToast} from "@/utils/Toast";
import {memo, useEffect, useState} from "react";
import {BiLoader} from "react-icons/bi";
import {MdNotificationsOff, MdNotificationsActive} from "react-icons/md";
import {Switch} from "@/components/ui/switch";
import {FaEdit} from "react-icons/fa";
import {RiDeleteBin6Fill} from "react-icons/ri";
import {httpsCallable} from "firebase/functions";
import {functions} from "@/firebase config/firebase";

const dummyData = [
  {id: "1", name: "Jayvee Sucal", number: "09653410782", isEnabled: false},
  {id: "2", name: "John Loyd", number: "09876543210", isEnabled: true},
  {id: "3", name: "Emma Witson", number: "09098765432", isEnabled: false},
  {id: "4", name: "Michael Jordan", number: "09123456789", isEnabled: true},
  {id: "5", name: "Sarah Pascual", number: "09345678901", isEnabled: false},
  {id: "6", name: "Daniel Padilla", number: "09456789012", isEnabled: true},
];

// interface SemaphoreResponse {
//   balance: number;
// }

export default function Notification() {
  const [isSmsEnabled, setIsSmsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [smsBalance, setSmsBalance] = useState(0);

  async function getNotificationPermission() {
    try {
      setLoading(true);
      const permission = await fetchSingleDocument(
        "notificationSettings",
        "permission"
      );
      setIsSmsEnabled(permission);
    } catch (e) {
      warningToast("Something went wrong in fetching notification permission");
    } finally {
      setLoading(false);
    }
  }

  async function updateNotificationPermission() {
    try {
      setLoading(true);
      await updateData("notificationSettings", "permission", {
        isEnabled: !isSmsEnabled,
      });
      await getNotificationPermission();
    } catch (error) {
      warningToast("Something went wrong in updating notification permission");
    } finally {
      setLoading(false);
    }
  }

  // async function getSmsBalance() {
  //   try {
  //     // Specify the response type as SemaphoreResponse
  //     const getSemaphoreBalance = httpsCallable<{}, SemaphoreResponse>(
  //       functions,
  //       "getSemaphoreAccoundData"
  //     );
  //     const result = await getSemaphoreBalance();

  //     setSmsBalance(result.data.balance); // Assuming setSmsBalance expects a number
  //   } catch (error) {
  //     warningToast("Something went wrong in fetching SMS balance");
  //   }
  // }

  // useEffect(() => {
  //   getSmsBalance();
  // }, []);

  useEffect(() => {
    getNotificationPermission();
  }, []);

  function handleDelete(id: string) {}

  function handleEdit(id: string) {}

  // if (loading) {
  //   return (
  //     <div className="grid place-items-center h-52">
  //       <BiLoader className="size-10 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="flex flex-col items-center w-full gap-6">
        <div
          className={`relative flex items-center p-3 space-x-4 border rounded-full shadow-xl cursor-pointer border-black/20 bg-zinc-300${
            loading
              ? "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-green-400 after:animate-loading"
              : ""
          }`}
          onClick={updateNotificationPermission}
        >
          {isSmsEnabled ? (
            <MdNotificationsActive className="text-green-500 size-6 md:size-8" />
          ) : (
            <MdNotificationsOff className="text-red-400 size-6 md:size-8" />
          )}
          <span className="font-semibold text-gray-700 md:text-lg">
            {isSmsEnabled ? "SMS Enabled" : "SMS Disabled"}
          </span>
          <Switch checked={isSmsEnabled} />
        </div>
        {/* table */}
        <div
          className={`w-full space-y-3 ${
            isSmsEnabled ? "" : "opacity-20 cursor-not-allowed"
          }`}
        >
          <div className="relative flex flex-col overflow-y-auto max-h-[28rem] border border-zinc-400 bg-zinc-50  w-full">
            <div className="sticky top-0 left-0 grid p-2 text-[.80rem] font-bold bg-green-500 text-white grid-cols-4 place-items-center sm:text-base md:text-lg md:font-extrabold">
              <h2>Name</h2>
              <h2>Number</h2>
              <h2>Action</h2>
              <h2 className="text-center">Send SMS</h2>
            </div>
            <div className="divide-y-2 ">
              {dummyData.map((data) => (
                <TableRow
                  key={data.id}
                  name={data.name}
                  number={data.number}
                  isEnabled={data.isEnabled}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  id={data.id}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between w-full sm:pr-3">
            <button className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 md:px-4 md:py-2.5 md:text-base">
              Add Contact
            </button>
            <p className="text-xs text-gray-500">{smsBalance} messages left</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TableRowProps {
  name: string;
  number: string;
  isEnabled: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  id: string;
}

const TableRow = memo(function TableRow({
  name,
  number,
  isEnabled,
  onDelete,
  onEdit,
  id,
}: TableRowProps) {
  return (
    <div className="grid grid-cols-4 py-2 text-xs text-center duration-150 place-items-center sm:text-sm md:text-base hover:bg-zinc-200">
      <p className="px-2">{name}</p>
      <p>{number}</p>
      <div className="flex flex-wrap items-center justify-center gap-0.5 text-zinc-50 md:gap-2">
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
      <Switch checked={isEnabled} />
    </div>
  );
});
