import type { Campaign } from '../types/campaign'
import { CampaignCard } from '../components/CampaignCard'
import './ExploreTokens.css'

interface ExploreTokensProps {
  campaigns: Campaign[]
}

export function ExploreTokens({ campaigns }: ExploreTokensProps) {
  return (
    <div className="explore-tokens">
      <h2>Explore Tokens</h2>
      <p className="explore-tokens-subtitle">Browse active claim campaigns</p>

      {campaigns.length > 0 ? (
        <ul className="explore-tokens-list">
          {campaigns.map((campaign, index) => (
            <li key={campaign.id}>
              <CampaignCard campaign={campaign} index={index} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="explore-tokens-empty">
          <p>No campaigns yet</p>
          <p className="explore-tokens-empty-hint">Create one from the Create Token tab</p>
        </div>
      )}
    </div>
  )
}
