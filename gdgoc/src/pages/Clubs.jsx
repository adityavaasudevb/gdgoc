import { useEffect, useState } from "react";
import { getClubs, getUserBookmarks, toggleBookmark } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

/*
  Public page:
  - Lists all clubs
  - Shows logo + description
  - Allows logged-in users to bookmark clubs
*/

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();

  // Fetch all clubs from Firestore
  useEffect(() => {
    const fetchClubs = async () => {
      const data = await getClubs();
      setClubs(data);
    };
    fetchClubs();
  }, []);

  // Fetch logged-in user's bookmarks
  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      const data = await getUserBookmarks(user.uid);
      setBookmarks(data);
    };

    fetchBookmarks();
  }, [user]);

  // Add or remove bookmark (clubId-based)
  const handleBookmark = async (clubId) => {
    const isBookmarked = bookmarks.includes(clubId);

    await toggleBookmark(user.uid, clubId, isBookmarked);

    setBookmarks((prev) =>
      isBookmarked
        ? prev.filter((id) => id !== clubId)
        : [...prev, clubId]
    );
  };

  return (
    <div>
      <h2>Clubs</h2>

      {clubs.map((club) => (
        <div
          key={club.id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            margin: "12px 0",
            borderRadius: "8px",
          }}
        >
          {/* Club logo (if uploaded) */}
          {club.logoUrl && (
            <img
              src={club.logoUrl}
              alt={club.name}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          )}

          {/* Navigate to club detail page */}
          <h3>
            <Link to={`/clubs/${club.id}`}>{club.name}</Link>
          </h3>

          <p>{club.description}</p>
          <small>{club.category}</small>
          <br /><br />

          {/* Bookmark toggle */}
          {user && (
            <button onClick={() => handleBookmark(club.id)}>
              {bookmarks.includes(club.id) ? "Bookmarked ⭐" : "Bookmark"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
