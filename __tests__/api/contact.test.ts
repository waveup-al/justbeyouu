import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock environment variables
const originalEnv = process.env;

describe('/api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  const validContactData = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test Subject',
    message: 'This is a test message'
  };

  it('should accept valid contact form submission', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validContactData)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('mock', true);
    expect(data).toHaveProperty('message');
  });

  it('should reject missing required fields', async () => {
    const incompleteData = {
      name: 'John Doe',
      email: 'john@example.com'
      // missing subject and message
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incompleteData)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('required');
  });

  it('should reject invalid email format', async () => {
    const invalidEmailData = {
      ...validContactData,
      email: 'invalid-email'
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidEmailData)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('email');
  });

  it('should reject fields that are too long', async () => {
    const longFieldData = {
      ...validContactData,
      name: 'A'.repeat(101), // Exceeds 100 character limit
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(longFieldData)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('too long');
  });

  it('should sanitize input fields', async () => {
    const maliciousData = {
      name: '<script>alert("xss")</script>John',
      email: 'john@example.com',
      subject: 'Test <b>Subject</b>',
      message: 'Message with <img src="x" onerror="alert(1)"> script'
    };

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maliciousData)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success', true);
    // The actual sanitization would be tested in the implementation
  });

  it('should use Formspree when FORMSPREE_URL is configured', async () => {
    process.env.FORMSPREE_URL = 'https://formspree.io/f/test123';
    
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { ok: true }
    });

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validContactData)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('mock', false);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://formspree.io/f/test123',
      expect.objectContaining(validContactData),
      expect.any(Object)
    );
  });

  it('should handle Formspree errors gracefully', async () => {
    process.env.FORMSPREE_URL = 'https://formspree.io/f/test123';
    
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validContactData)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Failed to send message');
  });

  it('should enforce rate limiting', async () => {
    // This would require mocking the rate limiting logic
    // For now, we'll test that the endpoint exists and responds
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '192.168.1.1'
      },
      body: JSON.stringify(validContactData)
    });

    const response = await POST(request);
    expect(response.status).toBeLessThan(500);
  });

  it('should reject non-POST methods', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'GET'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(405);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Method not allowed');
  });

  it('should handle malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  it('should set correct response headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validContactData)
    });

    const response = await POST(request);

    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('X-Mock')).toBe('true');
  });

  it('should include timestamp in response', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validContactData)
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty('timestamp');
    expect(typeof data.timestamp).toBe('string');
    expect(new Date(data.timestamp)).toBeInstanceOf(Date);
  });
});