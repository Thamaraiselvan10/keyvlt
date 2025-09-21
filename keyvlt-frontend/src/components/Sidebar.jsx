// src/components/Sidebar.jsx
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
// We no longer need useAuth here for now
// import { useAuth } from '../context/AuthContext';

function Sidebar({ onUploadClick, onFileDrop, theme, setTheme }) {
  // We no longer need this check for now
  // const { isAuthenticated } = useAuth();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileDrop(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    // The dropzone is now always enabled
    // disabled: !isAuthenticated, 
  });

  const dropzoneOverlayStyle = {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    zIndex: 10,
    opacity: isDragActive ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
    pointerEvents: 'none',
  };

  return (
    <aside className="sidebar" {...getRootProps()} style={{ position: 'relative' }}>
      <input {...getInputProps()} />
      <div style={dropzoneOverlayStyle}>
        <div>Drop File to Upload</div>
      </div>
      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div>
          <div className="sidebar-header">
            <h1>KeyVlt</h1>
            <p>Your secure file vault.</p>
          </div>
          {/* The button is now always visible */}
          <button className="upload-button" onClick={onUploadClick}>
            <FiUploadCloud style={{ marginRight: '8px', verticalAlign: 'middle', fontSize: '1.1em' }} />
            New Upload
          </button>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </aside>
  );
}

export default Sidebar;