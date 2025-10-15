 
import React from "react";

function EventCard({ event, showRegister, onRegister }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", width: "250px" }}>
      <h3>{event.title}</h3>
      <p>Date: {event.date}</p>
      {showRegister && <button onClick={onRegister} style={{ padding: "8px", marginTop: "10px" }}>Register</button>}
    </div>
  );
}

export default EventCard;
