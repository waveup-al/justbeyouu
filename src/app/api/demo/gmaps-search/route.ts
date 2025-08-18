import { NextRequest, NextResponse } from 'next/server'

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

// Mock data generator
function generateMockResults(query: string) {
  const mockBusinesses = [
    {
      id: 'mock_001',
      name: `${query} - Doanh nghiệp A`,
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      phone: '+84 28 1234 5678',
      email: 'contact@business-a.com',
      website: 'https://business-a.com',
      rating: 4.5,
      reviews: 128,
      category: 'Nhà hàng',
      status: 'Đang hoạt động',
      coordinates: { lat: 10.7769, lng: 106.7009 }
    },
    {
      id: 'mock_002', 
      name: `${query} - Công ty B`,
      address: '456 Lê Lợi, Quận 1, TP.HCM',
      phone: '+84 28 2345 6789',
      email: 'info@company-b.vn',
      website: 'https://company-b.vn',
      rating: 4.2,
      reviews: 89,
      category: 'Dịch vụ',
      status: 'Đang hoạt động',
      coordinates: { lat: 10.7756, lng: 106.7019 }
    },
    {
      id: 'mock_003',
      name: `${query} - Cửa hàng C`,
      address: '789 Đồng Khởi, Quận 1, TP.HCM',
      phone: '+84 28 3456 7890',
      email: 'shop@store-c.com',
      website: null,
      rating: 3.8,
      reviews: 45,
      category: 'Bán lẻ',
      status: 'Tạm đóng cửa',
      coordinates: { lat: 10.7743, lng: 106.7025 }
    }
  ]

  return mockBusinesses.slice(0, Math.floor(Math.random() * 3) + 1)
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (!rateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Too many requests', 
          mock: true,
          message: 'Vui lòng thử lại sau 1 phút'
        },
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

    // Get query parameter
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Missing query parameter', 
          mock: true,
          message: 'Vui lòng cung cấp từ khóa tìm kiếm (?q=keyword)'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Check if real Google Places API is configured
    const hasRealAPI = process.env.GOOGLE_PLACES_API_KEY
    
    if (hasRealAPI) {
      // TODO: Implement real Google Places API integration
      // For now, still return mock data with a note
      console.log('Google Places API key found, but using mock data for safety')
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

    // Generate mock results
    const results = generateMockResults(query.trim())

    const response = {
      query: query.trim(),
      results,
      total: results.length,
      mock: true,
      timestamp: new Date().toISOString(),
      note: hasRealAPI 
        ? 'Google Places API key detected but mock mode active for safety'
        : 'Using mock data - configure GOOGLE_PLACES_API_KEY to enable real search',
      integration_status: {
        google_places_api: hasRealAPI ? 'configured_but_mocked' : 'not_configured',
        auto_email: process.env.SENDGRID_API_KEY ? 'configured' : 'not_configured',
        auto_sms: process.env.TWILIO_SID ? 'configured' : 'not_configured'
      }
    }

    return NextResponse.json(response, {
      headers: {
        'X-Mock': 'true',
        'Cache-Control': 'no-cache', // Don't cache search results
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': String(9), // Simplified for demo
      }
    })

  } catch (error) {
    console.error('Error in gmaps-search:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        mock: true,
        message: 'Đã xảy ra lỗi khi tìm kiếm',
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
    { 
      error: 'Method not allowed', 
      mock: true,
      message: 'Chỉ hỗ trợ GET request'
    },
    { 
      status: 405,
      headers: { 
        'X-Mock': 'true',
        'Allow': 'GET'
      }
    }
  )
}