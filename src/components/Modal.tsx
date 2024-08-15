import { IoClose } from "react-icons/io5";
import { db } from "../config/firebase";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { successAlert, errorAlert } from "../utils/SweetAlerts";
import { BiLoader } from "react-icons/bi";

interface ModalProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export default function Modal({ setIsModalOpen }: ModalProps) {
  const [formData, setFormData] = useState({
    category: "",
    weight: "",
    date: "",
  });
  const [isLoading, setisLoading] = useState<boolean>(false);

  function handleFormChange(e: any) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      setisLoading(true);
      const docRef = await addDoc(collection(db, "records"), formData);
      successAlert("Record added successfully");
      setIsModalOpen(false);
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
          Add New Record
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label html="category" value="Category" />
            <select
              id="category"
              className="block w-full p-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              defaultValue={formData.category}
              onChange={handleFormChange}
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="paper">Paper</option>
              <option value="metal">Metal</option>
              <option value="bottle">Plastic Bottle</option>
            </select>
          </div>

          <div>
            <Label html="weight" value="Weight in kg" />
            <Input
              type="number"
              id="weight"
              onChange={handleFormChange}
              value={formData.weight}
            />
          </div>

          <div>
            <Label html="date" value="Date" />
            <Input
              type="date"
              id="date"
              onChange={handleFormChange}
              value={formData.date}
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full p-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? <BiLoader className="size-6 animate-spin" /> : "Add"}
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
