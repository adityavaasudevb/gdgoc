import { useState } from "react";
import { getClubs, getEvents } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";

/*
  Campus Assistant
  - Deterministic
  - Firestore-backed
  - Rule-based (no hallucinations)
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
      /* ===== DIRECT CLUB NAME MATCH (MOST IMPORTANT) ===== */

const clubByName = clubs.find((c) =>
  question.includes(c.name.toLowerCase())
);

if (clubByName) {
  setMessages((p) => [
    ...p,
    {
      from: "bot",
      text: `${clubByName.name}: ${clubByName.description}`,
    },
  ]);
  return;
}


      /* ================= CLUB QUERIES ================= */

      if (question.includes("club")) {
        if (question.includes("all")) {
          setMessages((p) => [
            ...p,
            {
              from: "bot",
              text:
                "Clubs on campus:\n" +
                clubs.map((c) => `• ${c.name}`).join("\n"),
            },
          ]);
          return;
        }

        if (question.includes("non") && question.includes("tech")) {
          const nonTech = clubs.filter(
            (c) => c.category?.toLowerCase().trim() === "non-technical"
          );

          setMessages((p) => [
            ...p,
            {
              from: "bot",
              text:
                nonTech.length === 0
                  ? "No non-technical clubs found."
                  : "Non-technical clubs:\n" +
                    nonTech.map((c) => `• ${c.name}`).join("\n"),
            },
          ]);
          return;
        }

        if (question.includes("tech") && !question.includes("non")) {
          const tech = clubs.filter(
            (c) => c.category?.toLowerCase().trim() === "technical"
          );

          setMessages((p) => [
            ...p,
            {
              from: "bot",
              text:
                tech.length === 0
                  ? "No technical clubs found."
                  : "Technical clubs:\n" +
                    tech.map((c) => `• ${c.name}`).join("\n"),
            },
          ]);
          return;
        }

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

      /* ================= EVENT QUERIES ================= */

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // TODAY
      if (question.includes("today")) {
        const todayEvents = events.filter((e) => e.date === todayStr);

        setMessages((p) => [
          ...p,
          {
            from: "bot",
            text:
              todayEvents.length === 0
                ? "No events today."
                : "Events today:\n" +
                  todayEvents
                    .map((e) => `• ${e.title} (${e.club})`)
                    .join("\n"),
          },
        ]);
        return;
      }

      // TOMORROW
      if (question.includes("tomorrow")) {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const date = t.toISOString().split("T")[0];

        const matches = events.filter((e) => e.date === date);

        setMessages((p) => [
          ...p,
          {
            from: "bot",
            text:
              matches.length === 0
                ? "No events tomorrow."
                : "Events tomorrow:\n" +
                  matches
                    .map((e) => `• ${e.title} (${e.club})`)
                    .join("\n"),
          },
        ]);
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

        setMessages((p) => [
          ...p,
          {
            from: "bot",
            text:
              weekEvents.length === 0
                ? "No events scheduled."
                : "Upcoming events:\n" +
                  weekEvents
                    .map((e) => `• ${e.title} (${e.club})`)
                    .join("\n"),
          },
        ]);
        return;
      }

      // GENERAL UPCOMING EVENTS (LAST)
      if (question.includes("event")) {
        const upcoming = events.filter((e) => isFutureEvent(e.date));

        setMessages((p) => [
          ...p,
          {
            from: "bot",
            text:
              upcoming.length === 0
                ? "No upcoming events."
                : "Upcoming events:\n" +
                  upcoming
                    .map((e) => `• ${e.title} (${e.club})`)
                    .join("\n"),
          },
        ]);
        return;
      }

      /* ================= FALLBACK ================= */

      setMessages((p) => [
        ...p,
        {
          from: "bot",
          text:
            "I can help with clubs and events. Try asking about events today, this week, or clubs.",
        },
      ]);
    } catch {
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
      {/* Floating Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          fontSize: "24px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        🤖
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            zIndex: 9999,
            width: "320px",
            height: "420px",
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              fontWeight: 700,
              background: "#f1f5f9",
              borderBottom: "1px solid #ddd",
            }}
          >
            Campus Assistant
          </div>

          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              fontSize: "14px",
              color: "#111827",
            }}
          >
            {messages.map((m, i) => (
              <p key={i} style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#2563eb" }}>
                  {m.from === "user" ? "You" : "Bot"}:
                </strong>{" "}
                {m.text}
              </p>
            ))}
            {loading && <em>Thinking…</em>}
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              style={{
                flex: 1,
                padding: "8px",
                border: "none",
                outline: "none",
                color: "#111827",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "8px 14px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                cursor: "pointer",
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
