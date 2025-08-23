# 🔧 Hướng dẫn cấu hình biến môi trường Vercel

## 🚨 Vấn đề hiện tại

Website hoạt động đúng trên localhost nhưng không hoạt động trên production (alwaveup.cloud). Nguyên nhân chính là **thiếu biến môi trường Supabase** trên Vercel.

## 📋 Các biến môi trường cần thiết

Dựa trên file `.env.example`, bạn cần cấu hình 3 biến môi trường Supabase sau trên Vercel:

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://cfzujrnevpaumjlzpwnd.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmenVqcm5ldnBhdW1qbHpwd25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTk0MzksImV4cCI6MjA3MTMzNTQzOX0.qJZvvKQN5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5
```

### 3. SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmenVqcm5ldnBhdW1qbHpwd25kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc1OTQzOSwiZXhwIjoyMDcxMzM1NDM5fQ.AZYlTbLWPUd8t0AxbOPjfMaIbTiXswz3oepsWypbICQ
```

## 🔧 Cách cấu hình trên Vercel Dashboard

### Bước 1: Truy cập Vercel Dashboard
1. Đi tới [vercel.com](https://vercel.com)
2. Đăng nhập vào tài khoản của bạn
3. Tìm và click vào project **justbeyouu** hoặc **alwaveup**

### Bước 2: Vào Settings
1. Trong project dashboard, click tab **Settings**
2. Ở sidebar bên trái, click **Environment Variables**

### Bước 3: Thêm biến môi trường
Thêm từng biến một:

#### Biến 1: NEXT_PUBLIC_SUPABASE_URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://cfzujrnevpaumjlzpwnd.supabase.co`
- **Environment**: Chọn **Production**, **Preview**, và **Development**
- Click **Save**

#### Biến 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmenVqcm5ldnBhdW1qbHpwd25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTk0MzksImV4cCI6MjA3MTMzNTQzOX0.qJZvvKQN5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z5`
- **Environment**: Chọn **Production**, **Preview**, và **Development**
- Click **Save**

#### Biến 3: SUPABASE_SERVICE_ROLE_KEY
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmenVqcm5ldnBhdW1qbHpwd25kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc1OTQzOSwiZXhwIjoyMDcxMzM1NDM5fQ.AZYlTbLWPUd8t0AxbOPjfMaIbTiXswz3oepsWypbICQ`
- **Environment**: Chọn **Production**, **Preview**, và **Development**
- Click **Save**

### Bước 4: Redeploy
Sau khi thêm xong tất cả biến môi trường:
1. Vào tab **Deployments**
2. Tìm deployment mới nhất
3. Click vào menu 3 chấm (...) bên cạnh
4. Chọn **Redeploy**
5. Chọn **Use existing Build Cache** (nhanh hơn)
6. Click **Redeploy**

## 🧪 Kiểm tra sau khi cấu hình

### 1. Sử dụng Debug Tool
Truy cập: https://alwaveup.cloud/debug-production.html

**Debug tool này sẽ giúp bạn:**
- Kiểm tra environment variables có được load không
- Test API endpoint `/api/contact` trực tiếp
- Xem network requests và console logs
- Phát hiện lỗi cụ thể

### 2. Test Contact Form
Sau khi redeploy xong (khoảng 2-3 phút):
1. Vào https://alwaveup.cloud
2. Thử gửi contact form
3. Kiểm tra xem có thông báo thành công không

### 3. Kiểm tra Console
Mở Developer Tools (F12) và kiểm tra:
- **Console tab**: Không có lỗi JavaScript
- **Network tab**: API calls thành công (status 200)

## 🔍 Troubleshooting

### Nếu vẫn không hoạt động:

1. **Kiểm tra biến môi trường đã được set chưa:**
   - Vào Vercel Settings > Environment Variables
   - Đảm bảo cả 3 biến đều có mặt
   - Đảm bảo không có khoảng trắng thừa

2. **Kiểm tra deployment:**
   - Vào tab Deployments
   - Đảm bảo deployment mới nhất có status "Ready"
   - Nếu có lỗi, click vào để xem chi tiết

3. **Clear cache:**
   - Xóa cache browser (Ctrl+F5)
   - Thử truy cập từ incognito/private mode

4. **Sử dụng debug tool:**
   - Truy cập https://alwaveup.cloud/debug-production.html
   - Chạy test và xem kết quả chi tiết

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề, hãy:
1. Chụp screenshot Vercel Environment Variables page
2. Chụp screenshot kết quả từ debug tool
3. Gửi console errors (nếu có)

---

**Lưu ý quan trọng:** 
- Biến `NEXT_PUBLIC_*` sẽ được embed vào client-side code
- Biến `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng server-side
- Sau khi thay đổi biến môi trường, **bắt buộc phải redeploy**

**Thời gian ước tính:** 5-10 phút để cấu hình + 2-3 phút để redeploy