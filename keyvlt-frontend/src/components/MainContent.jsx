// src/components/MainContent.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PasswordModal from './PasswordModal';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';
// NEW: Import lots of new icons
import { FiFileText, FiImage, FiFilm, FiMusic, FiArchive, FiLock, FiClock, FiDownload } from 'react-icons/fi';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint } from 'react-icons/fa';
// src/components/MainContent.jsx
import { FiKey } from 'react-icons/fi'; // Import a key icon


// NEW HELPER: Determines which icon to show based on filename
const getFileTypeIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) return <FiImage />;
  if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) return <FiFilm />;
  if (['mp3', 'wav', 'ogg'].includes(extension)) return <FiMusic />;
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return <FiArchive />;
  if (extension === 'pdf') return <FaFilePdf />;
  if (['doc', 'docx'].includes(extension)) return <FaFileWord />;
  if (['xls', 'xlsx'].includes(extension)) return <FaFileExcel />;
  if (['ppt', 'pptx'].includes(extension)) return <FaFilePowerpoint />;
  return <FiFileText />; // Default icon
};

// NEW HELPER: Formats file size from bytes to KB, MB, etc.
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


function MainContent() {
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchKey) {
        performSearch(searchKey);
      } else {
        setSearchResult(null);
        setError('');
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchKey]);

  const performSearch = async (key) => {
    setIsLoading(true);
    setError('');
    setSearchResult(null);
    try {
      const response = await axios.get(`http://localhost:5000/info/${key}`);
      setSearchResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (password = '') => {
    // ... (This function does not need to be changed from the last version)
    if (!searchResult) return;
    const toastId = toast.loading('Preparing your download...');
    try {
      const response = await axios.post(
        `http://localhost:5000/download/${searchResult.key_name}`,
        { password },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', searchResult.original_filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started!', { id: toastId });
      setPasswordModalOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Download failed.';
      toast.error(errorMessage, { id: toastId });
    }
  };

  const onDownloadClick = () => {
    if (searchResult.has_password) {
      setPasswordModalOpen(true);
    } else {
      handleDownload();
    }
  };

  return (
    <main className="main-content">
      <input
        type="text"
        className="input-base"
        placeholder="Enter a key-name to find a file..."
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />

      {isLoading && <p className="loading-indicator"><CgSpinner className="spinner" /> Searching...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '5rem' }}>{error}</p>}

      {/* NEW: The Detailed File Card */}
      {searchResult && (
        <div className="file-card-detailed">
          <div className="file-card-icon">
            {getFileTypeIcon(searchResult.original_filename)}
          </div>
          <div className="file-card-info">
            <h3 title={searchResult.display_name}>{searchResult.display_name}</h3>
            <div className="file-card-meta">
              <span>{formatBytes(searchResult.file_size)}</span>
              <span>•</span>
              <span>Uploaded: {new Date(searchResult.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="file-card-status">
            {searchResult.has_password && <FiLock title="Password protected" />}
            {searchResult.expires_at && <FiClock title={`Expires: ${new Date(searchResult.expires_at).toLocaleString()}`} />}
          </div>
          <div className="file-card-actions">
            <button onClick={onDownloadClick} title="Download File">
              <FiDownload />
            </button>
          </div>
        </div>
      )}

     {!searchResult && !isLoading && !error && (
         <div className="welcome-container">
            <div className="welcome-icon">
              <FiKey />
            </div>
            <h2>Your Secure File Vault</h2>
            <p>
              Use the <strong>New Upload</strong> button to create a secure vault for your file,
              or enter an existing key in the search bar above to access your content.
            </p>
        </div>
      )}

      {isPasswordModalOpen && (
        <PasswordModal
          fileInfo={searchResult}
          onClose={() => setPasswordModalOpen(false)}
          onDownload={handleDownload}
        />
      )}
    </main>
  );
}

export default MainContent;