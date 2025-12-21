import { useState } from "react";
import { getClubs, getEvents } from "../firebase/firestore";
import { isTomorrowEvent, isFutureEvent } from "../utils/dateUtils";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me about clubs, events, or campus life 👋" }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    const reply = await getBotReply(input);
    setMessages(prev => [...prev, { from: "bot", text: reply }]);

    setInput("");
  };

  const getBotReply = async (query) => {
    const q = query.toLowerCase();

    // ---------- TOMORROW EVENTS ----------
    if (q.includes("tomorrow")) {
      const events = await getEvents();
      const tomorrowEvents = events.filter(e =>
        isTomorrowEvent(e.date)
      );

      if (tomorrowEvents.length === 0) {
        return "No events are happening tomorrow.";
      }

      return (
        "Events happening tomorrow:\n" +
        tomorrowEvents.map(e => `• ${e.title} (${e.club})`).join("\n")
      );
    }

    // ---------- UPCOMING EVENTS ----------
    if (q.includes("event")) {
      const events = await getEvents();
      const upcomingEvents = events.filter(e =>
        isFutureEvent(e.date)
      );

      if (upcomingEvents.length === 0) {
        return "No upcoming events right now.";
      }

      return (
        "Upcoming events:\n" +
        upcomingEvents.map(e => `• ${e.title} (${e.club})`).join("\n")
      );
    }

    // ---------- CLUB LIST ----------
    if (q.includes("club")) {
      const clubs = await getClubs();
      return (
        "Here are some clubs on campus:\n" +
        clubs.map(c => `• ${c.name}`).join("\n")
      );
    }

    // ---------- GENERAL CAMPUS QUESTIONS ----------
    if (q.includes("hackathon") || q.includes("techsprint")) {
      return "TechSprint is an open-innovation hackathon hosted by GDGOC GRIET, encouraging students to solve real campus problems using Google technologies.";
    }

    if (q.includes("join") || q.includes("recruitment")) {
      return "You can bookmark clubs you're interested in. When recruitment opens, you’ll get notified inside the platform.";
    }

    // ---------- DEFAULT ----------
    return "I can help you find clubs, events, or campus info. Try asking about events or a specific club!";
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Campus Assistant 🤖</h2>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "12px",
          minHeight: "300px",
          marginBottom: "10px"
        }}
      >
        {messages.map((m, i) => (
          <p
            key={i}
            style={{
              textAlign: m.from === "user" ? "right" : "left"
            }}
          >
            <strong>{m.from === "user" ? "You" : "Bot"}:</strong> {m.text}
          </p>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
