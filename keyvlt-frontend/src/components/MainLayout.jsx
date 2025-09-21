// src/components/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function MainLayout() {
  return (
    <div>
      <Navbar />
      {/* The Outlet component renders the specific page (e.g., Login, Register) */}
      <Outlet />
    </div>
  );
}

export default MainLayout;