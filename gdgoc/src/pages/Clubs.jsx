import { useEffect, useState } from "react";
import { getClubs, getUserBookmarks, toggleBookmark } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Clubs.css";
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
    <div className="clubs-page">
  <div className="clubs-container">
    <h2 className="clubs-title">Clubs</h2>
    <div className="clubs-grid">
    {clubs.map((club) => (
      <div key={club.id} className="club-card">
        
        <div className="club-header">
          {/* Club logo */}
          {club.logoUrl && (
            <img
              src={club.logoUrl}
              alt={club.name}
              className="club-logo"
            />
          )}

          {/* Club name */}
          <h3 className="club-name">
            <Link to={`/clubs/${club.id}`}>{club.name}</Link>
          </h3>
        </div>

        {/* Description */}
        <p className="club-description">{club.description}</p>

        {/* Category */}
        <div className="club-category">{club.category}</div>

        {/* Bookmark button */}
        {user && (
          <div className="club-actions">
            <button
              className={
                bookmarks.includes(club.id)
                  ? "club-btn club-btn-bookmarked"
                  : "club-btn club-btn-primary"
              }
              onClick={() => handleBookmark(club.id)}
            >
              {bookmarks.includes(club.id) ? "⭐ Bookmarked" : "Bookmark"}
            </button>



          </div>
        )}

      </div>
    ))}
  </div>
  </div>
</div>

  );
}
