import { getFirestore, collection, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import app from "./firebaseConfig";

const db = getFirestore(app);

// Clubs
export const getClubs = async () => {
  const snapshot = await getDocs(collection(db, "clubs"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Events
export const getEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const registerForEvent = async (eventId, userEmail) => {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, {
    registrations: arrayUnion(userEmail),
  });
};

export { db };
