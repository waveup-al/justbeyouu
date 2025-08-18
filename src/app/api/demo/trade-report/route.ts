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

// Mock data generator for trade reports
function generateMockTradeReport(symbol: string) {
  const basePrice = Math.random() * 1000 + 100 // Random price between 100-1100
  const change = (Math.random() - 0.5) * 20 // Random change between -10 to +10
  const changePercent = (change / basePrice) * 100
  
  const mockReport = {
    symbol: symbol.toUpperCase(),
    company_name: `${symbol.toUpperCase()} Corporation`,
    current_price: Number((basePrice + change).toFixed(2)),
    previous_close: Number(basePrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    change_percent: Number(changePercent.toFixed(2)),
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    market_cap: `${(Math.random() * 500 + 50).toFixed(1)}B`,
    pe_ratio: Number((Math.random() * 30 + 5).toFixed(2)),
    
    // Technical indicators (mock)
    technical_analysis: {
      rsi: Number((Math.random() * 100).toFixed(1)),
      macd: {
        value: Number((Math.random() * 2 - 1).toFixed(3)),
        signal: Number((Math.random() * 2 - 1).toFixed(3)),
        histogram: Number((Math.random() * 1 - 0.5).toFixed(3))
      },
      moving_averages: {
        sma_20: Number((basePrice * (0.95 + Math.random() * 0.1)).toFixed(2)),
        sma_50: Number((basePrice * (0.9 + Math.random() * 0.2)).toFixed(2)),
        ema_12: Number((basePrice * (0.98 + Math.random() * 0.04)).toFixed(2))
      },
      support_resistance: {
        support: Number((basePrice * 0.9).toFixed(2)),
        resistance: Number((basePrice * 1.1).toFixed(2))
      }
    },
    
    // AI Analysis (mock)
    ai_analysis: {
      sentiment: Math.random() > 0.5 ? 'Tích cực' : Math.random() > 0.3 ? 'Trung tính' : 'Tiêu cực',
      recommendation: Math.random() > 0.6 ? 'MUA' : Math.random() > 0.3 ? 'GIỮ' : 'BÁN',
      confidence_score: Number((Math.random() * 40 + 60).toFixed(1)), // 60-100%
      key_factors: [
        'Báo cáo tài chính quý gần đây tích cực',
        'Xu hướng thị trường tổng thể ổn định',
        'Khối lượng giao dịch tăng mạnh',
        'Chỉ số kỹ thuật cho tín hiệu tích cực'
      ].slice(0, Math.floor(Math.random() * 3) + 2)
    },
    
    // Risk assessment
    risk_assessment: {
      volatility: Math.random() > 0.7 ? 'Cao' : Math.random() > 0.4 ? 'Trung bình' : 'Thấp',
      beta: Number((Math.random() * 2 + 0.5).toFixed(2)),
      var_1day: Number((basePrice * 0.02 * Math.random()).toFixed(2)), // 1-day Value at Risk
      sharpe_ratio: Number((Math.random() * 2 + 0.5).toFixed(2))
    },
    
    // Recent news (mock)
    recent_news: [
      {
        title: `${symbol.toUpperCase()} công bố kết quả kinh doanh quý mới`,
        summary: 'Doanh thu tăng trưởng mạnh so với cùng kỳ năm trước',
        sentiment: 'positive',
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: `Phân tích: Triển vọng ${symbol.toUpperCase()} trong quý tới`,
        summary: 'Các chuyên gia đưa ra dự báo về hiệu suất cổ phiếu',
        sentiment: 'neutral',
        date: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ]
  }
  
  return mockReport
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

    // Get symbol parameter
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol || symbol.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Missing symbol parameter', 
          mock: true,
          message: 'Vui lòng cung cấp mã cổ phiếu (?symbol=AAPL)'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Validate symbol format (basic)
    if (!/^[A-Za-z]{1,5}$/.test(symbol.trim())) {
      return NextResponse.json(
        { 
          error: 'Invalid symbol format', 
          mock: true,
          message: 'Mã cổ phiếu phải là 1-5 ký tự chữ cái'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Check if real trading API is configured
    const hasRealAPI = process.env.TRADING_API_KEY || process.env.ALPHA_VANTAGE_API_KEY
    
    if (hasRealAPI) {
      // TODO: Implement real trading API integration
      // For now, still return mock data with a note
      console.log('Trading API key found, but using mock data for safety')
    }

    // Simulate API delay (real trading APIs can be slow)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 800))

    // Generate mock trade report
    const report = generateMockTradeReport(symbol.trim())

    const response = {
      report,
      mock: true,
      timestamp: new Date().toISOString(),
      generated_at: new Date().toLocaleString('vi-VN'),
      note: hasRealAPI 
        ? 'Trading API key detected but mock mode active for safety'
        : 'Using mock data - configure TRADING_API_KEY to enable real market data',
      disclaimer: 'Đây là dữ liệu mô phỏng. Không sử dụng cho quyết định đầu tư thực tế.',
      integration_status: {
        trading_api: hasRealAPI ? 'configured_but_mocked' : 'not_configured',
        ai_analysis: 'mock_enabled',
        news_feed: 'mock_enabled'
      }
    }

    return NextResponse.json(response, {
      headers: {
        'X-Mock': 'true',
        'Cache-Control': 'no-cache', // Don't cache trading data
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': String(9), // Simplified for demo
      }
    })

  } catch (error) {
    console.error('Error in trade-report:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        mock: true,
        message: 'Đã xảy ra lỗi khi tạo báo cáo trade',
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