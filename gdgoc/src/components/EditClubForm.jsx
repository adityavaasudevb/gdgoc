import { useState } from "react";
import { updateClub } from "../firebase/firestore";
import { uploadClubLogo } from "../firebase/storage";
import { updateClubLogo } from "../firebase/firestore";

/*
  This component is visible ONLY to club admins.
  It allows:
  1) Editing club text info (description, category)
  2) Uploading / replacing the club logo
*/

export default function EditClubForm({ club, onUpdated }) {
  // Text fields
  const [description, setDescription] = useState(club.description || "");
  const [category, setCategory] = useState(club.category || "");

  // Logo upload
  const [logoFile, setLogoFile] = useState(null);

  // UI states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Save text info (Firestore only)
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
      onUpdated(); // refresh UI
    } catch (err) {
      console.error(err);
      alert("Failed to update club");
    } finally {
      setLoading(false);
    }
  };

  // Upload logo → Storage → save URL in Firestore
  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setUploading(true);

    try {
      // 1️⃣ Upload image to Firebase Storage
      const logoUrl = await uploadClubLogo(club.id, logoFile);

      // 2️⃣ Save image URL in Firestore
      await updateClubLogo(club.id, logoUrl);

      alert("Logo uploaded successfully!");
      onUpdated(); // reload club data
    } catch (err) {
      console.error(err);
      alert("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        borderRadius: "6px",
        marginTop: "10px",
      }}
    >
      {/* ---- Edit text info ---- */}
      <form onSubmit={handleSubmit}>
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

      <hr />

      {/* ---- Logo upload ---- */}
      <h4>Club Logo</h4>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleLogoUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Logo"}
      </button>
    </div>
  );
}
