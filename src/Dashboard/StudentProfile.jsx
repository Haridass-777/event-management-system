 import React from 'react';

export default function StudentProfile({ student, registeredClubs, registeredEvents, onClose }) {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={student.avatar} alt={student.name} className="profile-avatar"/>
        <h1>{student.name}</h1>
        <p>{student.department} | {student.enrollment}</p>
        <p>Contact: {student.contact} | Email: {student.email}</p>
      </div>
      <div className="profile-section">
        <h2>Registered Clubs</h2>
        {registeredClubs.length ? (
          <ul>{registeredClubs.map(c => <li key={c.id}>{c.title}</li>)}</ul>
        ) : (<p>No clubs registered</p>)}
      </div>
      <div className="profile-section">
        <h2>Registered Events</h2>
        {registeredEvents.length ? (
          <ul>{registeredEvents.map(e => <li key={e.id}>{e.title}</li>)}</ul>
        ) : (<p>No events registered</p>)}
      </div>
      <button onClick={onClose} className="browse-btn">Back</button>
    </div>
  );
}
