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
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import app from "./firebaseConfig";

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

export const addEvent = async (eventData) => {
  const eventsRef = collection(db, "events");
  const docRef = await addDoc(eventsRef, eventData);
  return docRef; // 🔑 IMPORTANT
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

// -------------------- Clubs (Admin) --------------------
export const updateClub = async (clubId, updatedData) => {
  const clubRef = doc(db, "clubs", clubId);
  await updateDoc(clubRef, updatedData);
};

export const updateClubLogo = async (clubId, logoUrl) => {
  const clubRef = doc(db, "clubs", clubId);
  await updateDoc(clubRef, { logoUrl });
};


// -------------------- Notifications --------------------
export const createNotification = async (userId, message) => {
  await addDoc(collection(db, "notifications"), {
    userId,
    message,
    createdAt: new Date(),
    read: false,
  });
};

export const getUserNotifications = async (userId) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

// Save event image URL
export const updateEventImage = async (eventId, imageUrl) => {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, { imageUrl });
};
// Delete event document
export const deleteEvent = async (eventId) => {
  const eventRef = doc(db, "events", eventId);
  await deleteDoc(eventRef);
};

export { db };
