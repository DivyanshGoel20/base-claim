/** Single phase of a claim campaign. Used by CreateToken, PhaseEditor, and App when storing campaigns. */
export interface Phase {
  id: string
  pricePerClaim: number
  maxParticipants: number
  tokensAllocated: number
}

/** Full campaign shape. Used by App (state), CreateToken (publish), ExploreTokens (list), and later MyProfile. */
export interface Campaign {
  id: string
  projectName: string
  tokenName: string
  tokenSymbol: string
  description: string
  imageData: string
  phases: Phase[]
  createdAt: number
  creatorAddress?: string
}
