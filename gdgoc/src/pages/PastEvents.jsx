import { useEffect, useState } from "react";
import { getEvents, getClubs } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";

export default function PastEvents() {
  const [groupedEvents, setGroupedEvents] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const events = await getEvents();
      const clubs = await getClubs();

      // Past events = not future
      const pastEvents = events.filter(
        (evt) => !isFutureEvent(evt.date)
      );

      // Group by club
      const grouped = {};
      clubs.forEach((club) => {
        grouped[club.name] = [];
      });

      pastEvents.forEach((evt) => {
        if (!grouped[evt.club]) {
          grouped[evt.club] = [];
        }
        grouped[evt.club].push(evt);
      });

      setGroupedEvents(grouped);
    };

    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Past Events</h2>

      {Object.keys(groupedEvents).length === 0 && (
        <p>No past events available.</p>
      )}

      {Object.entries(groupedEvents).map(([clubName, events]) =>
        events.length > 0 ? (
          <div key={clubName} style={{ marginBottom: "20px" }}>
            <h3>{clubName}</h3>

            {events.map((evt) => {
              const formattedDate = new Date(evt.date).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              );

              // Convert "05 Dec 2025" → "05 · Dec · 2025"
              const prettyDate = formattedDate.replace(/ /g, " · ");

              return (
                <div
                  key={evt.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    margin: "8px 0",
                    borderRadius: "6px",
                  }}
                >
                  <strong>{evt.title}</strong>
                  <p>{evt.description}</p>
                  <small>{prettyDate}</small>
                </div>
              );
            })}
          </div>
        ) : null
      )}
    </div>
  );
}
