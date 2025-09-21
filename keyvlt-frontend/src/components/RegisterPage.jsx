// src/components/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // CHANGE 1: Import 'useNavigate'
import { useAuth } from '../context/AuthContext';     // CHANGE 2: Import our 'useAuth' hook

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // CHANGE 3: Get the register function from our global context
  const { register } = useAuth(); 
  
  // CHANGE 4: Get the navigation function from react-router
  const navigate = useNavigate(); 

  // CHANGE 5: The whole handleSubmit function is new and improved
  const handleSubmit = async (e) => {
    e.preventDefault();
    // This now calls the powerful register function from our context
    const success = await register(username, password); 
    
    // If the register function returns 'true', we redirect the user to the login page
    if (success) {
      navigate('/login'); 
    }
  };

  // The visual part (the return statement with the JSX) does NOT change.
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create a KeyVlt Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="input-base"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button button-primary">Register</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;