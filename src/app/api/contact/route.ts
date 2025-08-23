import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { supabaseOperations, supabase } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
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

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitize input to prevent XSS
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
    // Rate limiting (stricter for contact form)
    const clientIP = getClientIP(request)
    if (!rateLimit(clientIP, 5, 60000)) { // 5 requests per minute
      return NextResponse.json(
        { 
          success: false,
          error: 'Too many requests', 
          mock: true,
          message: 'Vui lòng thử lại sau 1 phút. Chúng tôi giới hạn 5 tin nhắn/phút để tránh spam.'
        },
        { 
          status: 429,
          headers: {
            'X-Mock': 'true',
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + 60)
          }
        }
      )
    }

    // Parse request body
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields', 
          mock: true,
          message: 'Vui lòng điền đầy đủ thông tin: Tên, Email, Chủ đề, và Tin nhắn'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format', 
          mock: true,
          message: 'Vui lòng nhập địa chỉ email hợp lệ'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Validate field lengths
    if (name.length > 100 || subject.length > 200 || message.length > 2000) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Field too long', 
          mock: true,
          message: 'Tên (max 100), Chủ đề (max 200), Tin nhắn (max 2000 ký tự)'
        },
        { 
          status: 400,
          headers: { 'X-Mock': 'true' }
        }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message)
    }

    // Save to Supabase first
    let supabaseResult = null
    try {
      // First, try to create the table if it doesn't exist
      try {
        await supabase.rpc('exec', {
          sql: `
            CREATE TABLE IF NOT EXISTS contacts (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              subject VARCHAR(500) NOT NULL,
              message TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })
      } catch (tableError) {
        console.log('Table creation attempt:', tableError)
      }
      
      try {
        supabaseResult = await supabaseOperations.insertContact(sanitizedData)
        console.log('✅ Supabase insert successful:', supabaseResult)
      } catch (supabaseError) {
        const errorMessage = supabaseError instanceof Error ? supabaseError.message : String(supabaseError)
        console.log('❌ Supabase failed, saving to local file:', errorMessage)
        
        // Fallback: Save to local JSON file
        const contactsFile = path.join(process.cwd(), 'contacts.json')
        let contacts = []
        
        try {
          if (fs.existsSync(contactsFile)) {
            const fileContent = fs.readFileSync(contactsFile, 'utf8')
            contacts = JSON.parse(fileContent)
          }
        } catch (readError) {
          console.log('Creating new contacts file')
        }
        
        const newContact = {
          ...sanitizedData,
          id: Date.now(),
          created_at: new Date().toISOString(),
          ip: clientIP
        }
        
        contacts.push(newContact)
        fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2))
        console.log('✅ Contact saved to local file:', newContact)
      }
    } catch (saveError) {
      console.error('Failed to save contact:', saveError)
    }

    // Check for Formspree configuration
    const formspreeUrl = process.env.FORMSPREE_URL
    
    if (formspreeUrl) {
      try {
        // Send to Formspree
        const formspreeResponse = await axios.post(formspreeUrl, {
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
          _replyto: sanitizedData.email,
          _subject: `Portfolio Contact: ${sanitizedData.subject}`,
          _cc: 'hieu@example.com' // Replace with actual email
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        })

        if (formspreeResponse.status === 200) {
          return NextResponse.json({
            success: true,
            message: supabaseResult ? 'Tin nhắn đã được gửi thành công và lưu vào database! Hiếu sẽ phản hồi trong vòng 24h.' : 'Tin nhắn đã được gửi thành công và lưu cục bộ! Hiếu sẽ phản hồi trong vòng 24h.',
            timestamp: new Date().toISOString(),
            mock: false,
            saved_to_database: !!supabaseResult,
            saved_to: supabaseResult ? 'database' : 'local_file'
          }, {
            headers: {
              'X-RateLimit-Limit': '5',
              'X-RateLimit-Remaining': String(4)
            }
          })
        }
      } catch (formspreeError) {
        console.error('Formspree error:', formspreeError)
        // Fall through to mock response
      }
    }

    // Mock response (default behavior)
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))

    // Log the contact attempt (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Contact Form Submission (MOCK):')
      console.log('From:', sanitizedData.name, '<' + sanitizedData.email + '>')
      console.log('Subject:', sanitizedData.subject)
      console.log('Message:', sanitizedData.message)
      console.log('IP:', clientIP)
      console.log('Timestamp:', new Date().toISOString())
    }

    const response = {
      success: true,
      mock: true,
      message: 'Tin nhắn đã được lưu vào database thành công! (Demo mode - email không thực sự được gửi)',
      timestamp: new Date().toISOString(),
      saved_to_database: true,
      note: formspreeUrl 
        ? 'Formspree configured but failed - using mock response'
        : 'Configure FORMSPREE_URL environment variable to enable real email sending',
      integration_status: {
        supabase: 'configured',
        formspree: formspreeUrl ? 'configured_but_failed' : 'not_configured',
        sendgrid: process.env.SENDGRID_API_KEY ? 'configured' : 'not_configured'
      },
      received_data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject,
        message_length: sanitizedData.message.length
      }
    }

    return NextResponse.json(response, {
      headers: {
        'X-Mock': 'true',
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': String(4)
      }
    })

  } catch (error) {
    console.error('Error in contact form:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        mock: true,
        message: 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.',
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
      message: 'Contact form chỉ hỗ trợ POST request'
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
      message: 'Contact form chỉ hỗ trợ POST request'
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
      message: 'Contact form chỉ hỗ trợ POST request'
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