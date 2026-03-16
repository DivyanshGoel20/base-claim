import express from 'express'
import cors from 'cors'
import { Errors, createClient } from '@farcaster/quick-auth'

const app = express()
const client = createClient()

const PORT = Number(process.env.PORT || 8787)
const APP_DOMAIN = process.env.APP_DOMAIN || process.env.VITE_APP_DOMAIN || 'localhost'

app.use(cors())

async function quickAuthMiddleware(req, res, next) {
  const authorization = req.header('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' })
  }

  try {
    const token = authorization.split(' ')[1]
    const payload = await client.verifyJwt({
      token,
      domain: APP_DOMAIN,
    })

    req.user = {
      fid: payload.sub,
    }

    return next()
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      console.info('Invalid token:', e.message)
      return res.status(401).json({ error: 'Invalid token' })
    }

    console.error('Unexpected error verifying Quick Auth token', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

app.get('/me', quickAuthMiddleware, (req, res) => {
  res.json(req.user)
})

app.listen(PORT, () => {
  console.log(`Quick Auth backend listening on http://localhost:${PORT}`)
  console.log(`Using APP_DOMAIN=${APP_DOMAIN}`)
})

