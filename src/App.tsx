import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { SignInWithBase } from './components/SignInWithBase'
import './App.css'

function App() {
  useEffect(() => {
    // Hide splash screen and display content after app is fully loaded
    sdk.actions.ready()
  }, [])

  const handleSignInSuccess = (address: string) => {
    console.log('Signed in with Base:', address)
  }

  return (
    <>
      <h1>Base Claim</h1>
      <div className="card">
        <p>Sign in with Base to continue</p>
        <SignInWithBase onSuccess={handleSignInSuccess} />
      </div>
    </>
  )
}

export default App
