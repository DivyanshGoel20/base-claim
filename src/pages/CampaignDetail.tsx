import { useState, useCallback, useRef } from 'react'
import type { Campaign } from '../types/campaign'
import './CampaignDetail.css'

const HOLD_DURATION_MS = 2000

interface CampaignDetailProps {
  campaign: Campaign
  claimed: boolean
  onClaim: () => void
  onBack: () => void
}

export function CampaignDetail({ campaign, claimed, onClaim, onBack }: CampaignDetailProps) {
  const [holdProgress, setHoldProgress] = useState(0)
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdStartRef = useRef<number>(0)

  const phase = campaign.phases[0]
  const maxParticipants = phase?.maxParticipants ?? 100
  const pricePerClaim = phase?.pricePerClaim ?? 0
  const totalClaimed = campaign.totalClaimed ?? 0
  const percentClaimed = maxParticipants > 0
    ? Math.min(100, Math.round((totalClaimed / maxParticipants) * 100))
    : 0
  const fundingRaised = totalClaimed * pricePerClaim
  const fundingTarget = maxParticipants * pricePerClaim

  const startHold = useCallback(() => {
    if (claimed) return
    holdStartRef.current = Date.now()
    setHoldProgress(0)
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current
      const p = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100)
      setHoldProgress(p)
      if (p >= 100) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current)
        holdTimerRef.current = null
        onClaim()
      }
    }, 50)
  }, [claimed, onClaim])

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current)
      holdTimerRef.current = null
    }
    setHoldProgress(0)
  }, [])

  return (
    <div className="campaign-detail">
      <button type="button" className="campaign-detail-back" onClick={onBack}>
        ← Back
      </button>

      <div className="campaign-detail-hero">
        {campaign.imageData ? (
          <img src={campaign.imageData} alt="" className="campaign-detail-image" />
        ) : (
          <div className="campaign-detail-image-placeholder" />
        )}
      </div>

      <div className="campaign-detail-body">
        <h1 className="campaign-detail-title">{campaign.projectName}</h1>
        <p className="campaign-detail-meta">{campaign.tokenName} ({campaign.tokenSymbol})</p>
        {campaign.description.trim() && (
          <p className="campaign-detail-desc">{campaign.description}</p>
        )}

        <div className="campaign-detail-progress-wrap">
          <div className="campaign-detail-progress-bar">
            <div
              className="campaign-detail-progress-fill"
              style={{ width: `${percentClaimed}%` }}
            />
          </div>
          <p className="campaign-detail-progress-text">{percentClaimed}% claimed</p>
          <p className="campaign-detail-funding-text">
            ${fundingRaised.toLocaleString()} / ${fundingTarget.toLocaleString()} USDC
          </p>
        </div>

        <div className="campaign-detail-claim-wrap">
          {claimed ? (
            <button type="button" className="campaign-detail-claimed-btn" disabled>
              Claimed!
            </button>
          ) : (
            <button
              type="button"
              className="campaign-detail-hold-btn"
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
            >
              <span
                className="campaign-detail-hold-liquid"
                style={{ '--hold': holdProgress } as React.CSSProperties}
              />
              <span className="campaign-detail-hold-label">Hold To Claim</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
