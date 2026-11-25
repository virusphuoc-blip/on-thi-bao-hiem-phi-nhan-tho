# Ôn Thi Bảo Hiểm Phi Nhân Thọ

Web app miễn phí ôn thi chứng chỉ đại lý bảo hiểm phi nhân thọ: thi thử có giờ, ôn theo chủ đề, flashcard, câu hay sai, bảng mẹo nhớ, tìm kiếm và thống kê. Không backend; tiến độ lưu trong localStorage.

## Chạy

```bash
npm install
npm run dev      # chạy thử
npm test         # unit test
npm run lint
npm run build
```

## Chỉnh cấu hình

`src/config.js`: số câu mỗi đề, thời gian thi (phút), ngưỡng đạt (%), số câu tối thiểu để hiện chủ đề yếu nhất.

## Dữ liệu

- `data/`: file nguồn (PDF, XLSX) của chủ sở hữu.
- `src/data/questions.json`: ngân hàng câu hỏi (`id`, `de`, `cacDe`, `chuDe` 1–10, `cauHoi`, `dapAn` A–D, `dapAnDung`, `giaiThich`, `nguon`).
- `src/data/topics.js`: 10 chủ đề.
- `src/data/meoNho.json`: Bảng mẹo nhớ (mỗi dòng có nguồn là id câu hỏi).

© 2026 VH Phước. Mọi nội dung thuộc về VH Phước.
