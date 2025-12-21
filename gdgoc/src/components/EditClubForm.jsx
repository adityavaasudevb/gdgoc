import { useState } from "react";
import { updateClub } from "../firebase/firestore";

export default function EditClubForm({ club, onUpdated }) {
  const [description, setDescription] = useState(club.description || "");
  const [category, setCategory] = useState(club.category || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !category) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await updateClub(club.id, {
        description,
        category,
      });

      alert("Club updated successfully!");
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to update club");
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
      <h4>Edit Club Info</h4>

      <textarea
        placeholder="Club description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
