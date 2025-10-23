import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import UploadEventForm from "./UploadEventForm";
import { CLUBS_CONFIG } from "./clubsConfig";
import { User, Calendar, Bell, Settings, Home, LogOut } from "lucide-react";

function ClubHeadDashboard() {
  const [requests, setRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "Club Head", clubId: 1 }); // Assume from localStorage or props

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('announcementRequests') || '[]');
    setRequests(storedRequests);
    // Assume user data
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    setUser(loggedUser);
  }, []);

  const handleEdit = () => {
    // Placeholder for edit functionality
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = (id) => {
    const updatedRequests = requests.filter(req => req.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem('announcementRequests', JSON.stringify(updatedRequests));
    toast.success("Announcement deleted!");
  };

  const getClubLogo = (clubId) => {
    const club = CLUBS_CONFIG.find(c => c.id === clubId);
    return club ? club.image : '/assets/logo.png';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'orange';
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => setSidebarOpen(false)}><Home size={20} /><span>Home</span></li>
          <li onClick={() => setSidebarOpen(false)}><Calendar size={20} /><span>Events</span></li>
          <li onClick={() => setSidebarOpen(false)}><Bell size={20} /><span>Notifications</span></li>
          <li onClick={() => setSidebarOpen(false)}><User size={20} /><span>Profile</span></li>
          <li onClick={() => setSidebarOpen(false)}><Settings size={20} /><span>Settings</span></li>
          <li onClick={() => setSidebarOpen(false)}><LogOut size={20} /><span>Logout</span></li>
        </ul>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {/* Topbar */}
        <div className="Intopbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle Sidebar">
            ☰
          </button>
          <span className="dashboard-title">Club Head Dashboard</span>
        </div>

        {/* Personalized Welcome Banner */}
        <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
          <img src={getClubLogo(user.clubId)} alt="Club Logo" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
          <div>
            <h2>Welcome, {user.name}!</h2>
            <p>Manage your club's announcements and events.</p>
          </div>
        </div>

        {/* Announcement Submission Section */}
        <div className="upload-form" style={{ marginBottom: "30px" }}>
          <h2>Upload New Announcement</h2>
          <UploadEventForm onSubmitSuccess={() => {
            const updatedRequests = JSON.parse(localStorage.getItem('announcementRequests') || '[]');
            setRequests(updatedRequests);
            toast.success("Announcement submitted successfully!");
          }} />
        </div>

        {/* My Announcements Panel */}
        <div className="announcements-section">
          <h2>My Announcements</h2>
          {requests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <div className="card-grid">
              {requests.map(req => (
                <div key={req.id} className="generic-card" style={{ padding: "15px" }}>
                  <h3>{req.title}</h3>
                  <p><strong>Description:</strong> {req.description}</p>
                  <p><strong>Date:</strong> {req.date}</p>
                  <p><strong>Status:</strong> <span style={{ color: getStatusColor(req.status) }}>{req.status}</span></p>
                  <p><strong>Submitted:</strong> {new Date(req.id).toLocaleString()}</p>
                  {req.status === 'rejected' && req.feedback && (
                    <p><strong>Feedback:</strong> {req.feedback}</p>
                  )}
                  {req.status === 'pending' && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button onClick={() => handleEdit()} style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}>Edit</button>
                      <button onClick={() => handleDelete(req.id)} style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px" }}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubHeadDashboard;
