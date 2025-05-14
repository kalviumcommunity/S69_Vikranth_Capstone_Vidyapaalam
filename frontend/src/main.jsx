import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';  // ← import your AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>      {/* ← wrap your App with AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>,
);
