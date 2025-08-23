# 🦊 Nguyễn Công Hiếu - Portfolio

> Desktop-like personal playground với dark + glass + neon + warm amber theme

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
npm run test:e2e
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 🎯 Features

- ✅ **Hero Section**: Terminal-style welcome with blinking cursor
- ✅ **Left Dock**: Keyboard accessible navigation (Alt + 1-4)
- ✅ **Music Widget**: Frontend-only player with local audio
- ✅ **Projects Grid**: Interactive cards with demo modals
- ✅ **About Section**: Personal info, skills, interests
- ✅ **Contact Form**: Formspree integration + mock fallback
- ✅ **Fox Mascot**: Animated mascot with Easter egg panel
- ✅ **Glass Effects**: Backdrop blur with neon accents
- ✅ **Responsive Design**: Mobile-friendly layout
- ✅ **SEO Optimized**: Next-SEO, Open Graph, JSON-LD
- ✅ **Accessibility**: ARIA labels, keyboard navigation, skip links

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Custom CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **SEO**: next-seo
- **Testing**: Jest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/                 # API routes (all mocked by default)
│   │   │   ├── projects/        # GET /api/projects
│   │   │   ├── contact/         # POST /api/contact
│   │   │   ├── sms/             # POST /api/sms
│   │   │   ├── demo/
│   │   │   │   ├── gmaps-search/ # GET /api/demo/gmaps-search
│   │   │   │   └── trade-report/ # GET /api/demo/trade-report
│   │   │   └── admin/
│   │   │       └── scrape/      # POST /api/admin/scrape (disabled)
│   │   ├── globals.css          # Global styles + animations
│   │   ├── layout.tsx           # Root layout with SEO
│   │   └── page.tsx             # Main page
│   └── components/
│       ├── Hero.tsx             # Terminal-style hero section
│       ├── Dock.tsx             # Left navigation dock
│       ├── MusicWidget.tsx      # Audio player widget
│       ├── ProjectsSection.tsx  # Projects grid + demo modal
│       ├── AboutSection.tsx     # About me section
│       ├── ContactSection.tsx   # Contact form
│       ├── FoxMascot.tsx        # Animated fox mascot
│       └── EasterEggPanel.tsx   # Hidden easter egg panel
├── assets/
│   ├── sample.mp3               # Audio file for music widget
│   └── CV_Nguyen_Cong_Hieu.pdf  # Resume/CV file
├── seed/
│   └── projects.json            # Project data (Vietnamese)
├── __tests__/                   # Jest unit tests
├── e2e/                         # Playwright E2E tests
└── .github/workflows/ci.yml     # GitHub Actions CI
```

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and configure as needed:

```bash
cp .env.example .env.local
```

### Available Integrations

| Variable | Purpose | Status |
|----------|---------|--------|
| `GOOGLE_PLACES_API_KEY` | Google Maps search | 🟡 Optional |
| `TWILIO_SID` | SMS sending | 🟡 Optional |
| `TWILIO_TOKEN` | SMS authentication | 🟡 Optional |
| `TWILIO_FROM` | SMS sender number | 🟡 Optional |
| `SENDGRID_API_KEY` | Email sending | 🟡 Optional |
| `AMAZON_PA_API_KEYS` | Amazon product data | 🟡 Optional |
| `FORMSPREE_URL` | Contact form handling | 🟡 Optional |
| `ADMIN_PASSWORD` | Admin scraper access | 🔴 Security |
| `ENABLE_SCRAPING` | Enable scraper (set to 'true') | 🔴 Disabled |
| `NEXT_PUBLIC_SITE_URL` | Site URL for SEO | 🟢 Recommended |

## 🎮 API Endpoints

### Mock APIs (Always Available)

```bash
# Get projects list
curl http://localhost:3000/api/projects

# Search Google Maps (mock)
curl "http://localhost:3000/api/demo/gmaps-search?q=restaurant"

# Get trade report (mock)
curl "http://localhost:3000/api/demo/trade-report?symbol=AAPL"

