 
import React, { useState } from "react";

function UploadEventForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Event "${title}" uploaded!`);
    // Here you can call API to save event data to backend
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
      <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="file" onChange={(e) => setPhoto(e.target.files[0])} required />
      <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "8px" }}>Upload Event</button>
    </form>
  );
}

export default UploadEventForm;
