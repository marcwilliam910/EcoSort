import { IoClose } from "react-icons/io5";
import { addData, updateData } from "../config/firebase";
import { useState } from "react";
import { successAlert, errorAlert } from "../utils/SweetAlerts";
import { BiLoader } from "react-icons/bi";

interface ModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
  readRecord: () => void;
  isEditing: any;
  formData: FormData;
  setFormData: (data: FormData) => void;
}

interface FormData {
  id: string;
  data: {
    type: string;
    weight: string;
    amount: string;
    date: string;
  };
}

export default function Modal({
  setIsModalOpen,
  readRecord,
  isEditing,
  formData,
  setFormData,
}: ModalProps) {
  const [isLoading, setisLoading] = useState<boolean>(false);

  function handleFormChange(e: any) {
    setFormData({
      ...formData,
      data: {
        ...formData.data,
        [e.target.id]: e.target.value,
      },
    });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      setisLoading(true);
      if (isEditing) {
        await updateData("records", formData.id, formData.data);
      } else {
        await addData("records", formData.data);
      }
      successAlert(`Record ${isEditing ? "updated" : "added"} successfully`);
      setIsModalOpen(false);
      readRecord();
    } catch (error) {
      errorAlert("Failed to add record");
    } finally {
      setisLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid px-3 bg-black bg-opacity-50 place-items-center">
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="absolute right-2 top-2 ">
          <IoClose
            className="font-bold text-red-500 cursor-pointer size-7 lg:size-8"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <h1 className="mb-6 text-xl font-semibold text-center text-gray-800 md:text-2xl">
          {isEditing ? "Edit Record" : "Add New Record"}
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label html="type" value="Waste type" />
            <select
              id="type"
              className="block w-full p-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              defaultValue={formData.data.type}
              onChange={handleFormChange}
            >
              <option value="" disabled>
                Select waste type
              </option>
              <option value="paper">Paper</option>
              <option value="metal can">Metal Can</option>
              <option value="plastic bottle">Plastic Bottle</option>
            </select>
          </div>

          <div>
            <Label html="weight" value="Weight in kg" />
            <Input
              type="number"
              id="weight"
              onChange={handleFormChange}
              value={formData.data.weight}
            />
          </div>

          <div>
            <Label html="amount" value="Amount" />
            <Input
              type="number"
              id="amount"
              onChange={handleFormChange}
              value={formData.data.amount}
            />
          </div>
          <div>
            <Label html="date" value="Date" />
            <Input
              type="date"
              id="date"
              onChange={handleFormChange}
              value={formData.data.date}
            />
          </div>

          <button
            type="submit"
            className={`flex items-center justify-center w-full p-2 text-white  rounded-md shadow  focus:outline-none ${
              isEditing
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <BiLoader className="size-6 animate-spin" />
            ) : isEditing ? (
              "Edit"
            ) : (
              "Add"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

interface InputProps {
  type: string;
  id: string;
  onChange: (e: any) => void;
  value: string;
}
function Input({ type, id, onChange, value }: InputProps) {
  return (
    <input
      type={type}
      id={id}
      required
      className="block w-full p-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      onChange={onChange}
      value={value}
    />
  );
}

interface LabelProps {
  html: string;
  value: string;
}

function Label({ html, value }: LabelProps) {
  return (
    <label htmlFor={html} className="block text-sm font-medium text-gray-700">
      {value}
    </label>
  );
}
