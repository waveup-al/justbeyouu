# 🚀 Hướng dẫn Deploy Nhanh

## Phương pháp 1: Vercel (Khuyến nghị - Miễn phí)

### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Deploy
```bash
cd guitar
vercel login
vercel --prod
```

### Bước 3: Cấu hình Domain
1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project → Settings → Domains
3. Thêm domain của bạn
4. Cấu hình DNS:
   - **A Record**: `@` → `76.76.19.61`
   - **CNAME**: `www` → `cname.vercel-dns.com`

---

## Phương pháp 2: Netlify (Miễn phí)

### Deploy qua Git
1. Push code lên GitHub/GitLab
2. Vào [Netlify](https://netlify.com)
3. "New site from Git" → Chọn repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Deploy qua CLI
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=.next
```

---

## Phương pháp 3: VPS/Server

### Cài đặt trên Ubuntu/CentOS
```bash
# 1. Cài Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone và build
git clone <your-repo>
cd guitar
npm install
npm run build

# 3. Chạy với PM2
npm install -g pm2
pm2 start npm --name "portfolio" -- start
pm2 startup
pm2 save
```

### Cấu hình Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Phương pháp 4: Docker

```bash
# Build image
docker build -t hieu-portfolio .

# Chạy container
docker run -d -p 3000:3000 --name portfolio hieu-portfolio

# Với docker-compose
echo "version: '3.8'
services:
  portfolio:
    build: .
    ports:
      - '3000:3000'
    restart: unless-stopped" > docker-compose.yml

docker-compose up -d
```

---

## ⚡ Scripts Tự động

### Windows
```cmd
# Chạy file deploy.bat
deploy.bat
```

### Linux/Mac
```bash
# Chạy file deploy.sh
chmod +x deploy.sh
./deploy.sh
```

### NPM Scripts
```bash
# Build và test
npm run deploy:build

# Deploy Vercel
npm run deploy:vercel

# Deploy Netlify
npm run deploy:netlify

# Build Docker
npm run deploy:docker
```

---

## 🔧 Cấu hình DNS

### Cho Vercel
- **A**: `@` → `76.76.19.61`
- **CNAME**: `www` → `cname.vercel-dns.com`

### Cho Netlify
- **A**: `@` → `75.2.60.5`
- **CNAME**: `www` → `your-site.netlify.app`

### Cho VPS
- **A**: `@` → `IP_SERVER_CUA_BAN`
- **CNAME**: `www` → `yourdomain.com`

---

## ✅ Checklist

- [ ] Code đã được test và build thành công
- [ ] Cấu hình biến môi trường (nếu cần)
- [ ] Domain đã được cấu hình DNS
- [ ] SSL certificate đã được thiết lập
- [ ] Monitoring và analytics đã được cài đặt

---

## 🆘 Troubleshooting

### Build lỗi
```bash
npm run clean
npm install
npm run build
```

### Domain không hoạt động
1. Kiểm tra DNS propagation: [whatsmydns.net](https://whatsmydns.net)
2. Đợi 24-48h để DNS cập nhật hoàn toàn
3. Xóa cache browser (Ctrl+F5)

### Performance issues
1. Bật compression trong server
2. Cấu hình CDN
3. Optimize images và assets

---

**💡 Tip**: Vercel là lựa chọn tốt nhất cho Next.js với setup đơn giản và performance cao!