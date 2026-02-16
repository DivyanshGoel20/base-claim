import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@farcaster/auth-kit/styles.css'
import { AuthKitProvider } from '@farcaster/auth-kit'
import './index.css'
import App from './App.tsx'

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  // Domain: Your app's domain (e.g., base-claim-mu.vercel.app)
  // This identifies your app during the authentication process
  domain: import.meta.env.VITE_APP_DOMAIN || window.location.hostname,
  // SIWE URI: The callback URL where users are redirected after signing in
  // For a mini-app, this is typically your app's root URL
  siweUri: import.meta.env.VITE_SIWE_URI || window.location.origin,
  relay: 'https://relay.farcaster.xyz',
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthKitProvider config={config}>
      <App />
    </AuthKitProvider>
  </StrictMode>,
)
