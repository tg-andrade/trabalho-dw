import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { GenreProvider } from './context/GenreContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GenreProvider>
        <App />
      </GenreProvider>
    </BrowserRouter>
  </StrictMode>
);
