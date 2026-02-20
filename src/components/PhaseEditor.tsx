import type { Phase } from '../types/campaign'
import './PhaseEditor.css'

interface PhaseEditorProps {
  phase: Phase
  index: number
  onChange: (phase: Phase) => void
  onRemove: () => void
  canRemove: boolean
  touched?: boolean
}

export function PhaseEditor({ phase, index, onChange, onRemove, canRemove, touched }: PhaseEditorProps) {
  const invalid =
    touched &&
    (phase.pricePerClaim <= 0 || phase.maxParticipants <= 0 || phase.tokensAllocated <= 0)

  return (
    <div className={`phase-editor ${invalid ? 'phase-editor-invalid' : ''}`}>
      <div className="phase-editor-header">
        <span className="phase-editor-title">Phase {index + 1}</span>
        {canRemove && (
          <button type="button" className="phase-remove" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      <div className="phase-fields">
        <label>
          <span>Price per claim (USDC)</span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={phase.pricePerClaim || ''}
            onChange={(e) => onChange({ ...phase, pricePerClaim: Number(e.target.value) || 0 })}
          />
        </label>
        <label>
          <span>Max participants</span>
          <input
            type="number"
            min={1}
            value={phase.maxParticipants || ''}
            onChange={(e) => onChange({ ...phase, maxParticipants: Number(e.target.value) || 0 })}
          />
        </label>
        <label>
          <span>Tokens allocated</span>
          <input
            type="number"
            min={1}
            value={phase.tokensAllocated || ''}
            onChange={(e) => onChange({ ...phase, tokensAllocated: Number(e.target.value) || 0 })}
          />
        </label>
      </div>
    </div>
  )
}
