import {IoClose} from "react-icons/io5";
import {addData, updateData} from "../../firebase config/firebaseCRUD";
import {useState} from "react";
import {successAlert, errorAlert} from "../../utils/SweetAlerts";
import {BiLoader} from "react-icons/bi";

import React from "react";
import {DocumentData} from "firebase/firestore";

// Define a generic interface for ModalProps
interface ModalProps<T> {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readRecord: () => void;
  isEditing: boolean;
  formData: {
    id: string;
    data: T;
  };
  title: string;
  collectionName: string; // Name of the Firestore collection to fetch records from. For example, "records"
  children: React.ReactNode;
}

const isValidPhoneNumber = (number: string) => {
  // if number dont exist, means from record keeping
  if (!number) return true;

  // Use a regular expression to validate Philippine mobile phone number format
  const philippinePhoneRegex = /^09(\d{2})(\d{3})(\d{4})$/;
  return number.startsWith("09") && philippinePhoneRegex.test(number);
};

export default function Modal<T extends DocumentData>({
  setIsModalOpen,
  readRecord,
  isEditing,
  formData,
  title,
  collectionName,
  children,
}: ModalProps<T>) {
  const [isLoading, setisLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const {number} = formData.data;
    try {
      setisLoading(true);

      if (!isValidPhoneNumber(number)) {
        errorAlert(
          "Invalid phone number. Please enter an 11-digit mobile number starting with 09."
        );
        return;
      }

      if (isEditing) {
        await updateData(collectionName, formData.id, formData.data);
      } else {
        await addData<T>(collectionName, formData.data);
      }

      successAlert(`Record ${isEditing ? "updated" : "added"} successfully`);
      setIsModalOpen(false);
      readRecord();
    } catch (error) {
      console.log(error);

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
            className="font-bold cursor-pointer size-7 lg:size-8"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <h1 className="mb-6 text-xl font-semibold text-center text-gray-800 md:text-2xl">
          {isEditing ? `Update ${title}` : `Add New ${title}`}
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {children}

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
              "Update"
            ) : (
              "Add"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
