
import './App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bubble from './bubble';  
import AboutContent from './Aboutcontent';

function Landingpage({setRole}) {
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState(null);
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };
  

  const closeModal = () => {
    setShowLogin(false);
    setLoginType(null);
  };

  const handleLoginSubmit = (type) => {
  setRole(type);
  localStorage.setItem("role", type);  // save role
  navigate("/dashboard");               
};

  
  return (
    <div className="page1-background">
      {/* Top bar */}
      <div className="ltop-bar">
        <img 
         src="/assets/logo1.png" 
          alt="logo"
          style={{width: "100px", height: "80px"}}
          />
        <div className="ltop-bar-content">
          <p onClick={() => scrollToSection('home')}>Home</p>
          <p onClick={() => scrollToSection('about')}>About</p>
          <p onClick={() => scrollToSection('footer')}>Contact</p>
          <p onClick={() => setShowLogin(true)}>Login</p>
          <p>Signup</p>
        </div>
      </div>

      
      <section className="llanding-section">
        <div className="hero-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Bubble />

          <div className="hero-text">
            <h1>Club Management System</h1>
            <h2>Anna University, CEG</h2>
          </div>
        </div>
      </section>

      <div className='homebg'>
      <section id="home" className="reveal">
       <h1>Home</h1>
       <p>Welcome to our College Club Management System.</p>    
       <p>Explore club events, member activities, and event updates all in one place.</p>
     </section>
      </div>

     <div className='aboutbg'>
     <section id="about" className="reveal">
        <AboutContent />
      <p>Students can join clubs, and club heads can organize events easily using this system.</p>
     </section>
      </div>


      <footer id="footer" className="footer">
         <h2>Contact Us</h2>
         <p>Email: support@cemscollege.edu</p>
         <p>Phone: +91 98765 43210</p>
         <p>© 2025 CEMS - All rights reserved</p>
      </footer>


      {/* Popup Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {!loginType && (
              <>
                <h2>Select Login Type</h2>
                <div className="modal-buttons">
                  <button className="lbtn" onClick={() => setLoginType('student')}>
                    Student
                  </button>
                  <button className="lbtn" onClick={() => setLoginType('clubhead')}>
                    Club Head
                  </button>
                </div>
                <button className="close-btn" onClick={closeModal}>Close</button>
              </>
            )}

            {loginType === 'student' && (
              <div className="slogin-container">
                <div className="slogin-box">
                  <h2>Student Login</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit('student'); }}>
                    <input type="text" placeholder="Student ID" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                  </form>
                  <button className="back-btn" onClick={() => setLoginType(null)}>Back</button>
                </div>
              </div>
            )}

            {loginType === 'clubhead' && (
              <div className="clogin-container">
                <div className="clogin-box">
                  <h2>Club Head Login</h2>
                  <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit('clubhead'); }}>
                    <input type="text" placeholder="Club Head ID" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                  </form>
                  <button className="back-btn" onClick={() => setLoginType(null)}>Back</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Landingpage;
 