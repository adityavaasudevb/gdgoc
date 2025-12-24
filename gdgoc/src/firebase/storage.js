import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./firebaseConfig";

const storage = getStorage(app);

// Upload club logo
export const uploadClubLogo = async (clubId, file) => {
  const logoRef = ref(storage, `club-logos/${clubId}`);

  await uploadBytes(logoRef, file);
  const url = await getDownloadURL(logoRef);

  return url;
};
