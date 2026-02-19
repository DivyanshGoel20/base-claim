import { useState, useMemo } from 'react'
import { SignInWithBaseButton } from '@base-org/account-ui/react'
import { createBaseAccountSDK } from '@base-org/account'
import { createWalletClient, custom } from 'viem'
import { base } from 'viem/chains'

interface SignInWithBaseProps {
  onSuccess?: (address: string) => void
}

export function SignInWithBase({ onSuccess }: SignInWithBaseProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  const sdk = useMemo(
    () =>
      createBaseAccountSDK({
        appName: 'Base Claim',
        appLogoUrl: window.location.origin + '/vite.svg',
        appChainIds: [base.id],
      }),
    []
  )

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('Button clicked, getting provider...')
      const provider = sdk.getProvider()
      
      if (!provider) {
        throw new Error(
          'Base Account extension not detected. Please install Base Account extension first.'
        )
      }

      console.log('Provider available:', !!provider)
      
      const client = createWalletClient({
        chain: base,
        transport: custom(provider),
      })

      const addresses = await client.getAddresses()
      console.log('Retrieved addresses:', addresses)
      
      if (!addresses || addresses.length === 0) {
        throw new Error('No account found. Please create an account in Base Account extension.')
      }

      const account = addresses[0]
      console.log('Sign in successful:', account)
      setUserAddress(account)
      onSuccess?.(account)
    } catch (err) {
      console.error('Sign in error:', err)
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Sign in failed. Please check the console for details.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (userAddress) {
    return (
      <div>
        <p>Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
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
      {error && (
        <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
          {error}
        </p>
      )}
      {loading && <p style={{ marginTop: '10px' }}>Connecting...</p>}
    </div>
  )
}
