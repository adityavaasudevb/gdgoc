import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClubs, getEvents, deleteEvent } from "../firebase/firestore";
import { deleteEventImage } from "../firebase/storage";
import { isFutureEvent } from "../utils/dateUtils";
import { getGoogleCalendarUrl } from "../utils/calendarUtils"; // ✅ ADD THIS
import { useAuth } from "../context/AuthContext";
import CreateEventForm from "../components/CreateEventForm";
import EditClubForm from "../components/EditClubForm";

/*
  Club detail page:
  - Shows club info
  - Shows upcoming events (sorted by date)
  - Shows admin controls ONLY to club admins
  - Allows admins to DELETE events
*/

export default function ClubDetail() {
  const { clubId } = useParams();
  const { user } = useAuth();

  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1️⃣ Fetch club
      const clubs = await getClubs();
      const foundClub = clubs.find(c => c.id === clubId);
      if (!foundClub) return;

      setClub(foundClub);

      // 2️⃣ Admin check
      if (user && foundClub.adminEmails?.includes(user.email)) {
        setIsAdmin(true);
      }

      // 3️⃣ Fetch all events
      const allEvents = await getEvents();

      // 4️⃣ Filter + sort upcoming events
      const upcoming = allEvents
        .filter(
          e =>
            e.club.toLowerCase() === foundClub.name.toLowerCase() &&
            isFutureEvent(e.date)
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(upcoming);
    };

    fetchData();
  }, [clubId, user]);

  // 🗑️ Delete event (admin only)
  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      try {
        await deleteEventImage(eventId);
      } catch {
        console.warn("No event image to delete");
      }

      await deleteEvent(eventId);
      alert("Event deleted successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  if (!club) return <p>Club not found.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>{club.name}</h2>

      {club.logoUrl && (
        <img
          src={club.logoUrl}
          alt={club.name}
          style={{ width: "120px", marginBottom: "10px" }}
        />
      )}

      <p><strong>Category:</strong> {club.category}</p>
      <p>{club.description}</p>

      {/* 🔒 Admin-only controls */}
      {isAdmin && (
        <div
          style={{
            margin: "20px 0",
            padding: "12px",
            border: "1px dashed #aaa",
            borderRadius: "6px",
            background: "#fafafa",
          }}
        >
          <strong>Admin Controls</strong>

          <CreateEventForm
            clubId={club.id}
            clubName={club.name}
            onCreated={() => window.location.reload()}
          />

          <EditClubForm
            club={club}
            onUpdated={() => window.location.reload()}
          />
        </div>
      )}

      <hr />

      <h3>Upcoming Events</h3>

      {events.length === 0 && <p>No upcoming events for this club.</p>}

      {events.map(event => {
        const prettyDate = new Date(event.date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, " · ");

        return (
          <div
            key={event.id}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "8px",
                }}
              />
            )}

            <h4>{event.title}</h4>
            <p>{event.description}</p>
            <small>{prettyDate}</small>
            <br /><br />

            {/* Register */}
            <button
              onClick={() => window.open(event.registrationLink, "_blank")}
            >
              Register
            </button>

            {/* 📅 Save to Calendar */}
            <button
              style={{ marginLeft: "8px" }}
              onClick={() =>
                window.open(getGoogleCalendarUrl(event), "_blank")
              }
            >
              Save to Calendar
            </button>

            {/* 🗑️ Delete (admin only) */}
            {isAdmin && (
              <>
                <br />
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  style={{
                    marginTop: "8px",
                    background: "#ffe5e5",
                    border: "1px solid #ff4d4d",
                    color: "#b30000",
                  }}
                >
                  Delete Event
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
