import {
  deleteData,
  fetchData,
  fetchSingleDocument,
  updateData,
  updateSingleData,
} from "@/firebase config/firebaseCRUD";
import {warningToast} from "@/utils/Toast";
import {memo, useContext, useEffect, useState} from "react";
// import {BiLoader} from "react-icons/bi";
import {MdNotificationsOff, MdNotificationsActive} from "react-icons/md";
import {Switch} from "@/components/ui/switch";
import {FaEdit} from "react-icons/fa";
import {RiDeleteBin6Fill} from "react-icons/ri";
import Modal from "../../../shared/Modal";
import {deleteAlert, errorAlert} from "@/utils/SweetAlerts";
import Label from "../../../shared/Label";
import Input from "../../../shared/Input";
import {SemaphoreContext} from "@/contexts/SemaphoreContextProvider";

const initalForm = {
  id: "",
  data: {
    isEnabled: false,
    name: "",
    number: "",
  },
};

interface Contact {
  id: string;
  data: ContactData;
}

interface ContactData {
  isEnabled: boolean;
  name: string;
  number: string;
}

export default function Notification() {
  const [isSmsEnabled, setIsSmsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState(initalForm);

  const {semaphoreData} = useContext(SemaphoreContext);
  console.log(semaphoreData);

  const modalFormInputs = [
    {
      label: {html: "name", value: "Name"},
      input: {
        type: "text",
        id: "name",
        onChange: handleFormChangeInModal,
        value: formData.data.name,
      },
    },
    {
      label: {html: "number", value: "Phone Number"},
      input: {
        type: "tel",
        id: "number",
        onChange: handleFormChangeInModal,
        value: formData.data.number,
        pattern: "09[0-9]{9}",
        placeholder: "ex. 09123456789",
      },
    },
  ];

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

  async function readRecord() {
    try {
      const recordArray = await fetchData<ContactData>("contacts");
      setContacts(recordArray);
    } catch (error) {
      errorAlert("Failed to fetch records");
    } finally {
    }
  }

  async function handleDelete(id: string) {
    const permission = await deleteAlert();
    if (permission) {
      try {
        await deleteData("contacts", id);
        readRecord();
      } catch (error) {
        errorAlert("Failed to delete record");
      }
    }
  }

  function handleEdit(id: string) {
    const editRecord: Contact | undefined = contacts.find(
      (contact) => contact.id === id
    );
    if (editRecord) {
      setIsEditing(true);
      setFormData(editRecord);
      setIsModalOpen(true);
    } else {
      errorAlert("Something went wrong! No record found");
    }
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

  async function handleSwitchChange(id: string) {
    const contact: Contact | undefined = contacts.find(
      (contact) => contact.id === id
    );

    try {
      if (contact) {
        await updateSingleData("contacts", id, {
          isEnabled: !contact.data.isEnabled,
        });
        readRecord();
      }
    } catch (error) {
      errorAlert("Error updating");

      console.log(error);
    }
  }

  useEffect(() => {
    getNotificationPermission();
  }, []);

  useEffect(() => {
    readRecord();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="grid place-items-center h-52">
  //       <BiLoader className="size-10 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-center px-4 py-8 md:px-6 lg:px-14">
      {isModalOpen && (
        <Modal<ContactData>
          readRecord={readRecord}
          isEditing={isEditing}
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          title="Contact"
          collectionName="contacts"
        >
          {modalFormInputs.map((item) => {
            return (
              <div key={item.label.value}>
                <Label {...item.label} />
                <Input {...item.input} />
              </div>
            );
          })}
        </Modal>
      )}
      <div className="flex flex-col items-center w-full gap-6">
        <div
          className={`relative flex items-center p-3 space-x-4 border rounded-full shadow-xl cursor-pointer border-black/20 bg-light-card dark:bg-dark-card ${
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
          <span className="font-semibold text-gray-700 md:text-lg dark:text-dark-text">
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
          <div className="relative flex flex-col overflow-y-auto max-h-[28rem] border border-zinc-400 bg-light-card w-full dark:bg-dark-card dark:border-dark-border">
            <div className="sticky top-0 left-0 grid p-2 text-[.80rem] font-bold bg-light-primary text-white grid-cols-4 place-items-center sm:text-base md:text-lg md:font-extrabold dark:bg-dark-primaryFocusBG/30 transition-colors duration-150">
              <h2>Name</h2>
              <h2>Number</h2>
              <h2>Action</h2>
              <h2 className="text-center">Send SMS</h2>
            </div>
            <div className="transition-colors duration-150 divide-y-2 dark:text-dark-text dark:divide-dark-border">
              {contacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  name={contact.data.name}
                  number={contact.data.number}
                  isSwitchEnabled={contact.data.isEnabled}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  id={contact.id}
                  onSwitchChange={handleSwitchChange}
                  isSmsEnabled={isSmsEnabled}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between w-full sm:pr-3">
            <button
              className={`px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 md:px-4 md:py-2.5 md:text-base ${
                !isSmsEnabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => {
                setIsEditing(false);
                setFormData(initalForm);
                setIsModalOpen(true);
              }}
              disabled={!isSmsEnabled}
            >
              Add Contact
            </button>
            <p className="text-xs text-gray-500">
              {semaphoreData?.balance || 0} messages left
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TableRowProps {
  name: string;
  number: string;
  isSwitchEnabled: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  id: string;
  onSwitchChange: (id: string) => Promise<void>;
  isSmsEnabled: boolean;
}

const TableRow = memo(function TableRow({
  name,
  number,
  isSwitchEnabled,
  onDelete,
  onEdit,
  id,
  onSwitchChange,
  isSmsEnabled,
}: TableRowProps) {
  return (
    <div className="grid grid-cols-4 py-2 text-xs text-center transition-colors duration-150 place-items-center sm:text-sm md:text-base hover:bg-zinc-200 bg-light-card dark:bg-dark-card dark:text-dark-text text-light-text">
      <p className="px-2">{name}</p>
      <p>{number}</p>
      <div className="flex flex-wrap items-center justify-center gap-0.5 text-zinc-50 md:gap-2">
        <button
          className={`p-1.5 bg-yellow-500 rounded-sm hover:bg-yellow-600 sm:p-2 ${
            !isSmsEnabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => onEdit(id)}
          disabled={!isSmsEnabled}
        >
          <FaEdit className="size-3 sm:size-4 " />
        </button>
        <button
          className={`p-1.5 bg-red-500 rounded-sm hover:bg-red-700 sm:p-2 ${
            !isSmsEnabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => onDelete(id)}
          disabled={!isSmsEnabled}
        >
          <RiDeleteBin6Fill className="size-3 sm:size-4 " />
        </button>
      </div>
      <Switch
        checked={isSwitchEnabled}
        onCheckedChange={() => onSwitchChange(id)}
        disabled={!isSmsEnabled}
      />
    </div>
  );
});
