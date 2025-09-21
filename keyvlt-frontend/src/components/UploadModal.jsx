// src/components/UploadModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

// 1. The component now accepts an 'initialFile' prop from App.jsx
function UploadModal({ onClose, onSuccess, initialFile }) {
  
  // 2. Initialize the component's state using the passed-in file
  const [file, setFile] = useState(initialFile || null);
  const [displayName, setDisplayName] = useState(initialFile?.name || ''); // Pre-fill display name if a file was dropped
  const [keyName, setKeyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !keyName || !displayName) {
      setError('Please fill out all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key_name', keyName);
    formData.append('display_name', displayName);
    formData.append('password', password);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData);
      if (response.data.success) {
        onSuccess(response.data.key_name);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create a New Vlt</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Display Name (Required)</label>
            {/* 3. The 'value' is now controlled by our state, allowing it to be pre-filled */}
            <input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              required 
              className="input-base"
            />
          </div>
          <div className="form-group">
            <label>Key-Name (Required)</label>
            <input type="text" onChange={(e) => setKeyName(e.target.value)} required className="input-base"/>
          </div>
          <div className="form-group">
            <label>Password (Optional)</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} className="input-base"/>
          </div>
          <div className="form-group">
            <label>File (Required)</label>
            {/* 4. This is the new conditional logic */}
            {initialFile ? (
              // If a file was dropped, just show its name
              <p style={{ margin: 0, fontWeight: 'bold' }}>{initialFile.name}</p>
            ) : (
              // Otherwise, show the regular file input button
              <input type="file" onChange={(e) => setFile(e.target.files[0])} required className="input-base"/>
            )}
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
    <button type="button" onClick={onClose} className="button button-secondary">Cancel</button>
    <button type="submit" className="button button-primary">Lock & Upload</button>
</div>
        </form>
      </div>
    </div>
  );
}

export default UploadModal;





