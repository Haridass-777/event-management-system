import React from "react";

function AnnouncementCard({ announcement }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px", width: "300px" }}>
      <h3>{announcement.title}</h3>
      <p>{announcement.description}</p>
      <p>Date: {announcement.date}</p>
      {announcement.poster && <img src={announcement.poster} alt="Poster" style={{ maxWidth: "100%" }} />}
    </div>
  );
}

export default AnnouncementCard;
