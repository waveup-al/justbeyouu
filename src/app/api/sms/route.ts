import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 3, windowMs: number = 60000): boolean {
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

// Validate Vietnamese phone number
function isValidVietnamesePhone(phone: string): boolean {
  // Vietnamese phone number patterns
  const phoneRegex = /^(\+84|84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

// Sanitize input
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'&]/g, (char) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      }
      return entities[char] || char
    })
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (very strict for SMS)
    const clientIP = getClientIP(request)
    if (!rateLimit(clientIP, 3, 60000)) { // 3 SMS per minute
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many requests', 
          mock: true,
          message: 'Vui lòng thử lại sau 1 phút. Chúng tôi giới hạn 3 SMS/phút để tránh spam.'
        },
        { 
          status: 429,
          headers: {
            'X-Mock': 'true',
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + 60)
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { phone, message, type = 'notification' } = body

    // Validate required fields
    if (!phone || !message) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields', 
          mock: true,
          message: 'Vui lòng cung cấp số điện thoại và nội dung tin nhắn'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Validate phone number
    if (!isValidVietnamesePhone(phone)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid phone number', 
          mock: true,
          message: 'Vui lòng nhập số điện thoại Việt Nam hợp lệ (VD: 0901234567)'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Validate message length
    if (message.length > 160) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Message too long', 
          mock: true,
          message: 'Tin nhắn SMS không được vượt quá 160 ký tự'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      phone: sanitizeInput(phone),
      message: sanitizeInput(message),
      type: sanitizeInput(type)
    }

    // Check for Twilio configuration
    const hasTwilio = process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_FROM
    
    if (hasTwilio) {
      // TODO: Implement real Twilio SMS integration
      // For security and cost reasons, we keep this mocked even with credentials
      console.log('Twilio credentials found, but SMS sending is disabled for safety')
    }

    // Mock response (always return mock for safety)
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

    // Log the SMS attempt (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 SMS Send Attempt (MOCK):')
      console.log('To:', sanitizedData.phone)
      console.log('Message:', sanitizedData.message)
      console.log('Type:', sanitizedData.type)
      console.log('IP:', clientIP)
      console.log('Timestamp:', new Date().toISOString())
    }

    // Generate mock SMS ID
    const mockSmsId = `mock_sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const response = {
      success: true,
      mock: true,
      message: 'SMS đã được gửi thành công! (Demo mode - SMS không thực sự được gửi)',
      sms_id: mockSmsId,
      timestamp: new Date().toISOString(),
      cost_estimate: '0.05 USD', // Mock cost
      delivery_status: 'queued',
      note: hasTwilio 
        ? 'Twilio credentials detected but SMS sending disabled for safety and cost control'
        : 'Configure TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM to enable real SMS sending',
      warning: '⚠️ SMS thực tế có thể tốn phí. Chỉ bật khi cần thiết và có kiểm soát chi phí.',
      integration_status: {
        twilio: hasTwilio ? 'configured_but_disabled' : 'not_configured',
        rate_limit: 'active',
        cost_control: 'enabled'
      },
      sent_data: {
        phone: sanitizedData.phone.replace(/.(?=.{4})/g, '*'), // Mask phone number
        message_length: sanitizedData.message.length,
        type: sanitizedData.type
      }
    }

    return NextResponse.json(response, {
      headers: {
        'X-Mock': 'true',
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': String(2)
      }
    })

  } catch (error) {
    console.error('Error in SMS API:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        mock: true,
        message: 'Đã xảy ra lỗi khi gửi SMS. Vui lòng thử lại sau.',
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
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed', 
      mock: true,
      message: 'SMS API chỉ hỗ trợ POST request',
      info: {
        endpoint: '/api/sms',
        method: 'POST',
        required_fields: ['phone', 'message'],
        optional_fields: ['type'],
        rate_limit: '3 requests per minute',
        phone_format: 'Vietnamese phone numbers (0901234567)'
      }
    },
    { 
      status: 405,
      headers: { 
        'X-Mock': 'true',
        'Allow': 'POST'
      }
    }
  )
}

export async function PUT() {
  return NextResponse.json(
    { 
      error: 'Method not allowed', 
      mock: true,
      message: 'SMS API chỉ hỗ trợ POST request'
    },
    { 
      status: 405,
      headers: { 
        'X-Mock': 'true',
        'Allow': 'POST'
      }
    }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { 
      error: 'Method not allowed', 
      mock: true,
      message: 'SMS API chỉ hỗ trợ POST request'
    },
    { 
      status: 405,
      headers: { 
        'X-Mock': 'true',
        'Allow': 'POST'
      }
    }
  )
}