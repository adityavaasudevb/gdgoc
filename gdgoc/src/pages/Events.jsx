import { useEffect, useState } from "react";
import { getEvents, registerForEvent } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Events() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    await registerForEvent(eventId, user.email);
    alert("Registered successfully!");
  };

  return (
    <div>
      <h2>Events</h2>

      {events.map(event => (
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
          <button onClick={() => handleRegister(event.id)}>
            Register
          </button>
        </div>
      ))}
    </div>
  );
}
