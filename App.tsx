import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Studio } from './components/Studio';
import { FreeStudio } from './components/FreeStudio';

// IMPORTANT: Replace this with your actual Google Client ID from Google Cloud Console.
// You need to enable the "Generative Language API" in your Google Cloud Project.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Studio />} />
          <Route path="/free" element={<FreeStudio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;