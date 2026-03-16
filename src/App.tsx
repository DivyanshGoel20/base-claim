import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { Tabs } from './components/Tabs'
import { ExploreTokens } from './pages/ExploreTokens'
import { CreateToken } from './pages/CreateToken'
import { MyProfile } from './pages/MyProfile'
import { CampaignDetail } from './pages/CampaignDetail'
import type { Campaign } from './types/campaign'
import type { AuthedUser } from './types/user'
import './App.css'

function App() {
  const [user, setUser] = useState<AuthedUser | null>(null)
  const [activeTab, setActiveTab] = useState<string>('explore')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [claimedCampaignIds, setClaimedCampaignIds] = useState<Set<string>>(new Set())
  const [paidCampaignIds, setPaidCampaignIds] = useState<Set<string>>(new Set())
  const [notInMiniApp, setNotInMiniApp] = useState(false)

  const handlePublishCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [
      ...prev,
      { ...campaign, totalClaimed: 0, creatorFid: user?.fid },
    ])
  }

  const handleOpenCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId)
    setActiveTab('explore')
  }

  const handlePay = (campaignId: string) => {
    setPaidCampaignIds((prev) => new Set(prev).add(campaignId))
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
    ;(async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp()

        if (!inMiniApp) {
          console.warn('Not running inside a Farcaster mini app.')
          setNotInMiniApp(true)
          sdk.actions.ready()
          return
        }

        const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN as string | undefined
        if (!backendOrigin) {
          console.error('VITE_BACKEND_ORIGIN is not set')
          return
        }

        const res = await sdk.quickAuth.fetch(`${backendOrigin}/me`)
        if (res.ok) {
          const authedUser = (await res.json()) as AuthedUser
          setUser(authedUser)
        } else {
          console.error('Quick Auth request failed with status', res.status)
        }
      } catch (error) {
        console.error('Quick Auth error', error)
      } finally {
        sdk.actions.ready()
      }
    })()
  }, [])

  const handleSignOut = () => {
    setUser(null)
  }

  // If we're not inside a Farcaster mini app (e.g. regular browser dev),
  // show a simple message instead of trying to use Quick Auth.
  if (notInMiniApp && !user) {
    return (
      <div className="sign-in-container">
        <div className="sign-in-content">
          <h1>Base Claim</h1>
          <p className="sign-in-subtitle">
            This app uses Farcaster Quick Auth and must run as a Farcaster mini app.
          </p>
          <p className="sign-in-subtitle">
            Open it from a Farcaster client (e.g. Warpcast) to sign in.
          </p>
        </div>
      </div>
    )
  }

  // While Quick Auth is running inside a mini app, let the splash screen handle UI.
  if (!user) {
    return null
  }

  // Show app content after authentication
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-logo" aria-hidden />
        <h1 className="app-header-title">Base Claim</h1>
        <button
          type="button"
          className={`app-header-profile ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          aria-label="My profile"
        >
          <svg className="app-header-profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="8" r="3" />
            <path d="M5 20v-2a5 5 0 0 1 10 0v2" />
          </svg>
        </button>
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
                paid={paidCampaignIds.has(campaign.id)}
                onPay={() => handlePay(campaign.id)}
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
        {activeTab === 'profile' && (
          <MyProfile
            user={user}
            campaigns={campaigns}
            claimedCampaignIds={claimedCampaignIds}
            onOpenCampaign={handleOpenCampaign}
            onSignOut={handleSignOut}
          />
        )}
      </main>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
