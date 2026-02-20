import type { Campaign } from '../types/campaign'
import './ExploreTokens.css'

interface ExploreTokensProps {
  campaigns: Campaign[]
}

export function ExploreTokens({ campaigns }: ExploreTokensProps) {
  return (
    <div className="explore-tokens">
      <h2>Explore Tokens</h2>
      <p>Browse active claim campaigns</p>
      {campaigns.length > 0 && (
        <p className="explore-tokens-count">{campaigns.length} campaign(s) live</p>
      )}
    </div>
  )
}
