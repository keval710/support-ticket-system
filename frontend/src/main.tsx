import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import envVar from './config/config.ts';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={envVar.GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
)
