import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const key = ip
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!rateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests', mock: true },
        { 
          status: 429,
          headers: {
            'X-Mock': 'true',
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + 60)
          }
        }
      )
    }

    // Read projects from seed data
    const projectsPath = path.join(process.cwd(), 'seed', 'projects.json')
    
    if (!fs.existsSync(projectsPath)) {
      return NextResponse.json(
        { error: 'Projects data not found', mock: true },
        { 
          status: 404,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    const projectsData = fs.readFileSync(projectsPath, 'utf8')
    const data = JSON.parse(projectsData)
    const projects = data.projects || data

    // Add mock indicator and timestamp
    const response = {
      projects,
      mock: true,
      timestamp: new Date().toISOString(),
      total: projects.length
    }

    return NextResponse.json(response, {
      headers: {
        'X-Mock': 'true',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': String(9), // Simplified for demo
      }
    })

  } catch (error) {
    console.error('Error reading projects:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to load projects', 
        mock: true,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { 
        status: 500,
        headers: { 'X-Mock': 'true' }
      }
    )
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed', mock: true },
    { 
      status: 405,
      headers: { 
        'X-Mock': 'true',
        'Allow': 'GET'
      }
    }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed', mock: true },
    { 
      status: 405,
      headers: { 
        'X-Mock': 'true',
        'Allow': 'GET'
      }
    }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed', mock: true },
    { 
      status: 405,
      headers: { 
        'X-Mock': 'true',
        'Allow': 'GET'
      }
    }
  )
}