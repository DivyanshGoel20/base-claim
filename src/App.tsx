import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { SignInWithBase } from './components/SignInWithBase'
import type { SignedInUser } from './components/SignInWithBase'
import { Tabs } from './components/Tabs'
import { ExploreTokens } from './pages/ExploreTokens'
import { CreateToken } from './pages/CreateToken'
import { MyProfile } from './pages/MyProfile'
import './App.css'

function App() {
  const [user, setUser] = useState<SignedInUser | null>(null)
  const [activeTab, setActiveTab] = useState<string>('explore')

  useEffect(() => {
    sdk.actions.ready()
  }, [])

  const handleSignIn = (signedInUser: SignedInUser) => {
    setUser(signedInUser)
  }

  // Show sign-in screen if not authenticated
  if (!user) {
    return (
      <div className="sign-in-container">
        <div className="sign-in-content">
          <h1>Base Claim</h1>
          <p className="sign-in-subtitle">Sign in with Base to access the Claim Launch Platform</p>
          <SignInWithBase onSignIn={handleSignIn} />
        </div>
      </div>
    )
  }

  // Show app content after authentication
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Base Claim</h1>
      </header>
      <main className="app-content">
        {activeTab === 'explore' && <ExploreTokens />}
        {activeTab === 'create' && <CreateToken />}
        {activeTab === 'profile' && <MyProfile />}
      </main>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
