
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
    <>
      {/* HERO */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome to GRIET Hub</h1>
          <p>Your central place for clubs, events, and campus opportunities</p>

          <div className="hero-actions">
            <Link to="/events" className="hero-btn primary">
              Explore Events
            </Link>
            <Link to="/clubs" className="hero-btn secondary">
              Browse Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="dashboard-container">
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

        <section className="section">
          <h2>Your Bookmarked Clubs</h2>

          <div className="card-grid small">
            {bookmarkedClubs.map((club) => (
              <div key={club.id} className="card compact">
                <h3>{club.name}</h3>
                <p className="muted">{club.category}</p>
              </div>
            ))}

            {bookmarkedClubs.length === 0 && (
              <p className="muted">You haven’t bookmarked any clubs yet.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
