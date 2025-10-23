import React, { useState, useEffect } from "react";
import { CLUBS_CONFIG } from "./clubsConfig";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('announcementRequests') || '[]');
    setRequests(storedRequests);
  }, []);

  const handleApprove = (id) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: 'approved' } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('announcementRequests', JSON.stringify(updatedRequests));

    // Add to announcements
    const approvedRequest = updatedRequests.find(req => req.id === id);
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    announcements.push(approvedRequest);
    localStorage.setItem('announcements', JSON.stringify(announcements));
  };

  const handleReject = (id) => {
    const feedback = feedbacks[id] || '';
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status: 'rejected', feedback } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('announcementRequests', JSON.stringify(updatedRequests));
  };

  const getClubName = (clubId) => {
    const club = CLUBS_CONFIG.find(c => c.id === clubId);
    return club ? club.title : 'Unknown Club';
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard - Announcement Requests</h1>
      {requests.length === 0 ? (
        <p>No requests pending.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {requests.map(req => (
            <div key={req.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px" }}>
              <h3>{req.title}</h3>
              <p><strong>Club:</strong> {getClubName(req.clubId)}</p>
              <p><strong>Description:</strong> {req.description}</p>
              <p><strong>Date:</strong> {req.date}</p>
              {req.poster && <img src={req.poster} alt="Poster" style={{ maxWidth: "200px" }} />}
              <p><strong>Status:</strong> {req.status}</p>
              {req.status === 'pending' && (
                <>
                  <textarea
                    placeholder="Feedback (optional)"
                    value={feedbacks[req.id] || ''}
                    onChange={(e) => setFeedbacks({ ...feedbacks, [req.id]: e.target.value })}
                    style={{ width: "100%", height: "60px", marginTop: "10px" }}
                  />
                  <div style={{ marginTop: "10px" }}>
                    <button onClick={() => handleApprove(req.id)} style={{ padding: "10px", backgroundColor: "green", color: "white", marginRight: "10px" }}>Approve</button>
                    <button onClick={() => handleReject(req.id)} style={{ padding: "10px", backgroundColor: "red", color: "white" }}>Reject</button>
                  </div>
                </>
              )}
              {req.status === 'rejected' && req.feedback && (
                <p><strong>Feedback:</strong> {req.feedback}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
