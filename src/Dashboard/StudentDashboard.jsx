// StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";

function StudentDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load events from backend or local JSON
    setEvents([
      { id: 1, title: "Photography Club Meetup", date: "2025-11-15" },
      { id: 2, title: "Tech Talk", date: "2025-11-20" }
    ]);
  }, []);

  const handleRegister = (eventId) => {
    alert(`Registered for event ID ${eventId}`);
    // here you can call API to save registration
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome Student</h1>
      <h2>Upcoming Events</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            showRegister 
            onRegister={() => handleRegister(event.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
