import './App.css';
import { useNavigate } from 'react-router-dom';
import Bubble from './bubble';
import AboutContent from './Aboutcontent';

function Landingpage() {
  const navigate = useNavigate();

  // Smooth scrolling
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page1-background">
      {/* 🔹 Top Bar */}
      <div className="ltop-bar">
        <img
          src="/assets/logo1.png"
          alt="logo"
          style={{ width: "100px", height: "80px" }}
        />
        <div className="ltop-bar-content">
          <p onClick={() => scrollToSection('home')}>Home</p>
          <p onClick={() => scrollToSection('about')}>About</p>
          <p onClick={() => scrollToSection('footer')}>Contact</p>
          <p onClick={() => navigate('/login')}>Login</p>
          <p onClick={() => navigate('/register')}>Signup</p>
        </div>
      </div>

      {/* 🔹 Landing Section with Bubble Background */}
      <section className="llanding-section">
        <div className="hero-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Bubble />
          <div className="hero-text">
            <h1>Club Management System</h1>
            <h2>Anna University, CEG</h2>
          </div>
        </div>
      </section>

      {/* 🔹 Home Section */}
      <div className="homebg">
        <section id="home" className="reveal">
          <h1>Home</h1>
          <p>Welcome to our College Club Management System.</p>
          <p>Explore club events, member activities, and event updates all in one place.</p>
        </section>
      </div>

      {/* 🔹 About Section */}
      <div className="aboutbg">
        <section id="about" className="reveal">
          <AboutContent />
          <p>Students can join clubs, and club heads can organize events easily using this system.</p>
        </section>
      </div>

      {/* 🔹 Footer */}
      <footer id="footer" className="footer">
        <h2>Contact Us</h2>
        <p>Email: support@cemscollege.edu</p>
        <p>Phone: +91 98765 43210</p>
        <p>© 2025 CEMS - All rights reserved</p>
      </footer>


    </div>
  );
}

export default Landingpage;
