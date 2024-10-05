import {IoClose} from "react-icons/io5";
import {
  addData,
  addDocumentInCollection,
  fetchData,
  updateData,
} from "../../firebase config/firebaseCRUD";
import {useContext, useState} from "react";
import {successAlert, errorAlert} from "../../utils/SweetAlerts";
import {BiLoader} from "react-icons/bi";

import React from "react";
import {DocumentData} from "firebase/firestore";
import {ThemeContext} from "@/contexts/ThemeContextProvider";
import {SensorLocationContext} from "@/contexts/SensorLocationContextProvider";

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
  documentName?: string; // Name of the location when adding new location
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
  documentName,
  children,
}: ModalProps<T>) {
  const [isLoading, setisLoading] = useState<boolean>(false);

  const {isDarkMode} = useContext(ThemeContext);
  const {getSubMenus} = useContext(SensorLocationContext);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    let message = "";
    e.preventDefault();
    const {number} = formData.data;
    try {
      setisLoading(true);

      if (!isValidPhoneNumber(number)) {
        errorAlert(
          "Invalid phone number. Please enter an 11-digit mobile number starting with 09.",
          isDarkMode
        );
        return;
      }

      if (isEditing) {
        await updateData(collectionName, formData.id, formData.data);
        message = "Record updated successfully";
      } else if (title === "Location" && documentName) {
        const locations = await fetchData<DocumentType>("sensor");
        const isLocationExisited = locations.find(
          (location) =>
            location.id.toLowerCase() === documentName.toLocaleLowerCase()
        );

        if (isLocationExisited) {
          errorAlert(
            "Location already exists. Please enter a unique location name.",
            isDarkMode
          );
          return;
        }

        await addDocumentInCollection(
          collectionName,
          documentName.toLocaleLowerCase(),
          formData.data
        );
        message = "Location added successfully";
      } else {
        await addData<T>(collectionName, formData.data);
        message = "Record added successfully";
      }

      successAlert(message, isDarkMode);
      setIsModalOpen(false);

      if (title === "Location") getSubMenus();
      else readRecord();
    } catch (error) {
      console.log(error);

      errorAlert("Failed to add record", isDarkMode);
    } finally {
      setisLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid px-3 bg-black bg-opacity-50 place-items-center">
      <div className="relative w-full max-w-md p-8 rounded-lg shadow-lg bg-light-card dark:bg-dark-card">
        <div className="absolute right-2 top-2 ">
          <IoClose
            className="font-bold cursor-pointer size-7 lg:size-8"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
        <h1 className="mb-6 text-xl font-semibold text-center text-light-text dark:text-dark-text md:text-2xl">
          {isEditing ? `Update ${title}` : `Add New ${title}`}
        </h1>
        <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
          {children}

          <button
            type="submit"
            className={`flex items-center justify-center w-full p-2 md:p-2.5 text-white rounded-md shadow focus:outline-none ${
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
