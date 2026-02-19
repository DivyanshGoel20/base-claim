import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { SignInWithBase } from './components/SignInWithBase'
import './App.css'

function App() {
  useEffect(() => {
    sdk.actions.ready()
  }, [])

  return (
    <>
      <h1>Base Claim</h1>
      <div className="card">
        <p>Sign in with Base to continue</p>
        <SignInWithBase />
      </div>
    </>
  )
}

export default App
