import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { SignInWithBase } from './components/SignInWithBase'
import type { SignedInUser } from './components/SignInWithBase'
import { Tabs } from './components/Tabs'
import { ExploreTokens } from './pages/ExploreTokens'
import { CreateToken } from './pages/CreateToken'
import { MyProfile } from './pages/MyProfile'
import { CampaignDetail } from './pages/CampaignDetail'
import type { Campaign } from './types/campaign'
import './App.css'

function App() {
  const [user, setUser] = useState<SignedInUser | null>(null)
  const [activeTab, setActiveTab] = useState<string>('explore')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [claimedCampaignIds, setClaimedCampaignIds] = useState<Set<string>>(new Set())

  const handlePublishCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [...prev, { ...campaign, totalClaimed: 0 }])
  }

  const handleClaim = (campaignId: string) => {
    setClaimedCampaignIds((prev) => new Set(prev).add(campaignId))
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, totalClaimed: (c.totalClaimed ?? 0) + 1 } : c
      )
    )
  }

  useEffect(() => {
    sdk.actions.ready()
  }, [])

  const handleSignIn = (signedInUser: SignedInUser) => {
    setUser(signedInUser)
  }

  const handleSignOut = () => {
    setUser(null)
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
        {activeTab === 'explore' &&
          (selectedCampaignId ? (() => {
            const campaign = campaigns.find((c) => c.id === selectedCampaignId)
            if (!campaign) {
              return (
                <ExploreTokens
                  campaigns={campaigns}
                  onCampaignClick={(c) => setSelectedCampaignId(c.id)}
                />
              )
            }
            return (
              <CampaignDetail
                campaign={campaign}
                claimed={claimedCampaignIds.has(campaign.id)}
                onClaim={() => handleClaim(campaign.id)}
                onBack={() => setSelectedCampaignId(null)}
              />
            )
          })() : (
            <ExploreTokens
              campaigns={campaigns}
              onCampaignClick={(c) => setSelectedCampaignId(c.id)}
            />
          ))}
        {activeTab === 'create' && <CreateToken onPublish={handlePublishCampaign} />}
        {activeTab === 'profile' && <MyProfile user={user} onSignOut={handleSignOut} />}
      </main>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
