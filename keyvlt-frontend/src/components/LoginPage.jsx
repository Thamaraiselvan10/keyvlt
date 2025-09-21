// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // CHANGE 1: Import 'useNavigate'
import { useAuth } from '../context/AuthContext';     // CHANGE 2: Import our 'useAuth' hook

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // CHANGE 3: Get the login function from our global context
  const { login } = useAuth(); 
  
  // CHANGE 4: Get the navigation function from react-router
  const navigate = useNavigate(); 

  // CHANGE 5: The whole handleSubmit function is new and improved
  const handleSubmit = async (e) => {
    e.preventDefault();
    // This now calls the powerful login function from our context
    const success = await login(username, password); 
    
    // If the login function returns 'true', we redirect the user
    if (success) {
      navigate('/'); 
    }
  };

  // The visual part (the return statement with the JSX) does NOT change.
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to KeyVlt</h2>
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
          <button type="submit" className="button button-primary">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;