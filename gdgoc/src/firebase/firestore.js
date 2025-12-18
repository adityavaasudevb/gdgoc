import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./firebaseConfig";

const db = getFirestore(app);

export const getClubs = async () => {
  const snapshot = await getDocs(collection(db, "clubs"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export { db };
