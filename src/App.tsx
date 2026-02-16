import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { SignInButton, useProfile } from '@farcaster/auth-kit'
import './App.css'

function App() {
  const {
    isAuthenticated,
    profile: { username, fid },
  } = useProfile()

  useEffect(() => {
    // Hide splash screen and display content after app is fully loaded
    sdk.actions.ready()
  }, [])

  return (
    <>
      <h1>Base Claim</h1>
      <div className="card">
        {isAuthenticated ? (
          <div>
            <p>Hello, {username}! Your fid is: {fid}</p>
            <p>You're signed in with Farcaster!</p>
          </div>
        ) : (
          <div>
            <p>Sign in with Farcaster to continue</p>
            <SignInButton
              onSuccess={({ fid, username }) =>
                console.log(`Hello, ${username}! Your fid is ${fid}.`)
              }
            />
          </div>
        )}
      </div>
    </>
  )
}

export default App
