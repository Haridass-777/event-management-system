import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
  const [role, setRole] = useState('Student');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Login attempt:', { role, emailOrId, password, rememberMe });
    setTimeout(() => {
      localStorage.setItem('role', role.toLowerCase());
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-right">
          <div className="login-form-container">
            <h1 className="login-title">Login to Your Account<span style={{fontSize: '14px', opacity: '0.8', display: 'block', marginTop: '8px'}}>Access your dashboard securely</span></h1>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="form-input">
                  <option value="Student"> Student</option>
                  <option value="Club Head"> Club Head</option>
                  <option value="Admin"> Admin</option>
                </select>
                <small style={{color: '#a59121ff', fontSize: '12px', marginTop: '4px', display: 'block'}}>Select your login type (Student / Club Head / Admin)</small>
              </div>
              <div className="form-group">
                <label htmlFor="emailOrId">{role === 'Student' ? 'Register Number' : 'Email or ID'}</label>
                <input type={role === 'Student' ? 'text' : 'email'} id="emailOrId" value={emailOrId} onChange={(e) => setEmailOrId(e.target.value)} placeholder={role === 'Student' ? 'Enter Register Number' : 'Enter Email or ID'} required className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" required className="form-input password-input" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </div>
              <div className="form-options">
                <label className="checkbox-label"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />Remember Me</label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
              <button type="submit" className="login-btn" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
            </form>
            <div className="register-link"><p>Don't have an account? <a href="#" onClick={() => navigate('/register')}>Create New Account</a></p></div>
          </div>
          <footer className="login-footer"><p>Powered by Anna University, CEG IT Team</p></footer>
        </div>
      </div>
    </div>
  );
}

export default Login;
