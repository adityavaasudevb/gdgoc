import { useState } from "react";
import { getClubs, getEvents } from "../firebase/firestore";
import { isFutureEvent } from "../utils/dateUtils";
import { callGemini } from "../utils/gemini";

/*
  Floating Campus Assistant
  - Deterministic answers first
  - Gemini ONLY as fallback
*/

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me about clubs or events on campus 👋" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input.toLowerCase();
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const clubs = await getClubs();
      const events = await getEvents();

      /* ===============================
         1️⃣ WHAT ARE ALL THE CLUBS
      =============================== */
      if (question.includes("all the clubs")) {
        const reply =
          "Clubs on campus:\n" +
          clubs.map((c) => `• ${c.name}`).join("\n");

        setMessages((p) => [...p, { from: "bot", text: reply }]);
        return;
      }

      /* ===============================
         2️⃣ TECHNICAL CLUBS (STRICT MATCH)
      =============================== */
      if (question.includes("technical")) {
        const techClubs = clubs.filter(
          (c) => c.category?.toLowerCase().trim() === "technical"
        );

        const reply =
          techClubs.length === 0
            ? "There are no technical clubs listed right now."
            : "Technical clubs:\n" +
              techClubs.map((c) => `• ${c.name}`).join("\n");

        setMessages((p) => [...p, { from: "bot", text: reply }]);
        return;
      }

      /* ===============================
         3️⃣ TELL ME ABOUT A CLUB
      =============================== */
      const clubMatch = clubs.find((c) =>
        question.includes(c.name.toLowerCase())
      );

      if (
        clubMatch &&
        (question.includes("tell me") ||
          question.includes("about") ||
          question.includes("what is"))
      ) {
        setMessages((p) => [
          ...p,
          {
            from: "bot",
            text: `${clubMatch.name}: ${clubMatch.description}`,
          },
        ]);
        return;
      }

      /* ===============================
         4️⃣ EVENTS IN X DAYS
      =============================== */
      const daysMatch = question.match(/(\d+)\s*days?/);

      if (daysMatch) {
        const days = parseInt(daysMatch[1], 10);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        const target = targetDate.toISOString().split("T")[0];

        const matches = events.filter((e) => e.date === target);

        const reply =
          matches.length === 0
            ? `No events are scheduled in ${days} days.`
            : `Events in ${days} days:\n` +
              matches.map((e) => `• ${e.title} (${e.club})`).join("\n");

        setMessages((p) => [...p, { from: "bot", text: reply }]);
        return;
      }

      /* ===============================
         5️⃣ UPCOMING EVENTS (GENERAL)
      =============================== */
      if (question.includes("event")) {
        const upcoming = events.filter((e) => isFutureEvent(e.date));

        const reply =
          upcoming.length === 0
            ? "No upcoming events right now."
            : "Upcoming events:\n" +
              upcoming.map((e) => `• ${e.title} (${e.club})`).join("\n");

        setMessages((p) => [...p, { from: "bot", text: reply }]);
        return;
      }

      /* ===============================
         6️⃣ GEMINI FALLBACK
      =============================== */
      const context = `
CLUBS:
${clubs.map((c) => `${c.name} | ${c.category}`).join("\n")}

EVENTS:
${events.map((e) => `${e.title} | ${e.date}`).join("\n")}
`;

      const reply = await callGemini(context, input);
      setMessages((p) => [...p, { from: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
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
          cursor: "pointer",
          zIndex: 1000,
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
            zIndex: 1000,
          }}
        >
          <div style={{ padding: "10px", fontWeight: "bold" }}>
            Campus Assistant
          </div>

          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {messages.map((m, i) => (
              <p key={i}>
                <strong>{m.from === "user" ? "You" : "Bot"}:</strong>{" "}
                {m.text}
              </p>
            ))}
            {loading && <p><em>Thinking…</em></p>}
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
