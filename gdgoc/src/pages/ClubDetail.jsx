import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClubs, getEvents, deleteEvent } from "../firebase/firestore";
import { deleteEventImage } from "../firebase/storage";
import { isFutureEvent } from "../utils/dateUtils";
import { getGoogleCalendarUrl } from "../utils/calendarUtils";
import { useAuth } from "../context/AuthContext";
import CreateEventForm from "../components/CreateEventForm";
import EditClubForm from "../components/EditClubForm";
import "./ClubDetail.css";

export default function ClubDetail() {
  const { clubId } = useParams();
  const { user } = useAuth();

  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const clubs = await getClubs();
      const foundClub = clubs.find(c => c.id === clubId);

      if (!foundClub) {
        setClub(null);
        setLoading(false);
        return;
      }

      setClub(foundClub);

      if (user && foundClub.adminEmails?.includes(user.email)) {
        setIsAdmin(true);
      }

      const allEvents = await getEvents();

      // ✅ clubId-based filtering (with backward compatibility)
      const upcoming = allEvents
        .filter(e => {
          if (e.clubId) {
            return e.clubId === foundClub.id && isFutureEvent(e.date);
          }
          if (e.club) {
            return (
              e.club.toLowerCase().trim() ===
                foundClub.name.toLowerCase().trim() &&
              isFutureEvent(e.date)
            );
          }
          return false;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(upcoming);
      setLoading(false);
    };

    fetchData();
  }, [clubId, user]);

  /* ================= SCROLL FADE-IN ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".fade-in").forEach(el =>
      observer.observe(el)
    );

    return () => observer.disconnect();
  }, [events]);

  /* ================= DELETE EVENT ================= */
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await deleteEventImage(eventId);
      await deleteEvent(eventId);
      window.location.reload();
    } catch {
      alert("Failed to delete event");
    }
  };

  /* ================= STATES ================= */
  if (loading) return <p className="club-meta">Loading...</p>;
  if (!club) return <p className="club-meta">Club not found.</p>;

  /* ================= UI ================= */
  return (
    <div className="page-root">
      <div className="club-page">

        {/* ===== HEADER ===== */}
        <div className="header">
          <h2 className="club-title">{club.name}</h2>
          <p className="club-meta">
            <strong>Category:</strong> {club.category}
          </p>
          <p className="club-meta">{club.description}</p>
        </div>

        {/* ===== ADMIN CONTROLS ===== */}
        {isAdmin && (
          <div className="admin-box fade-in">
            <strong>Admin Controls</strong>
            <CreateEventForm clubId={club.id} clubName={club.name} />
            <EditClubForm club={club} />
          </div>
        )}

        {/* ===== EVENTS ===== */}
        <h3 className="section-title">Upcoming Events</h3>

        {events.length === 0 && (
          <p className="club-meta">No upcoming events for this club.</p>
        )}

        {events.map(event => (
          <div key={event.id} className="fade-in">
            <div className="event-card">

              {event.imageUrl && (
                <div className="event-image-wrapper">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="event-image"
                  />
                </div>
              )}

              <h4>{event.title}</h4>
              <p className="club-meta">{event.description}</p>

              <div style={{ marginTop: "1.2rem" }}>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    event.registrationLink
                      ? window.open(event.registrationLink, "_blank")
                      : alert("Registration link not available")
                  }
                >
                  Register
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    window.open(getGoogleCalendarUrl(event), "_blank")
                  }
                >
                  Save to Calendar
                </button>
              </div>

              {isAdmin && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteEvent(event.id)}
                  style={{ marginTop: "1.4rem" }}
                >
                  Delete Event
                </button>
              )}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
