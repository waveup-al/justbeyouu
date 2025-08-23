# Audio Assets

Đây là thư mục chứa các file audio cho MusicWidget.

## Cách thêm file audio:

1. Đặt file audio của bạn vào thư mục này
2. Cập nhật đường dẫn trong `src/components/MusicWidget.tsx`:

```javascript
const currentTrack = {
  title: 'Tên bài hát',
  artist: 'Tên nghệ sĩ',
  src: '/assets/ten-file-audio.mp3'
}
```

## Định dạng được hỗ trợ:
- MP3 (khuyến nghị)
- WAV
- OGG
- M4A

## Lưu ý:
- File audio nên có kích thước nhỏ để tải nhanh
- Đảm bảo bạn có quyền sử dụng file audio
- Tên file không nên chứa ký tự đặc biệt hoặc khoảng trắng