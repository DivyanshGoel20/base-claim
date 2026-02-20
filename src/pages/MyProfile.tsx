import { useState } from 'react'
import type { SignedInUser } from '../components/SignInWithBase'
import type { Campaign } from '../types/campaign'
import './MyProfile.css'

interface MyProfileProps {
  user: SignedInUser
  campaigns: Campaign[]
  claimedCampaignIds: Set<string>
  onOpenCampaign: (campaignId: string) => void
  onSignOut: () => void
}

export function MyProfile({
  user,
  campaigns,
  claimedCampaignIds,
  onOpenCampaign,
  onSignOut,
}: MyProfileProps) {
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null)
  const [claimableFees, setClaimableFees] = useState<Record<string, number>>({})

  const getClaimableFees = (campaignId: string) =>
    claimableFees[campaignId] ?? (0.02 * ((campaignId.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 150) + 10))

  const createdCampaigns = campaigns.filter(
    (c) => c.creatorAddress?.toLowerCase() === user.address.toLowerCase()
  )
  const claimedCampaigns = campaigns.filter((c) => claimedCampaignIds.has(c.id))

  const shortAddress = user.address.slice(0, 6) + '…' + user.address.slice(-4)

  return (
    <div className="my-profile">
      <h2>My Profile</h2>

      <div className="address-row">
        <span className="address-label">Connected</span>
        <span className="address-short">{shortAddress}</span>
      </div>

      {/* Campaigns Created */}
      <section className="profile-section">
        <h3>Campaigns Created</h3>
        {createdCampaigns.length > 0 ? (
          <div className="campaign-list">
            {createdCampaigns.map((campaign, index) => {
              const phase = campaign.phases[0]
              const maxParticipants = phase?.maxParticipants ?? 100
              const totalClaimed = campaign.totalClaimed ?? 0
              const percent =
                maxParticipants > 0
                  ? Math.min(100, Math.round((totalClaimed / maxParticipants) * 100))
                  : 0
              return (
                <div
                  key={campaign.id}
                  role="button"
                  tabIndex={0}
                  className="campaign-card created-card campaign-card-clickable"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => onOpenCampaign(campaign.id)}
                  onKeyDown={(e) =>
                    (e.key === 'Enter' || e.key === ' ') &&
                    (e.preventDefault(), onOpenCampaign(campaign.id))
                  }
                >
                  <div className="campaign-header">
                    <div>
                      <div className="campaign-name">{campaign.projectName}</div>
                      <div className="campaign-symbol">{campaign.tokenSymbol}</div>
                    </div>
                    <span className="status-badge status-active">active</span>
                  </div>
                  <div className="campaign-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="progress-text">
                      {percent}% claimed
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">No campaigns created yet</div>
        )}
      </section>

      {/* My Claims - one line + dropdown */}
      <section className="profile-section">
        <h3>My Claims</h3>
        {claimedCampaigns.length > 0 ? (
          <div className="claim-list">
            {claimedCampaigns.map((campaign) => {
              const isExpanded = expandedClaimId === campaign.id
              const feesAmount = getClaimableFees(campaign.id)
              return (
                <div
                  key={campaign.id}
                  className="claim-row"
                >
                  <div
                    className="claim-row-main"
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenCampaign(campaign.id)}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') &&
                      (e.preventDefault(), onOpenCampaign(campaign.id))
                    }
                  >
                    <span className="claim-row-title">
                      {campaign.projectName} ({campaign.tokenSymbol})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="claim-row-toggle"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedClaimId((id) =>
                        id === campaign.id ? null : campaign.id
                      )
                    }}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? '▼' : '▶'}
                  </button>
                  {isExpanded && (
                    <div className="claim-row-details">
                      <div className="detail-item">
                        <span className="detail-label">Associated LP</span>
                        <span className="detail-value">
                          {campaign.tokenSymbol}/USDC
                        </span>
                      </div>
                      <div className="detail-item detail-item-fees">
                        <span className="detail-label">Claimable Fees</span>
                        <span className="detail-value detail-value-fees">
                          ${feesAmount.toFixed(2)} USDC
                        </span>
                      </div>
                      <div className="claim-row-actions">
                        <button
                          type="button"
                          className="claim-fees-btn"
                          disabled={feesAmount === 0}
                          onClick={(e) => {
                            e.stopPropagation()
                            setClaimableFees((prev) => ({ ...prev, [campaign.id]: 0 }))
                          }}
                        >
                          Claim Fees
                        </button>
                        <button
                          type="button"
                          className="claim-row-view"
                          onClick={(e) => {
                            e.stopPropagation()
                            onOpenCampaign(campaign.id)
                          }}
                        >
                          View campaign →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">No active claims</div>
        )}
      </section>

      <div className="sign-out-section">
        <button onClick={onSignOut} className="sign-out-button">
          Sign Out
        </button>
      </div>
    </div>
  )
}
