import { useState, useEffect } from 'react';
import './App.css';
import { Toaster } from 'react-hot-toast';

// Import all the components
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import UploadModal from './components/UploadModal';
import SuccessModal from './components/SuccessModal';

function App() {
  // State for managing modals
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  
  // State for the newly created key
  const [newKey, setNewKey] = useState('');
  
  // State for managing the light/dark theme
  const [theme, setTheme] = useState('light');
  
  // NEW: State to hold a file that was dropped via drag-and-drop
  const [preselectedFile, setPreselectedFile] = useState(null);

  // This effect applies the current theme class to the body of the document
  useEffect(() => {
    document.body.className = ''; // Clear any existing classes
    document.body.classList.add(`${theme}-theme`);
  }, [theme]); // Rerun this effect whenever the 'theme' state changes

  // This function is called when a file is dropped onto the sidebar
  const handleFileDrop = (file) => {
    setPreselectedFile(file); // Store the dropped file in our state
    setUploadModalOpen(true); // Immediately open the upload modal
  };

  // This function handles closing the upload modal
  const handleModalClose = () => {
    setUploadModalOpen(false);
    setPreselectedFile(null); // IMPORTANT: Clear the preselected file when the modal is closed
  };

  // This function is called after a file is successfully uploaded
  const handleUploadSuccess = (key) => {
    setUploadModalOpen(false);
    setPreselectedFile(null); // Also clear the file here
    setNewKey(key);
    setSuccessModalOpen(true);
  };

  return (
    <div className="app-layout">
      <Toaster position="top-center" reverseOrder={false} />

      <Sidebar 
        onUploadClick={() => setUploadModalOpen(true)} 
        onFileDrop={handleFileDrop} // Pass the new file drop handler
        theme={theme}
        setTheme={setTheme}
      />
      
      <MainContent />
      
      {isUploadModalOpen && (
        <UploadModal
          onClose={handleModalClose} // Use the new close handler
          onSuccess={handleUploadSuccess}
          initialFile={preselectedFile} // Pass the dropped file down to the modal
        />
      )}

      {isSuccessModalOpen && (
        <SuccessModal
          onClose={() => setSuccessModalOpen(false)}
          newKey={newKey}
        />
      )}
    </div>
  );
}

export default App;