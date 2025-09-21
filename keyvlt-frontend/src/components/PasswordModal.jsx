// src/components/PasswordModal.jsx
import React, { useState } from 'react';

function PasswordModal({ fileInfo, onClose, onDownload }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password cannot be empty.');
      return;
    }
    // Pass the password back to the MainContent component to handle the download
    onDownload(password);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Password Required</h2>
        <p>
          The file "<strong>{fileInfo.display_name}</strong>" is password protected.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="input-base" 
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
    <button type="button" onClick={onClose} className="button button-secondary">Cancel</button>
    <button type="submit" className="button button-primary">Unlock & Download</button>
</div>
        </form>
      </div>
    </div>
  );
}

export default PasswordModal;