import { useEffect, useState } from "react";

export default function MarketEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // données simulées (plus tard API Spring Boot)
    setEvents([
      {
        id: 1,
        title: "Inflation US Report",
        description: "Augmentation de l'inflation",
        date: "2026-04-01",
        impact: "high"
      },
      {
        id: 2,
        title: "Oil Price Drop",
        description: "Baisse du pétrole",
        date: "2026-04-02",
        impact: "medium"
      }
    ]);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 Market Events</h1>

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>📅 {event.date}</p>
          <p>⚡ Impact: {event.impact}</p>
        </div>
      ))}
    </div>
  );
}