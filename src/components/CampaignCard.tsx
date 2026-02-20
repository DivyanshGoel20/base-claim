import type { Campaign } from '../types/campaign'
import './CampaignCard.css'

interface CampaignCardProps {
  campaign: Campaign
  index: number
  onClick?: () => void
}

export function CampaignCard({ campaign, index, onClick }: CampaignCardProps) {
  const desc = campaign.description.trim()
  const snippet = desc.length > 80 ? desc.slice(0, 80) + '…' : desc

  return (
    <article
      className="campaign-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick())}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
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
    </article>
  )
}
