import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function fetchData(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const recordArray = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));
  return recordArray;
}

export async function deleteData(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

export async function addData(collectionName: string, formData: Object) {
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
