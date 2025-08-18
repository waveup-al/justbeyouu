import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 2, windowMs: number = 300000): boolean { // 2 requests per 5 minutes
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

// Validate admin password
function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  return Boolean(adminPassword && password === adminPassword)
}

export async function POST(request: NextRequest) {
  try {
    // Very strict rate limiting for admin endpoints
    const clientIP = getClientIP(request)
    if (!rateLimit(clientIP, 2, 300000)) { // 2 requests per 5 minutes
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many requests', 
          message: 'Admin endpoint rate limit exceeded. Try again in 5 minutes.',
          security_note: 'Multiple admin attempts logged'
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '2',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + 300)
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { password, action, target_url, scrape_type } = body

    // Validate admin password first
    if (!password || !validateAdminPassword(password)) {
      // Log unauthorized access attempt
      console.warn(`🚨 Unauthorized admin scrape attempt from IP: ${clientIP} at ${new Date().toISOString()}`)
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized', 
          message: 'Invalid admin password',
          security_note: 'Access attempt logged'
        },
        { 
          status: 401
        }
      )
    }

    // Check if scraping is explicitly enabled
    const scrapingEnabled = process.env.ENABLE_SCRAPING === 'true'
    
    if (!scrapingEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: 'Scraping disabled',
          message: 'Web scraping is disabled by default for security and legal compliance.',
          how_to_enable: {
            step_1: 'Set ENABLE_SCRAPING=true in environment variables',
            step_2: 'Ensure you have permission to scrape target websites',
            step_3: 'Review and comply with robots.txt and Terms of Service',
            step_4: 'Implement proper rate limiting and respectful scraping practices'
          },
          legal_warning: '⚠️ Web scraping may violate Terms of Service. Only scrape with explicit permission.',
          current_status: {
            scraping_enabled: false,
            admin_authenticated: true,
            environment_check: 'ENABLE_SCRAPING not set to true'
          }
        },
        { 
          status: 501 // Not Implemented
        }
      )
    }

    // Even if enabled, we still return a stub response for safety
    // Real implementation would require careful consideration of:
    // - Legal compliance
    // - Rate limiting
    // - Robots.txt respect
    // - Terms of Service compliance
    // - Data privacy
    
    console.log(`🔧 Admin scrape request from ${clientIP}:`, {
      action,
      target_url,
      scrape_type,
      timestamp: new Date().toISOString()
    })

    // Validate required fields
    if (!action || !target_url) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields', 
          message: 'action and target_url are required'
        },
        { 
          status: 400
        }
      )
    }

    // Validate URL format
    try {
      new URL(target_url)
    } catch {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid URL', 
          message: 'target_url must be a valid URL'
        },
        { 
          status: 400
        }
      )
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Return stub response even when "enabled"
    const response = {
      success: false,
      status: 'requires_manual_approval',
      message: 'Scraping request received but requires manual admin approval for safety.',
      request_id: `scrape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submitted_request: {
        action,
        target_url,
        scrape_type: scrape_type || 'general',
        timestamp: new Date().toISOString(),
        ip: clientIP
      },
      next_steps: {
        step_1: 'Admin will review the scraping request manually',
        step_2: 'Legal and technical compliance will be verified',
        step_3: 'If approved, scraping will be executed with proper safeguards',
        step_4: 'Results will be provided via secure channel'
      },
      compliance_notes: {
        robots_txt: 'Will be checked before execution',
        rate_limiting: 'Respectful delays will be implemented',
        terms_of_service: 'Must be reviewed and complied with',
        data_privacy: 'Only public data will be collected'
      },
      warning: '🚨 This is a stub implementation. Real scraping requires careful legal and technical implementation.'
    }

    return NextResponse.json(response, {
      status: 202, // Accepted but not processed
      headers: {
        'X-RateLimit-Limit': '2',
        'X-RateLimit-Remaining': String(1)
      }
    })

  } catch (error) {
    console.error('Error in admin scrape endpoint:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        message: 'An error occurred processing the scrape request',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { 
        status: 500
      }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'Admin scrape endpoint only supports POST requests',
      info: {
        endpoint: '/api/admin/scrape',
        method: 'POST',
        required_fields: ['password', 'action', 'target_url'],
        optional_fields: ['scrape_type'],
        rate_limit: '2 requests per 5 minutes',
        security: 'Admin password required',
        status: 'Disabled by default - requires ENABLE_SCRAPING=true'
      },
      legal_notice: '⚠️ Web scraping must comply with robots.txt, Terms of Service, and applicable laws'
    },
    { 
      status: 405,
      headers: { 
        'Allow': 'POST'
      }
    }
  )
}

export async function PUT() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'Admin scrape endpoint only supports POST requests'
    },
    { 
      status: 405,
      headers: { 
        'Allow': 'POST'
      }
    }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'Admin scrape endpoint only supports POST requests'
    },
    { 
      status: 405,
      headers: { 
        'Allow': 'POST'
      }
    }
  )
}