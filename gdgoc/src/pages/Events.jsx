import { useEffect, useState } from "react";
import { getEvents } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";
import { getGoogleCalendarUrl } from "../utils/calendarUtils";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      const data = await getEvents();

      const upcomingSorted = data
        .filter(e => isFutureEvent(e.date))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(upcomingSorted);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <div className="events-container">

        <h2 className="events-title">Upcoming Events</h2>

        {/* ✅ LOADING STATE */}
        {loading && (
          <p className="events-state">Loading events...</p>
        )}

        {/* ✅ EMPTY STATE (AFTER LOADING) */}
        {!loading && events.length === 0 && (
          <p className="events-state">
            No upcoming events right now.
          </p>
        )}

        {/* ✅ EVENTS */}
        {!loading && events.map(event => (
          <div key={event.id} className="event-card fade-in">

            {event.imageUrl && (
              <div className="event-image-wrapper">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="event-image"
                />
              </div>
            )}

            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>

            <small className="event-meta">
              {event.club} • {event.date}
            </small>

            <div className="event-actions">
              <button
                className="btn btn-primary"
                onClick={() =>
                  window.open(event.registrationLink, "_blank")
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

          </div>
        ))}

      </div>
    </div>
  );
}
