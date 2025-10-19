 import React, { useState } from 'react';
import { CLUBS_CONFIG, EVENTS_CONFIG } from './clubsConfig';
import { CheckIcon, ErrorIcon, LoaderIcon } from './icons';
import { Menu, LogOut, Info, Users } from "lucide-react";
import StudentProfile from "./StudentProfile";
import './Inpage.css';

export default function StudentDashboard() {
  const [clubs, setClubs] = useState(
    CLUBS_CONFIG.map(club => ({
      ...club,
      status: 'idle',
      registeredAt: null
    }))
  );

  const [events, setEvents] = useState(EVENTS_CONFIG.map(e => ({ ...e, registeredBy: null })));
  const [showModal, setShowModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMyClubs, setShowMyClubs] = useState(false);
  const [viewClub, setViewClub] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const studentData = {
    name: "Hari Dass",
    email: "hari@example.com",
    enrollment: "2023-ENG-001",
    department: "Computer Science",
    contact: "9876543210",
    avatar: "/path/to/avatar.jpg"
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRegisterClub = (clubId) => {
    setClubs(prev => prev.map(c => 
      c.id === clubId ? { ...c, status: 'registering' } : c
    ));
    setTimeout(() => {
      setClubs(prev => prev.map(c => 
        c.id === clubId ? { ...c, status: 'registered', registeredAt: new Date() } : c
      ));
      showNotification('Club registered successfully');
    }, 1000);
  };

  const handleLeaveClick = (club) => {
    setSelectedClub(club);
    setShowModal(true);
  };

  const confirmLeave = () => {
    if (!selectedClub) return;
    setClubs(prev => prev.map(c => c.id === selectedClub.id ? { ...c, status: 'leaving' } : c));
    setTimeout(() => {
      setClubs(prev => prev.map(c => c.id === selectedClub.id ? { ...c, status: 'idle', registeredAt: null } : c));
      setEvents(prev => prev.map(ev => (registeredClubs.some(c => c.id === ev.clubId && c.id === selectedClub.id) ? {...ev, registeredBy: null} : ev)));
      showNotification(`Left ${selectedClub.title}`);
      setShowModal(false);
      setSelectedClub(null);
    }, 1000);
  };

  const registeredClubs = clubs.filter(c => c.status === 'registered');
  const registeredEvents = events.filter(e => e.registeredBy === studentData.enrollment);

  const handleViewClub = (club) => {
    setViewClub(club);
    setShowMyClubs(false);
    setShowProfile(false);
  };

  const handleRegisterEvent = (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredBy: studentData.enrollment } : e));
    showNotification('Event registered successfully');
  };

  return (
    <div className="app-container">
      {/* Top Bar */}
      <header className="Intopbar">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Menu"
        >
          <Menu size={26} />
        </button>
        <h2 className="dashboard-title">Student Dashboard</h2>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
           <li onClick={() => { setShowProfile(true); setShowMyClubs(false); setViewClub(null); setSidebarOpen(false); }}>
            <Users size={18} /> <span>My Profile</span>
          </li>
          <li onClick={() => { setShowMyClubs(false); setViewClub(null); setShowProfile(false); setSidebarOpen(false); }}>
            <Info size={18} /> <span>Home</span>
          </li>
          <li onClick={() => { setShowMyClubs(true); setViewClub(null); setShowProfile(false); setSidebarOpen(false); }}>
            <Users size={18} /> <span>My Clubs</span>
          </li>
          <li onClick={() => { setShowMyClubs(false); setViewClub('myEvents'); setShowProfile(false); setSidebarOpen(false); }}>
            <Users size={18} /> <span>My Events</span>
          </li>
          <li onClick={() => { window.location.href = "/"; setSidebarOpen(false); }}>
            <LogOut size={18} /> <span>Logout</span>
          </li>
        </ul>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <main className="dashboard-content">
        {showProfile ? (
          <StudentProfile
            student={studentData}
            registeredClubs={registeredClubs}
            registeredEvents={registeredEvents}
            onClose={() => setShowProfile(false)}
          />
        ) : viewClub === 'myEvents' ? (
          <div className="empty-state">
            {registeredEvents.length === 0 ? (
              <>
                <h3>No Events Registered</h3>
                <p>You haven't registered for any events yet.</p>
                <button className="browse-btn" onClick={() => setShowMyClubs(false)}>View All Clubs</button>
              </>
            ) : (
              registeredEvents.map(e => (
                <div key={e.id} className="event-box">
                  <h3>{e.title}</h3>
                  <p>{e.description}</p>
                  <p>Date: {new Date(e.date).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        ) : showMyClubs ? (
          <div className="my-clubs-detailed">
            {registeredClubs.length === 0 ? (
              <div className="empty-state">
                <h3>No Clubs Registered</h3>
                <p>Browse and register clubs!</p>
                <button className="browse-btn" onClick={() => setShowMyClubs(false)}>View All Clubs</button>
              </div>
            ) : (
              registeredClubs.map(club => (
                <div key={club.id} className="detailed-club-card">
                  <div className="detailed-card-left">
                    <img src={club.image} alt={club.title} className="detailed-club-image"/>
                  </div>
                  <div className="detailed-card-right">
                    <h2>{club.title}</h2>
                    <p>{club.description}</p>
                    <button onClick={() => handleLeaveClick(club)} className="leave-btn">
                      Leave Club
                    </button>
                    <h3>Upcoming Events</h3>
                    <div className="events-grid">
                      {events.filter(e => e.clubId === club.id).map(e => (
                        <div key={e.id} className="event-box">
                          <div>{e.title}</div>
                          <div>{new Date(e.date).toLocaleDateString()}</div>
                          {e.registeredBy !== studentData.enrollment ? (
                            <button className="browse-btn" onClick={() => handleRegisterEvent(e.id)}>Register</button>
                          ) : (
                            <button className="leave-btn" disabled>Registered</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : viewClub && viewClub !== 'myEvents' ? (
          <div className="my-clubs-detailed">
            <div className="detailed-club-card">
              <div className="detailed-card-left">
                <img src={viewClub.image} alt={viewClub.title} className="detailed-club-image"/>
              </div>
              <div className="detailed-card-right">
                <h2>{viewClub.title}</h2>
                <p>{viewClub.description}</p>
                <p>{viewClub.contact}</p>
                <button onClick={() => handleRegisterClub(viewClub.id)} disabled={viewClub.status==='registered'}>
                  {viewClub.status==='registered' ? 'Registered' : 'Register'}
                </button>
                <h3>Upcoming Events</h3>
                <div className="events-grid">
                  {events.filter(e => e.clubId === viewClub.id).map(e => (
                    <div key={e.id} className="event-box">
                      <div>{e.title}</div>
                      <div>{new Date(e.date).toLocaleDateString()}</div>
                      {e.registeredBy !== studentData.enrollment ? (
                        <button className="browse-btn" onClick={() => handleRegisterEvent(e.id)}>Register</button>
                      ) : (
                        <button className="leave-btn" disabled>Registered</button>
                      )}
                    </div>
                  ))}
                </div>
                <button className="browse-btn" onClick={() => setViewClub(null)}>Back</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-grid">
            {clubs.map(club => (
              <div key={club.id} className="product-card">
                <img src={club.image} alt={club.title} className="club-image"/>
                <div className="card-content">
                  <h3>{club.title}</h3>
                  <p>{club.description}</p>
                  <div className="contact">{club.contact}</div>
                  {club.status === 'registered' ? (
                    <button className="leave-btn" onClick={() => handleLeaveClick(club)}>Leave Club</button>
                  ) : (
                    <button className="browse-btn" onClick={() => handleRegisterClub(club.id)}>Register</button>
                  )}
                  <button className="view-btn" onClick={() => handleViewClub(club)}>View</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedClub && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>Are you sure you want to leave this club?</p>
              <div className="popup-buttons">
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="confirm-btn" onClick={confirmLeave}>Confirm</button>
              </div>
            </div>
          </div>
        )}

        {notification && (
          <div className={`notification ${notification.type==='error' ? 'error':''}`}>
            {notification.type==='success' ? <CheckIcon/> : <ErrorIcon/>}
            <span>{notification.message}</span>
          </div>
        )}
      </main>
    </div>
  );
}
