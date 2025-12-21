import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
} from "firebase/firestore";
import app from "./firebaseConfig";
import { addDoc } from "firebase/firestore";


const db = getFirestore(app);

// -------------------- Clubs --------------------
export const getClubs = async () => {
  const snapshot = await getDocs(collection(db, "clubs"));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

// -------------------- Events --------------------
export const getEvents = async () => {
  const snapshot = await getDocs(collection(db, "events"));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

export const registerForEvent = async (eventId, userEmail) => {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, {
    registrations: arrayUnion(userEmail),
  });
};

// -------------------- Bookmarks --------------------
export const getUserBookmarks = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data().bookmarks || [] : [];
};

export const toggleBookmark = async (uid, clubId, isBookmarked) => {
  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    {
      bookmarks: isBookmarked
        ? arrayRemove(clubId)
        : arrayUnion(clubId),
    },
    { merge: true }
  );
};
export const addEvent = async (eventData) => {
  const eventsRef = collection(db, "events");
  await addDoc(eventsRef, eventData);
};
export const updateClub = async (clubId, updatedData) => {
  const clubRef = doc(db, "clubs", clubId);
  await updateDoc(clubRef, updatedData);
};

export { db };
