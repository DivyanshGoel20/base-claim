import React, { useState, useMemo } from 'react'
import { SignInWithBaseButton } from '@base-org/account-ui/react'
import { createBaseAccountSDK } from '@base-org/account'
import { createWalletClient, custom } from 'viem'
import { base } from 'viem/chains'

interface SignedInUser {
  address: `0x${string}`
  timestamp: number
}

export function SignInWithBase(): React.ReactElement {
  const [user, setUser] = useState<SignedInUser | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const sdk = useMemo(
    () =>
      createBaseAccountSDK({
        appName: 'Base Claim',
        appLogoUrl: `${window.location.origin}/vite.svg`,
        appChainIds: [base.id],
      }),
    []
  )

  const handleSignIn = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const provider = sdk.getProvider()
      if (!provider) {
        throw new Error('Base Account extension not detected. Please install it first.')
      }

      const client = createWalletClient({
        chain: base,
        transport: custom(provider),
      })

      let addresses: readonly `0x${string}`[]
      try {
        addresses = await client.requestAddresses()
      } catch (e: unknown) {
        const code = (e as { code?: number })?.code
        if (code === 4001) {
          throw new Error('Connection request was rejected.')
        }
        if (code === -32002) {
          throw new Error('A connection request is already pending.')
        }
        const raw = await provider.request({ method: 'eth_requestAccounts' })
        addresses = Array.isArray(raw) ? (raw as `0x${string}`[]) : []
      }

      if (!addresses?.length) {
        throw new Error('No account selected.')
      }

      const account = addresses[0]
      const message = `Sign in to Base Claim at ${Date.now()}`
      const signature = await client.signMessage({
        account,
        message,
      })

      setUser({
        address: account,
        timestamp: Date.now(),
      })
      console.log('Signed in:', account, signature)
    } catch (err: unknown) {
      const code = (err as { code?: number })?.code
      if (code === 4001) {
        setError('You rejected the sign-in request.')
        return
      }
      if (code === -32002) {
        setError('A sign-in request is already pending. Check your wallet.')
        return
      }
      const message = err instanceof Error ? err.message : 'Sign in failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = (): void => {
    setUser(null)
    setError(null)
  }

  if (user) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '8px' }}>
          <strong>Signed in:</strong>{' '}
          <code style={{ fontSize: '14px' }}>{user.address.slice(0, 6)}…{user.address.slice(-4)}</code>
        </p>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
          {new Date(user.timestamp).toLocaleString()}
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          style={{
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div>
      <SignInWithBaseButton
        align="center"
        variant="solid"
        colorScheme="dark"
        onClick={handleSignIn}
      />
      {loading && <p style={{ marginTop: '10px', color: '#666' }}>Connecting…</p>}
      {error !== null && (
        <p style={{ color: '#c00', marginTop: '10px', fontSize: '14px' }}>{error}</p>
      )}
    </div>
  )
}
