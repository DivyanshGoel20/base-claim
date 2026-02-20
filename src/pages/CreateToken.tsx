import { useState } from 'react'
import type { Campaign, Phase } from '../types/campaign'
import './CreateToken.css'

const MAX_IMAGE_BYTES = 1024 * 1024
const ACCEPT_IMAGE = '.jpg,.jpeg,.png'

function createEmptyPhase(): Phase {
  return {
    id: crypto.randomUUID(),
    pricePerClaim: 0,
    maxParticipants: 0,
    tokensAllocated: 0,
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

interface CreateTokenProps {
  onPublish?: (campaign: Campaign) => void
}

export function CreateToken({ onPublish }: CreateTokenProps) {
  const [projectName, setProjectName] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [imageData, setImageData] = useState('')
  const [imageError, setImageError] = useState('')
  const [phases, setPhases] = useState<Phase[]>([createEmptyPhase()])
  const [showPreview, setShowPreview] = useState(false)
  const [published, setPublished] = useState(false)
  const [touched, setTouched] = useState(false)

  const updatePhase = (index: number, phase: Phase) => {
    setPhases((prev) => prev.map((p, i) => (i === index ? phase : p)))
  }


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('')
    const file = e.target.files?.[0]
    if (!file) {
      setImageData('')
      return
    }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      setImageError('Use JPG or PNG only.')
      setImageData('')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Max size 1 MB.')
      setImageData('')
      return
    }
    try {
      const data = await fileToBase64(file)
      setImageData(data)
    } catch {
      setImageError('Failed to read file.')
    }
  }

  const validCampaign =
    projectName.trim() !== '' &&
    tokenName.trim() !== '' &&
    tokenSymbol.trim() !== '' &&
    description.trim() !== '' &&
    imageData !== '' &&
    phases.every((p) => p.pricePerClaim > 0 && p.maxParticipants > 0)

  const handlePublish = () => {
    setTouched(true)
    if (!validCampaign) return
    const campaign: Campaign = {
      id: crypto.randomUUID(),
      projectName: projectName.trim(),
      tokenName: tokenName.trim(),
      tokenSymbol: tokenSymbol.trim(),
      description: description.trim(),
      imageData,
      phases: phases.map((p) => ({ ...p })),
      createdAt: Date.now(),
    }
    onPublish?.(campaign)
    setPublished(true)
    setShowPreview(false)
  }

  const resetForm = () => {
    setProjectName('')
    setTokenName('')
    setTokenSymbol('')
    setDescription('')
    setImageData('')
    setImageError('')
    setPhases([createEmptyPhase()])
    setPublished(false)
    setTouched(false)
  }

  if (published) {
    return (
      <div className="create-token">
        <h2>Create Token</h2>
        <div className="create-token-success">
          <p>Campaign published successfully.</p>
          <p className="create-token-success-hint">It will appear on Explore.</p>
          <button type="button" className="create-token-reset" onClick={resetForm}>
            Create another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="create-token">
      <h2>Create Token</h2>
      <p className="create-token-subtitle">Launch your own claim campaign</p>

      <section className="create-token-section create-token-section-animate">
        <div className="create-token-fields">
          <label className={touched && !projectName.trim() ? 'create-token-field-error' : ''}>
            <span>Project name</span>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Project"
            />
          </label>
          <label className={touched && !tokenName.trim() ? 'create-token-field-error' : ''}>
            <span>Token name</span>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="My Token"
            />
          </label>
          <label className={touched && !tokenSymbol.trim() ? 'create-token-field-error' : ''}>
            <span>Token symbol</span>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
              placeholder="MTK"
            />
          </label>
          <label className={touched && !description.trim() ? 'create-token-field-error' : ''}>
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this campaign about?"
              rows={3}
            />
          </label>
          <label className={`create-token-image-label ${touched && !imageData ? 'create-token-field-error' : ''} ${imageData ? 'create-token-image-has' : ''}`}>
            <span>Image (JPG or PNG, max 1 MB)</span>
            <input
              type="file"
              accept={ACCEPT_IMAGE}
              onChange={handleImageChange}
              className="create-token-file-input"
            />
            {imageData ? (
              <div className="create-token-image-preview">
                <img src={imageData} alt="" />
                <span className="create-token-image-check">✓</span>
              </div>
            ) : (
              <div className="create-token-image-placeholder">Choose file</div>
            )}
            {imageError && <span className="create-token-inline-error">{imageError}</span>}
          </label>
          <label className={touched && (phases[0].pricePerClaim <= 0) ? 'create-token-field-error' : ''}>
            <span>Price per claim (USDC)</span>
            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="0"
              value={phases[0].pricePerClaim || ''}
              onChange={(e) => updatePhase(0, { ...phases[0], pricePerClaim: Number(e.target.value) || 0 })}
            />
          </label>
          <label className={touched && (phases[0].maxParticipants <= 0) ? 'create-token-field-error' : ''}>
            <span>Max participants</span>
            <input
              type="number"
              min={1}
              placeholder="100"
              value={phases[0].maxParticipants || ''}
              onChange={(e) => updatePhase(0, { ...phases[0], maxParticipants: Number(e.target.value) || 0 })}
            />
          </label>
        </div>
      </section>

      <div className="create-token-actions">
        <button
          type="button"
          className="create-token-preview"
          onClick={() => setShowPreview(true)}
        >
          Preview
        </button>
        <button
          type="button"
          className="create-token-publish"
          onClick={handlePublish}
          disabled={!validCampaign}
        >
          Publish
        </button>
      </div>

      {showPreview && (
        <div className="create-token-modal" onClick={() => setShowPreview(false)}>
          <div className="create-token-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="create-token-modal-header">
              <h3>Preview</h3>
              <button type="button" className="create-token-modal-close" onClick={() => setShowPreview(false)}>
                ×
              </button>
            </div>
            <div className="create-token-preview-body">
              {imageData && <img src={imageData} alt="" className="create-token-preview-logo" />}
              <p><strong>{projectName || '—'}</strong></p>
              <p>{tokenName} ({tokenSymbol})</p>
              <p className="create-token-preview-desc">{description || '—'}</p>
            </div>
            <button type="button" className="create-token-modal-done" onClick={() => setShowPreview(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
