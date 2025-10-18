import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('Student');
  const [formData, setFormData] = useState({
    fullName: '',
    registerNumber: '',
    staffId: '',
    email: '',
    department: '',
    clubName: '',
    year: '',
    contactNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (role === 'Student') {
        if (!formData.registerNumber.trim()) newErrors.registerNumber = 'Register Number is required';
      } else {
        if (!formData.staffId.trim()) newErrors.staffId = 'Staff/Club ID is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    } else if (step === 2) {
      if (role === 'Student') {
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.year) newErrors.year = 'Year is required';
      } else {
        if (!formData.clubName.trim()) newErrors.clubName = 'Club Name is required';
        if (!formData.contactNumber.trim()) {
          newErrors.contactNumber = 'Contact Number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(formData.contactNumber)) {
          newErrors.contactNumber = 'Contact Number is invalid';
        }
      }
    } else if (step === 3) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      // Placeholder for registration logic
      console.log('Registration attempt:', { role, ...formData });
      // For now, navigate to login
      navigate('/login');
    }
  };



  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Medium';
    return 'Strong';
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter Full Name"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
            {role === 'Student' ? (
              <div className="form-group">
                <label htmlFor="registerNumber">Register Number</label>
                <input
                  type="text"
                  id="registerNumber"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Register Number"
                  className={`form-input ${errors.registerNumber ? 'error' : ''}`}
                />
                {errors.registerNumber && <span className="error-text">{errors.registerNumber}</span>}
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="staffId">Staff/Club ID</label>
                <input
                  type="text"
                  id="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  placeholder="Enter Staff/Club ID"
                  className={`form-input ${errors.staffId ? 'error' : ''}`}
                />
                {errors.staffId && <span className="error-text">{errors.staffId}</span>}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">College Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter College Email"
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2>{role === 'Student' ? 'Academic Details' : 'Club Details'}</h2>
            {role === 'Student' ? (
              <>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`form-input ${errors.department ? 'error' : ''}`}
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                    {/* Add more departments as needed */}
                  </select>
                  {errors.department && <span className="error-text">{errors.department}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={`form-input ${errors.year ? 'error' : ''}`}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                  {errors.year && <span className="error-text">{errors.year}</span>}
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="clubName">Department or Club Name</label>
                  <input
                    type="text"
                    id="clubName"
                    name="clubName"
                    value={formData.clubName}
                    onChange={handleInputChange}
                    placeholder="Enter Club Name"
                    className={`form-input ${errors.clubName ? 'error' : ''}`}
                  />
                  {errors.clubName && <span className="error-text">{errors.clubName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Contact Number"
                    className={`form-input ${errors.contactNumber ? 'error' : ''}`}
                  />
                  {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2>Password Setup</h2>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              {formData.password && (
                <div className="password-strength">
                  Strength: <span className={`strength-${getPasswordStrength(formData.password).toLowerCase()}`}>
                    {getPasswordStrength(formData.password)}
                  </span>
                </div>
              )}
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-container">
          <h1 className="register-title">Create New Account</h1>
          <div className="role-selection">
            <label>
              <input
                type="radio"
                value="Student"
                checked={role === 'Student'}
                onChange={(e) => setRole(e.target.value)}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="Club Head"
                checked={role === 'Club Head'}
                onChange={(e) => setRole(e.target.value)}
              />
              Club Head
            </label>
          </div>
          <div className="progress-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
          <form onSubmit={handleSubmit} className="register-form">
            {renderStepContent()}
            <div className="form-buttons">
              {step > 1 && <button type="button" onClick={prevStep} className="prev-btn">Previous</button>}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="next-btn">Next</button>
              ) : (
                <button type="submit" className="register-btn">Register</button>
              )}
            </div>
          </form>
          <div className="login-link">
            <p>Already have an account? <a href="#" onClick={() => navigate('/login')}>Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