# Send contact message
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Hello","message":"Test message"}'

# Send SMS (mock)
curl -X POST http://localhost:3000/api/sms \
  -H "Content-Type: application/json" \
  -d '{"phone":"0901234567","message":"Test SMS"}'
```

All responses include `"mock": true` and `X-Mock: true` header.

### Admin Endpoints (Restricted)

```bash
# Scraper endpoint (disabled by default)
curl -X POST http://localhost:3000/api/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{"password":"admin_password","action":"scrape","target_url":"https://example.com"}'
```

## 🔒 Security & Legal Notes

### ⚠️ Web Scraping Disclaimer

**The scraper functionality is DISABLED by default** for legal and ethical reasons:

- Web scraping may violate Terms of Service
- Always check `robots.txt` before scraping
- Respect rate limits and server resources
- Only scrape with explicit permission
- Consider legal implications in your jurisdiction

### To Enable Scraping (Admin Only)

1. Set `ENABLE_SCRAPING=true` in environment
2. Set `ADMIN_PASSWORD` to a secure password
3. Review target website's ToS and robots.txt
4. Implement proper rate limiting
5. Use responsibly and legally

### Rate Limiting

- **General APIs**: 10 requests/minute
- **Contact Form**: 5 requests/minute
- **SMS API**: 3 requests/minute
- **Admin Scraper**: 2 requests/5 minutes

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
# Using Vercel CLI
npm i -g vercel
vercel
```

### Docker (Optional)

```bash
# Build image
docker build -t hieu-portfolio .

# Run container
docker run -p 3000:3000 hieu-portfolio
```

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

## 📋 Feature Checklist

### ✅ Implemented
- [x] Next.js 14 with App Router
- [x] TypeScript configuration
- [x] TailwindCSS with custom theme
- [x] Framer Motion animations
- [x] Responsive design
- [x] SEO optimization
- [x] Accessibility features
- [x] Mock API endpoints
- [x] Rate limiting
- [x] Error handling
- [x] Security measures
- [x] Testing setup
- [x] CI/CD pipeline
- [x] Docker support

### 🔴 Optional Configuration
- [ ] Real Google Places API
- [ ] Real Twilio SMS
- [ ] Real SendGrid email
- [ ] Real Amazon Product API
- [ ] Real trading data API
- [ ] Production scraper (if needed)

## 🎨 Customization

### Colors (tailwind.config.js)
```javascript
colors: {
  'dark-bg': '#0b0b14',
  'neon-cyan': '#4ee1ff',
  'neon-purple': '#7b61ff',
  'warm-amber': '#f2a900',
  'teal-accent': '#1fb6b3'
}
```

### Fonts
- **Mono**: JetBrains Mono (terminal, code)
- **Body**: Inter (general text)
- **Display**: Space Mono (headings)

### Animations
- **Cursor**: 600ms blink
- **Cards**: Hover lift + scale
- **Mascot**: Breathing + periodic strum
- **Glass**: Backdrop blur effects

## 🐛 Troubleshooting

### Common Issues

1. **Audio not playing**: Replace `assets/sample.mp3` with a real audio file
2. **CV download fails**: Replace `assets/CV_Nguyen_Cong_Hieu.pdf` with real PDF
3. **API errors**: Check console for detailed error messages
4. **Build fails**: Ensure all dependencies are installed (`npm install`)
5. **Tests fail**: Run `npm run test:update` to update snapshots

### Development Tips

- Use `npm run dev` for hot reloading
- Check browser console for errors
- Use React DevTools for component debugging
- Monitor network tab for API calls
- Test responsive design with device emulation

## 📞 Support

For questions or issues:
- Check the troubleshooting section above
- Review the code comments for implementation details
- Test with mock data first before enabling real integrations
- Ensure all environment variables are properly configured

## 📄 License

This project is for portfolio demonstration purposes. Please respect third-party service terms when enabling real integrations.

---

**Made with ❤️ by Nguyễn Công Hiếu** 🦊🎸🍺