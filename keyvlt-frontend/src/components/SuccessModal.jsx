// src/components/SuccessModal.jsx
import React from 'react';
import toast from 'react-hot-toast';

function SuccessModal({ onClose, newKey }) {
  const copyKey = () => {
  navigator.clipboard.writeText(newKey);
  toast.success('Key copied to clipboard!'); // <-- THE NEW, BETTER WAY
};

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <h2>Upload Successful!</h2>
        <p>Your key-name is:</p>
        <h3 style={{ color: 'var(--primary-color)' }}>{newKey}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
    <button onClick={copyKey} className="button button-primary">Copy Key</button>
    <button onClick={onClose} className="button button-secondary">Close</button>
</div>
      </div>
    </div>
  );
}

export default SuccessModal;