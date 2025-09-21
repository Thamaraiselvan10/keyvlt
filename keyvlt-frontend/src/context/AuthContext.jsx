// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export function AuthProvider({ children }) {
  // Store the auth token in state. We'll try to get it from localStorage first.
  const [token, setToken] = useState(localStorage.getItem('keyvlt-token'));

  // Function to handle user login
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      const newToken = response.data.access_token;
      setToken(newToken);
      // Store the token in localStorage so the user stays logged in after a refresh
      localStorage.setItem('keyvlt-token', newToken);
      toast.success('Logged in successfully!');
      return true; // Indicate success
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed.');
      return false; // Indicate failure
    }
  };

  // Function to handle user registration
  const register = async (username, password) => {
    try {
      await axios.post('http://localhost:5000/register', {
        username,
        password,
      });
      toast.success('Registration successful! Please log in.');
      return true; // Indicate success
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed.');
      return false; // Indicate failure
    }
  };

  // Function to handle user logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem('keyvlt-token');
    toast.success('Logged out.');
  };

  // The value that will be available to all children components
  const value = {
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token, // A handy boolean to check if the user is logged in
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook to easily use the context
export function useAuth() {
  return useContext(AuthContext);
}