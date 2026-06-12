import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.scss';

const savedTheme = localStorage.getItem('omni-theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
