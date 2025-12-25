import { useState } from "react";
import {
  addEvent,
  createNotification,
  updateEventImage,
  db
} from "../firebase/firestore";
import { uploadEventImage } from "../firebase/storage";
import { getDocs, collection } from "firebase/firestore";

/*
  Admin-only component.
  Creates an event and optionally uploads a single event image.
*/

export default function CreateEventForm({ clubId, clubName, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !registrationLink) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create event WITHOUT image first
      const eventRef = await addEvent({
        title,
        description,
        date,
        club: clubName,
        registrationLink, // ✅ ALWAYS stored
      });

      // 2️⃣ Upload event image (optional)
      if (imageFile) {
        const imageUrl = await uploadEventImage(eventRef.id, imageFile);
        await updateEventImage(eventRef.id, imageUrl);
      }

      // 3️⃣ Notify users who bookmarked this club
      const usersSnapshot = await getDocs(collection(db, "users"));

      usersSnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();

        if (userData.bookmarks?.includes(clubId)) {
          await createNotification(
            userDoc.id,
            `New event from ${clubName}: ${title}`
          );
        }
      });

      alert("Event created successfully!");
      onCreated();

    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        borderRadius: "6px",
        marginTop: "10px",
      }}
    >
      <h4>Create Event</h4>

      <input
        type="text"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <textarea
        placeholder="Event description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <input
        type="url"
        placeholder="Google Form link"
        value={registrationLink}
        onChange={(e) => setRegistrationLink(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      {/* Event image upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={{ marginBottom: "8px" }}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
