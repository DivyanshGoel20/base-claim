import type { SignedInUser } from '../components/SignInWithBase'
import './MyProfile.css'

interface MyProfileProps {
  user: SignedInUser
  onSignOut: () => void
}

export function MyProfile({ user, onSignOut }: MyProfileProps) {
  // Mock data - will be replaced with real data later
  const createdCampaigns = [
    {
      id: '1',
      name: 'BaseSwap Token',
      symbol: 'BSWAP',
      status: 'active',
      totalRaised: 45000,
      target: 100000,
    },
  ]

  // Claim status: pending = waiting for phase threshold; allocated = phase hit, you have allocation; refundable = phase/campaign failed
  const claimedCampaigns = [
    {
      id: '2',
      name: 'DeFi Protocol',
      symbol: 'DEFI',
      allocation: 1000,
      status: 'pending' as const,
      invested: 500,
    },
    {
      id: '3',
      name: 'NFT Marketplace',
      symbol: 'NFTM',
      allocation: 500,
      status: 'allocated' as const,
      invested: 250,
    },
  ]

  const shortAddress =
    user.address.slice(0, 6) + '…' + user.address.slice(-4)

  return (
    <div className="my-profile">
      <h2>My Profile</h2>

      {/* Connected Address - compact */}
      <div className="address-row">
        <span className="address-label">Connected</span>
        <span className="address-short">{shortAddress}</span>
      </div>

      {/* Created Campaigns */}
      <section className="profile-section">
        <h3>Campaigns Created</h3>
        {createdCampaigns.length > 0 ? (
          <div className="campaign-list">
            {createdCampaigns.map((campaign, index) => (
              <div key={campaign.id} className="campaign-card created-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="campaign-header">
                  <div>
                    <div className="campaign-name">{campaign.name}</div>
                    <div className="campaign-symbol">{campaign.symbol}</div>
                  </div>
                  <span className={`status-badge status-${campaign.status}`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="campaign-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(campaign.totalRaised / campaign.target) * 100}%` }}
                    />
                  </div>
                  <div className="progress-text">
                    ${campaign.totalRaised.toLocaleString()} / ${campaign.target.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No campaigns created yet</div>
        )}
      </section>

      {/* Claimed Campaigns */}
      <section className="profile-section">
        <h3>My Claims</h3>
        {claimedCampaigns.length > 0 ? (
          <div className="campaign-list">
            {claimedCampaigns.map((campaign, index) => (
              <div key={campaign.id} className="campaign-card claim-card" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="campaign-header">
                  <div>
                    <div className="campaign-name">{campaign.name}</div>
                    <div className="campaign-symbol">{campaign.symbol}</div>
                  </div>
                  <span className={`status-badge status-${campaign.status}`}>
                    {campaign.status}
                  </span>
                </div>
                <div className="campaign-details">
                  <div className="detail-item">
                    <span className="detail-label">Allocation:</span>
                    <span className="detail-value">{campaign.allocation.toLocaleString()} tokens</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Invested:</span>
                    <span className="detail-value">${campaign.invested.toLocaleString()} USDC</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No active claims</div>
        )}
      </section>

      {/* Sign Out Button */}
      <div className="sign-out-section">
        <button onClick={onSignOut} className="sign-out-button">
          Sign Out
        </button>
      </div>
    </div>
  )
}
