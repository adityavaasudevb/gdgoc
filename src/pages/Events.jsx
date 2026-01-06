import { useEffect, useState } from "react";
import { getEvents } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";
import { getGoogleCalendarUrl } from "../utils/calendarUtils"; // ✅ ADD THIS

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();

      // ✅ sort upcoming by date (earliest first)
      const upcomingSorted = data
        .filter(e => isFutureEvent(e.date))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(upcomingSorted);
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Upcoming Events</h2>

      {events.length === 0 && <p>No upcoming events right now.</p>}

      {events.map(event => (
        <div
          key={event.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            margin: "12px 0",
            borderRadius: 8,
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

          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <small>{event.club} | {event.date}</small>
          <br /><br />

          {/* Registration */}
          <button onClick={() => window.open(event.registrationLink, "_blank")}>
            Open Registration Form
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
        </div>
      ))}
    </div>
  );
}
