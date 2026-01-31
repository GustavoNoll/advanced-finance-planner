import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const frontendUrl = process.env.FRONTEND_URL || '*'
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', frontendUrl)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    return res.json({ 
      message: 'Backend API is working!',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      method: 'GET'
    })
  }

  if (req.method === 'POST') {
    return res.json({ 
      message: 'POST request received',
      body: req.body,
      timestamp: new Date().toISOString(),
      method: 'POST'
    })
  }

  return res.status(405).json({ 
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST', 'OPTIONS']
  })
}
