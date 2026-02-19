import React, { useState, useMemo } from 'react'
import { SignInWithBaseButton } from '@base-org/account-ui/react'
import { createBaseAccountSDK } from '@base-org/account'
import { createWalletClient, custom } from 'viem'
import { base } from 'viem/chains'

export interface SignedInUser {
  address: `0x${string}`
  timestamp: number
}

interface SignInWithBaseProps {
  onSignIn: (user: SignedInUser) => void
  onSignOut?: () => void
}

export function SignInWithBase({ onSignIn, onSignOut }: SignInWithBaseProps): React.ReactElement {
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

      const user: SignedInUser = {
        address: account,
        timestamp: Date.now(),
      }
      
      console.log('Signed in:', account, signature)
      onSignIn(user)
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
