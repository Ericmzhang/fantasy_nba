import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-0douptt0qviylyxf.us.auth0.com"
    clientId="6Qi65RAJzmIloIKohKeZle9Knol1UvN4"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <StrictMode>
    <App />
  </StrictMode>,
  </Auth0Provider>,
)
