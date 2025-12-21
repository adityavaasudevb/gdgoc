import { useEffect, useState } from "react";
import { getEvents } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";
import { getGoogleCalendarUrl } from "../utils/calendarUtils";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(event =>
    isFutureEvent(event.date)
  );

  return (
    <div>
      <h2>Upcoming Events</h2>

      {upcomingEvents.length === 0 && (
        <p>No upcoming events right now.</p>
      )}

      {upcomingEvents.map(event => (
        <div
          key={event.id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            margin: "12px 0",
            borderRadius: "8px",
          }}
        >
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <small>{event.club} | {event.date}</small>
          <br /><br />

          <button
            onClick={() => window.open(event.registrationLink, "_blank")}
          >
            Open Registration Form
          </button>

          <button
            style={{ marginLeft: "10px" }}
            onClick={() =>
              window.open(
                getGoogleCalendarUrl({
                  title: event.title,
                  description: event.description,
                  date: event.date,
                }),
                "_blank"
              )
            }
          >
            Add to Google Calendar
          </button>
        </div>
      ))}
    </div>
  );
}
