import type { Campaign } from '../types/campaign'
import './CampaignCard.css'

interface CampaignCardProps {
  campaign: Campaign
  index: number
  onClick?: () => void
}

export function CampaignCard({ campaign, index, onClick }: CampaignCardProps) {
  const desc = campaign.description.trim()
  const snippet = desc.length > 60 ? desc.slice(0, 60) + '…' : desc
  const phase = campaign.phases[0]
  const maxParticipants = phase?.maxParticipants ?? 100
  const pricePerClaim = phase?.pricePerClaim ?? 0
  const totalClaimed = campaign.totalClaimed ?? 0
  const percentClaimed = maxParticipants > 0
    ? Math.min(100, Math.round((totalClaimed / maxParticipants) * 100))
    : 0
  const fundingRaised = totalClaimed * pricePerClaim
  const fundingTarget = maxParticipants * pricePerClaim

  return (
    <article
      className="campaign-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick())}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="campaign-card-top">
        <div className="campaign-card-image-wrap">
          {campaign.imageData ? (
            <img src={campaign.imageData} alt="" className="campaign-card-image" />
          ) : (
            <div className="campaign-card-image-placeholder" />
          )}
        </div>
        <div className="campaign-card-body">
          <h3 className="campaign-card-title">{campaign.projectName}</h3>
          <p className="campaign-card-meta">
            {campaign.tokenName} ({campaign.tokenSymbol})
          </p>
          {snippet && <p className="campaign-card-desc">{snippet}</p>}
        </div>
      </div>
      <div className="campaign-card-progress">
        <div className="campaign-card-progress-bar">
          <div
            className="campaign-card-progress-fill"
            style={{ width: `${percentClaimed}%` }}
          />
        </div>
        <div className="campaign-card-progress-labels">
          <span className="campaign-card-progress-text">{percentClaimed}% claimed</span>
          <span className="campaign-card-funding-text">
            ${fundingRaised.toLocaleString()} / ${fundingTarget.toLocaleString()} USDC
          </span>
        </div>
      </div>
    </article>
  )
}
