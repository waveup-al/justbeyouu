# Hướng dẫn Deploy Portfolio lên Domain

## 🚀 Các phương pháp Deploy

### 1. Deploy với Vercel (Khuyến nghị)

#### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

#### Bước 2: Login vào Vercel
```bash
vercel login
```

#### Bước 3: Deploy từ thư mục dự án
```bash
cd guitar
vercel --prod
```

#### Bước 4: Cấu hình Domain tùy chỉnh
1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào tab "Domains"
4. Thêm domain của bạn
5. Cấu hình DNS records theo hướng dẫn của Vercel

### 2. Deploy với Netlify

#### Bước 1: Build dự án
```bash
npm run build
```

#### Bước 2: Cài đặt Netlify CLI
```bash
npm install -g netlify-cli
```

#### Bước 3: Deploy
```bash
netlify deploy --prod --dir=.next
```

### 3. Deploy với Docker

#### Bước 1: Build Docker image
```bash
docker build -t hieu-portfolio .
```

#### Bước 2: Run container
```bash
docker run -p 3000:3000 hieu-portfolio
```

### 4. Deploy lên VPS/Server

#### Bước 1: Build dự án
```bash
npm run build
```

#### Bước 2: Upload files lên server
- Upload toàn bộ thư mục dự án lên server
- Cài đặt Node.js và npm trên server

#### Bước 3: Cài đặt dependencies và chạy
```bash
npm install --production
npm start
```

#### Bước 4: Cấu hình Nginx (tùy chọn)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Cấu hình DNS

### Cho domain chính (example.com)
```
A record: @ -> IP của server/Vercel
```

### Cho subdomain (www.example.com)
```
CNAME record: www -> example.com
```

## 📝 Checklist trước khi Deploy

- [ ] Kiểm tra tất cả dependencies đã được cài đặt
- [ ] Chạy `npm run build` để đảm bảo build thành công
- [ ] Kiểm tra các biến môi trường (nếu có)
- [ ] Test ứng dụng ở local với `npm start`
- [ ] Cấu hình domain và DNS records
- [ ] Thiết lập SSL certificate (HTTPS)

## 🌐 Biến môi trường (nếu cần)

Tạo file `.env.production`:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🔒 Bảo mật

- Đảm bảo sử dụng HTTPS
- Cấu hình CSP headers
- Kiểm tra và cập nhật dependencies thường xuyên
- Sử dụng environment variables cho sensitive data

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình deploy, hãy kiểm tra:
1. Logs của build process
2. Network và DNS configuration
3. Server resources (RAM, disk space)
4. Node.js version compatibility

---

**Lưu ý**: Portfolio này đã được tối ưu cho deployment với cấu hình `output: 'standalone'` trong Next.js và có sẵn Dockerfile cho containerization.