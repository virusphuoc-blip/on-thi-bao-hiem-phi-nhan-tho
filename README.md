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
- Tạo lại ngân hàng câu hỏi từ `data/` (cần `pymupdf`, `openpyxl`): `python3 scripts/build_questions.py`. Đáp án đúng trong PDF là chữ đỏ in đậm. Id `deN-cXX` = Đề N trong PDF, `otN-cXX` = Đề N trong file XLSX (chỉ có trong XLSX). Câu `thieuDapAn: true` chỉ có đáp án đúng, không có phương án sai → chỉ dùng cho flashcard + tìm kiếm.
- Gộp file bổ sung tracnghiem.net (sau bước trên): `python3 scripts/merge_bosung.py` — bảng rà soát thủ công từng dòng nằm trong script; câu `chiOnTap: true` (thiếu phương án) chỉ dùng cho flashcard + tìm kiếm.
- Báo cáo: `data/BAO_CAO_PARSE.md`, `data/BAO_CAO_BO_SUNG.md`.

© 2026 VH Phước. Mọi nội dung thuộc về VH Phước.
