import { useEffect, useState } from "react";
import { getEvents, getClubs, db } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookmarkedClubs, setBookmarkedClubs] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const allEvents = await getEvents();
      const upcoming = allEvents
        .filter((e) => isFutureEvent(e.date))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

      setEvents(upcoming);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const bookmarks = userDoc.exists()
        ? userDoc.data().bookmarks || []
        : [];

      const clubs = await getClubs();
      setBookmarkedClubs(clubs.filter((c) => bookmarks.includes(c.id)));
    };

    fetchData();
  }, [user]);

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>GRIET Hub</h1>
        <p>Your central system for clubs, events, and campus activity</p>
      </div>

      {/* CONTENT */}
      <div className="dashboard-container">
        {/* UPCOMING EVENTS */}
        <section className="section">
          <h2>Upcoming Events</h2>

          <div className="card-grid">
            {events.map((event) => (
              <div key={event.id} className="card">
                <h3>{event.title}</h3>
                <p className="muted">{event.description}</p>
                <p className="meta">
                  {event.club} · {event.date}
                </p>
                <button
                  onClick={() =>
                    window.open(event.registrationLink, "_blank")
                  }
                  className="primary-btn"
                >
                  Register
                </button>
              </div>
            ))}

            {events.length === 0 && (
              <p className="muted">No upcoming events.</p>
            )}
          </div>
        </section>

        {/* BOOKMARKED CLUBS */}
        <section className="section">
          <h2>Your Bookmarked Clubs</h2>

          <div className="card-grid">
            {bookmarkedClubs.map((club) => (
              <div key={club.id} className="card">
                <h3>{club.name}</h3>
                <p className="muted">{club.category}</p>
                <Link to={`/clubs/${club.id}`} className="primary-btn">
                  View Club
                </Link>
              </div>
            ))}

            {bookmarkedClubs.length === 0 && (
              <p className="muted">
                You haven’t bookmarked any clubs yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
