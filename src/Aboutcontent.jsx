 import React, { useState, useEffect } from "react";
import "./Acontent.css";

function AboutContent() {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    fetch("http://localhost:5000/clubs")
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((err) => console.error("Error fetching clubs:", err));
  }, []);

  return (
    <section id="about" className="reveal">
      <h1>About Our Clubs</h1>

      {/* Horizontal Scrollable Cards */}
      <div className="club-container">
        {clubs.map((club) => (
          <div className="club-card" key={club.id}>
            <img src={`/assets/${club.image}`} alt={club.name} />
            <h3>{club.name}</h3>
            <p>{club.shortinfo}</p>
            <button onClick={() => setSelectedClub(club)}>View</button>
          </div>
        ))}
      </div>

      {/* Details Panel */}
      {selectedClub && (
        <div className="club-details">
          <h2>{selectedClub.name}</h2>
          <p>{selectedClub.fullinfo}</p>
        </div>
      )}
    </section>
  );
}

export default AboutContent;
