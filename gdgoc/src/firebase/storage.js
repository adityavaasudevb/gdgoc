import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./firebaseConfig";
import { deleteObject } from "firebase/storage";
const storage = getStorage(app);

// Upload club logo
export const uploadClubLogo = async (clubId, file) => {
  const logoRef = ref(storage, `club-logos/${clubId}`);

  await uploadBytes(logoRef, file);
  const url = await getDownloadURL(logoRef);

  return url;
};

// Upload event image
export const uploadEventImage = async (eventId, file) => {
  const imageRef = ref(storage, `event-images/${eventId}`);

  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);

  return url;
};



// Delete event image (if exists)
export const deleteEventImage = async (eventId) => {
  const imageRef = ref(storage, `event-images/${eventId}`);
  await deleteObject(imageRef);
};

