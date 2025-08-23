# Hướng dẫn cấu hình Formspree để gửi email thực sự

## Vấn đề hiện tại
- ✅ Supabase đã hoạt động bình thường (đã fix ANON_KEY)
- ✅ API endpoint `/api/contact` hoạt động và trả về mock response
- ❌ Email không được gửi thực sự vì thiếu `FORMSPREE_URL`

## Bước 1: Tạo tài khoản Formspree
1. Truy cập https://formspree.io/
2. Đăng ký tài khoản miễn phí
3. Tạo một form mới
4. Lấy endpoint URL (dạng: `https://formspree.io/f/YOUR_FORM_ID`)

## Bước 2: Cấu hình biến môi trường

### Trên local (.env.local)
Thêm dòng sau vào file `.env.local`:
```
FORMSPREE_URL=https://formspree.io/f/YOUR_FORM_ID
```

### Trên Vercel
1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project `guitar`
3. Vào tab **Settings** → **Environment Variables**
4. Thêm biến mới:
   - **Name**: `FORMSPREE_URL`
   - **Value**: `https://formspree.io/f/YOUR_FORM_ID`
   - **Environment**: Chọn **Production**, **Preview**, và **Development**
5. Click **Save**

## Bước 3: Redeploy
1. Vào tab **Deployments**
2. Click **Redeploy** trên deployment mới nhất
3. Chọn **Use existing Build Cache** và click **Redeploy**

## Bước 4: Test
Sau khi redeploy, test lại API:
```bash
curl -X POST https://alwaveup.cloud/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

Response sẽ có `"mock": false` thay vì `"mock": true` khi email được gửi thực sự.

## Lưu ý
- Formspree free plan cho phép 50 submissions/tháng
- Email sẽ được gửi đến địa chỉ email bạn đăng ký Formspree
- Có thể cấu hình thêm SendGrid nếu cần gửi email tùy chỉnh hơn