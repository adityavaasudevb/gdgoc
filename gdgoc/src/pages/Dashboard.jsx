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
      {/* HERO HEADER */}
      <div className="dashboard-header">
        <h1>GRIET HUB</h1>
        <p>Your central system for clubs, events, and campus activity</p>

        {/* CTA BUTTONS */}
        <div className="dashboard-cta">
          <Link to="/events" className="cta-btn primary">
            Explore Events
          </Link>
          <Link to="/clubs" className="cta-btn secondary">
            Browse Clubs
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-container">
        {/* UPCOMING EVENTS */}
        <section className="section">
          <h2>Upcoming Events</h2>

          <div className="card-grid">
            {events.map((event) => (
              <div key={event.id} className="card event-card">
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <p className="muted">{event.description}</p>
                  <p className="meta">
                    {event.club} · {event.date}
                  </p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() =>
                    window.open(event.registrationLink, "_blank")
                  }
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
                <h3 className="card-title">
                  <Link
                    to={`/clubs/${club.id}`}
                    className="card-link"
                  >
                    {club.name}
                  </Link>
                </h3>
                <p className="muted">{club.category}</p>
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
