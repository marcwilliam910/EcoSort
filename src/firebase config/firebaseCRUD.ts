import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  WithFieldValue,
} from "firebase/firestore";
import {db} from "./firebase";

export async function fetchData<T>(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const recordArray = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data() as T,
  }));
  return recordArray;
}

export async function deleteData(collectionName: string, id: string) {
  await deleteDoc(doc(db, collectionName, id));
}

export async function addData<T extends DocumentData>(
  collectionName: string,
  formData: WithFieldValue<T>
) {
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

export async function fetchSingleDocument<T>(
  collectionName: string,
  documentName: string
) {
  const docSnap = await getDoc(doc(db, collectionName, documentName));
  if (docSnap.exists()) {
    // Return an object that includes the document id and its data
    return {id: docSnap.id, ...(docSnap.data() as T)};
  } else {
    throw new Error("Document does not exist");
  }
}

export async function updateSingleData(
  collectionName: string,
  id: string,
  data: any
) {
  const documentRef = doc(db, collectionName, id);
  await updateDoc(documentRef, data);
}

export async function addDocumentInCollection<T extends Object>(
  collectionName: string,
  documentName: string,
  defaultField: T
) {
  await setDoc(doc(db, collectionName, documentName), defaultField);
}
