import { useEffect, useState } from "react";
import { getEvents } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";
import "./PastEvents.css";

export default function PastEvents() {
  const [groupedEvents, setGroupedEvents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const events = await getEvents();

      const pastEvents = events
        .filter(e => e.date && !isFutureEvent(e.date))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const grouped = {};
      pastEvents.forEach(evt => {
        if (!grouped[evt.club]) grouped[evt.club] = [];
        grouped[evt.club].push(evt);
      });

      setGroupedEvents(grouped);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="past-page">Loading past events…</div>;
  }

  return (
    <div className="past-page">
      <div className="past-container">
        <h2 className="past-title">Past Events</h2>

        {Object.entries(groupedEvents).map(([club, events]) => (
          <section key={club} className="past-club">
            <h3 className="club-name">{club}</h3>

            {/* 🔴 FORCE GRID HERE */}
            <div className="event-grid">
              {events.map(evt => (
                <div key={evt.id} className="event-card">

                  {evt.imageUrl && (
                    <div className="event-image-wrapper">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="event-image"
                      />
                    </div>
                  )}

                  <div className="event-info">
                    <h4>{evt.title}</h4>

                    <p className="event-summary">
                      {evt.experience || "A memorable campus experience"}
                    </p>

                    <div className="event-rating">⭐⭐⭐⭐☆</div>

                    <p className="event-description">
                      {evt.description ||
                        "This event brought together students, creativity, and collaboration in a memorable way."}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
