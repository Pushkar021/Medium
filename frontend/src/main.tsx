import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
// Fix for Draft.js "global is not defined"
(window as any).global = window;
const Client_ID: string = import.meta.env.VITE_Client_ID
console.log(Client_ID)
createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={Client_ID}>
  <StrictMode>
    <App  />
  </StrictMode>
  </GoogleOAuthProvider>
)
  