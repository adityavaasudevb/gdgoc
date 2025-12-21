import { useEffect, useState } from "react";
import { getClubs, getUserBookmarks, toggleBookmark } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();

  // Fetch clubs
  useEffect(() => {
    const fetchClubs = async () => {
      const data = await getClubs();
      setClubs(data);
    };
    fetchClubs();
  }, []);

  // Fetch user's bookmarks (ONLY when user exists)
  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      const data = await getUserBookmarks(user.uid);
      setBookmarks(data);
    };

    fetchBookmarks();
  }, [user]);

  // Toggle bookmark using club.id (NOT name)
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
      {clubs.length === 0 && <p>No clubs found</p>}

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
          <h3>
            <Link to={`/clubs/${club.id}`}>{club.name}</Link>
          </h3>

          <p>{club.description}</p>
          <small>{club.category}</small>
          <br /><br />

          <button onClick={() => handleBookmark(club.id)}>
            {bookmarks.includes(club.id) ? "Bookmarked ⭐" : "Bookmark"}
          </button>
        </div>
      ))}
    </div>
  );
}
