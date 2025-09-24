import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
// Fix for Draft.js "global is not defined"
(window as any).global = window;
  const Client_ID =
    "833310979923-ku82at5snsvqqb9aipr8fs6il1ublgvq.apps.googleusercontent.com";

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={Client_ID}>
  <StrictMode>
    <App />
  </StrictMode>,
  </GoogleOAuthProvider>
)
  