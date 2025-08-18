import { GET } from '@/app/api/projects/route';
import { NextRequest } from 'next/server';

// Mock the projects data
jest.mock('fs', () => ({
  readFileSync: jest.fn(() => JSON.stringify([
    {
      id: 'test-project-1',
      title: 'Test Project 1',
      shortDescription: 'AI Agent thu thập thông tin khách hàng bằng 1 click trên google maps - tự động gửi mail, SMS.',
      longDescription: 'Detailed description of test project 1',
      badges: ['AI', 'Automation'],
      status: 'completed',
      demoUrl: 'https://demo1.example.com',
      repoUrl: 'https://github.com/test/project1',
      screenshots: ['screenshot1.jpg'],
      technologies: ['Next.js', 'TypeScript']
    },
    {
      id: 'test-project-2',
      title: 'Test Project 2',
      shortDescription: 'Trợ lý Agent hỗ trợ phân tích đầu tư - trade.',
      longDescription: 'Detailed description of test project 2',
      badges: ['Trading', 'AI'],
      status: 'in-progress',
      demoUrl: 'https://demo2.example.com',
      repoUrl: 'https://github.com/test/project2',
      screenshots: ['screenshot2.jpg'],
      technologies: ['Python', 'FastAPI']
    }
  ]))
}));

describe('/api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return projects data successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('projects');
    expect(data).toHaveProperty('mock', true);
    expect(data).toHaveProperty('timestamp');
    expect(Array.isArray(data.projects)).toBe(true);
    expect(data.projects).toHaveLength(2);
  });

  it('should return projects with correct structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);
    const data = await response.json();

    const project = data.projects[0];
    expect(project).toHaveProperty('id');
    expect(project).toHaveProperty('title');
    expect(project).toHaveProperty('shortDescription');
    expect(project).toHaveProperty('longDescription');
    expect(project).toHaveProperty('badges');
    expect(project).toHaveProperty('status');
    expect(project).toHaveProperty('demoUrl');
    expect(project).toHaveProperty('repoUrl');
    expect(project).toHaveProperty('screenshots');
    expect(project).toHaveProperty('technologies');
  });

  it('should include Vietnamese descriptions', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);
    const data = await response.json();

    const project1 = data.projects.find((p: any) => p.id === 'test-project-1');
    const project2 = data.projects.find((p: any) => p.id === 'test-project-2');

    expect(project1.shortDescription).toBe('AI Agent thu thập thông tin khách hàng bằng 1 click trên google maps - tự động gửi mail, SMS.');
    expect(project2.shortDescription).toBe('Trợ lý Agent hỗ trợ phân tích đầu tư - trade.');
  });

  it('should include mock indicator', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(data.mock).toBe(true);
    expect(response.headers.get('X-Mock')).toBe('true');
  });

  it('should include timestamp', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toHaveProperty('timestamp');
    expect(typeof data.timestamp).toBe('string');
    expect(new Date(data.timestamp)).toBeInstanceOf(Date);
  });

  it('should handle file read errors gracefully', async () => {
    // Mock fs.readFileSync to throw an error
    const fs = require('fs');
    fs.readFileSync.mockImplementationOnce(() => {
      throw new Error('File not found');
    });

    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Failed to load projects');
  });

  it('should handle invalid JSON gracefully', async () => {
    // Mock fs.readFileSync to return invalid JSON
    const fs = require('fs');
    fs.readFileSync.mockImplementationOnce(() => 'invalid json');

    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Failed to load projects');
  });

  it('should set correct headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/projects');
    const response = await GET(request);

    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('X-Mock')).toBe('true');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300');
  });
});