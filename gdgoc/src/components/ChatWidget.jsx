import { useState } from "react";
import { getClubs, getEvents } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";

/*
  Campus Assistant
  - Fully deterministic
  - No hallucinations
  - Uses Firestore data only
*/

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me about clubs or events on campus 👋" },
  ]);
  const [loading, setLoading] = useState(false);

  const normalize = (text) =>
    text.toLowerCase().replace(/[^\w\s]/g, "").trim();

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = normalize(input);
    setMessages((p) => [...p, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const clubs = await getClubs();
      const events = await getEvents();

      /* ================= CLUB QUESTIONS ================= */

      if (question.includes("club")) {
        // ALL CLUBS
        if (question.includes("all")) {
          const reply =
            "Clubs on campus:\n" +
            clubs.map((c) => `• ${c.name}`).join("\n");
          setMessages((p) => [...p, { from: "bot", text: reply }]);
          return;
        }

        // NON-TECHNICAL CLUBS (MUST COME FIRST)
        if (question.includes("non") && question.includes("tech")) {
          const nonTech = clubs.filter(
            (c) =>
              c.category &&
              c.category.toLowerCase().trim() === "non-technical"
          );

          const reply =
            nonTech.length === 0
              ? "No non-technical clubs found."
              : "Non-technical clubs:\n" +
                nonTech.map((c) => `• ${c.name}`).join("\n");

          setMessages((p) => [...p, { from: "bot", text: reply }]);
          return;
        }

        // TECHNICAL CLUBS
        if (question.includes("tech") && !question.includes("non")) {
          const tech = clubs.filter(
            (c) =>
              c.category &&
              c.category.toLowerCase().trim() === "technical"
          );

          const reply =
            tech.length === 0
              ? "No technical clubs found."
              : "Technical clubs:\n" +
                tech.map((c) => `• ${c.name}`).join("\n");

          setMessages((p) => [...p, { from: "bot", text: reply }]);
          return;
        }

        // ABOUT A CLUB
        const club = clubs.find((c) =>
          question.includes(c.name.toLowerCase())
        );

        if (club) {
          setMessages((p) => [
            ...p,
            { from: "bot", text: `${club.name}: ${club.description}` },
          ]);
          return;
        }
      }

      /* ================= EVENT QUESTIONS ================= */

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // TODAY
      if (question.includes("today")) {
        const todayEvents = events.filter((e) => e.date === todayStr);

        const reply =
          todayEvents.length === 0
            ? "No events today."
            : "Events today:\n" +
              todayEvents.map((e) => `• ${e.title} (${e.club})`).join("\n");

        setMessages((p) => [...p, { from: "bot", text: reply }]);
        return;
      }

      // TOMORROW
      if (question.includes("tomorrow")) {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const date = t.toISOString().split("T")[0];

        const matches = events.filter((e) => e.date === date);

        const reply =
          matches.length === 0
            ? "No events tomorrow."
            : "Events tomorrow:\n" +
              matches.map((e) => `• ${e.title} (${e.club})`).join("\n");

        setMessages((p) => [...p, { from: "bot", text: reply }]);
        return;
      }

      // THIS WEEK / NEXT WEEK
      if (question.includes("week")) {
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + (question.includes("next") ? 14 : 7));

        const weekEvents = events.filter((e) => {
          const d = new Date(e.date);
          return d >= start && d <= end;
        });

        const reply =
          weekEvents.length === 0
            ? "No events scheduled."
            : "Upcoming events:\n" +
              weekEvents.map((e) => `• ${e.title} (${e.club})`).join("\n");

        setMessages((p) => [...p, { from: "bot", text: reply }]);
        return;
      }

      // GENERAL UPCOMING EVENTS
      if (question.includes("event")) {
        const upcoming = events.filter((e) => isFutureEvent(e.date));

        const reply =
          upcoming.length === 0
            ? "No upcoming events."
            : "Upcoming events:\n" +
              upcoming.map((e) => `• ${e.title} (${e.club})`).join("\n");

        setMessages((p) => [...p, { from: "bot", text: reply }]);
        return;
      }

      // FALLBACK
      setMessages((p) => [
        ...p,
        {
          from: "bot",
          text:
            "I can help with clubs and events. Try asking about clubs or upcoming events.",
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        { from: "bot", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          fontSize: "24px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
        }}
      >
        🤖
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "10px", fontWeight: "bold" }}>
            Campus Assistant
          </div>

          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {messages.map((m, i) => (
              <p key={i}>
                <strong>{m.from === "user" ? "You" : "Bot"}:</strong> {m.text}
              </p>
            ))}
            {loading && <em>Thinking…</em>}
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              style={{ flex: 1, padding: "8px", border: "none" }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "8px 12px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}