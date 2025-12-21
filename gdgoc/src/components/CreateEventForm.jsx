import { useState } from "react";
import { addEvent } from "../firebase/firestore";

export default function CreateEventForm({ clubName, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !registrationLink) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await addEvent({
        title,
        description,
        date,
        club: clubName,
        registrationLink,
      });

      alert("Event created successfully!");

      setTitle("");
      setDescription("");
      setDate("");
      setRegistrationLink("");

      onCreated(); // refresh events list
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

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
