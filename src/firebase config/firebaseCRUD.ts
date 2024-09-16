import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function fetchData(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const recordArray = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data() as RecordData,
  }));
  return recordArray;
}

export async function deleteData(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

export async function addData(collectionName: string, formData: RecordData) {
  await addDoc(collection(db, collectionName), formData);
}

export async function updateData(
  collectionName: string,
  id: string,
  formData: Object
) {
  const recordRef = doc(db, collectionName, id);
  await setDoc(recordRef, formData);
}

interface RecordData {
  amount: string;
  date: string;
  type: "Paper" | "Metal Can" | "Plastic Bottle";
  weight: string;
}

// for fetchSms
// export async function fetchSmsData() {
//   const docRef = doc(db, "notification", "smsSettings");
//   const docSnapshot = await getDoc(docRef);
//   if (!docSnapshot.exists()) {
//     throw new Error("Could not find");
//   }

//   const subCollectionSnap = await getDocs(collection(docRef, "contactNumber"));
//   const subCollectionData = subCollectionSnap.docs.map((doc) => ({
//     id: doc.id,
//     data: doc.data() as ContactNumbers,
//   }));

//   return {
//     smsSettings: docSnapshot.data() as SmsSettings,
//     contactNumbers: subCollectionData,
//   };
// }

// interface ContactNumbers {
//   contactNumber: string;
//   isEnable: boolean;
//   name: string;
// }
// interface SmsSettings {
//   isEnable: boolean;
// }

export async function fetchSingleDocument(
  collectionName: string,
  documentName: string
) {
  const docSnap = await getDoc(doc(db, collectionName, documentName));
  if (docSnap.exists()) {
    return docSnap.data().isEnabled;
  }
}
