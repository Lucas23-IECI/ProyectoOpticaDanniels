import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from '@context/AuthProvider';
import { WishlistProvider } from './context/WishlistProvider';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
