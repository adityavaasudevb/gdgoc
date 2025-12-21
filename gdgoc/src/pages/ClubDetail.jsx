import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClubs, getEvents } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";
import { useAuth } from "../context/AuthContext";
import CreateEventForm from "../components/CreateEventForm";
import EditClubForm from "../components/EditClubForm";

export default function ClubDetail() {
  const { clubId } = useParams();
  const { user } = useAuth();

  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const clubs = await getClubs();
      const foundClub = clubs.find(c => c.id === clubId);

      if (!foundClub) return;

      setClub(foundClub);

      // ✅ ADMIN CHECK
      if (user && foundClub.adminEmails?.includes(user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      const allEvents = await getEvents();
      const upcoming = allEvents.filter(
        e =>
          e.club.toLowerCase() === foundClub.name.toLowerCase() &&
          isFutureEvent(e.date)
      );

      setEvents(upcoming);
    };

    fetchData();
  }, [clubId, user]);

  if (!club) {
    return <p>Club not found.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>{club.name}</h2>
      <p><strong>Category:</strong> {club.category}</p>
      <p>{club.description}</p>

      {/* 🔒 ADMIN CONTROLS */}
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

      {events.length === 0 && (
        <p>No upcoming events for this club.</p>
      )}

      {events.map(event => (
        <div
          key={event.id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            margin: "10px 0",
            borderRadius: "8px",
          }}
        >
          <h4>{event.title}</h4>
          <p>{event.description}</p>
          <small>{event.date}</small>
          <br /><br />
          <button
            onClick={() => window.open(event.registrationLink, "_blank")}
          >
            Register
          </button>
        </div>
      ))}
    </div>
  );
}
