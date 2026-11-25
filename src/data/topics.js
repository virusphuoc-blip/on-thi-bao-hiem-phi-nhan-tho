export const TOPICS = [
  { id: 1, ten: 'Luật Kinh doanh bảo hiểm — quy định chung', ngan: 'Luật KDBH' },
  { id: 2, ten: 'Hợp đồng bảo hiểm (giao kết, vô hiệu, chấm dứt, chuyển giao)', ngan: 'Hợp đồng BH' },
  { id: 3, ten: 'Bảo hiểm tài sản (giá trị, số tiền, bồi thường, trùng/dưới/trên giá trị, miễn thường)', ngan: 'BH tài sản' },
  { id: 4, ten: 'Bảo hiểm sức khỏe (tai nạn, chi phí y tế, thương tật, thời gian chờ)', ngan: 'BH sức khỏe' },
  { id: 5, ten: 'Bảo hiểm xe cơ giới (TNDS bắt buộc, vật chất xe, tai nạn lái/phụ/người ngồi trên xe)', ngan: 'BH xe cơ giới' },
  { id: 6, ten: 'Bảo hiểm cháy, nổ bắt buộc', ngan: 'Cháy, nổ' },
  { id: 7, ten: 'Bảo hiểm trách nhiệm (sản phẩm, công cộng, nghề nghiệp)', ngan: 'BH trách nhiệm' },
  { id: 8, ten: 'Bảo hiểm xây dựng/lắp đặt CAR/EAR, Mọi rủi ro tài sản, Gián đoạn kinh doanh', ngan: 'CAR/EAR, MRTS, GĐKD' },
  { id: 9, ten: 'Đại lý bảo hiểm (quyền/nghĩa vụ, hoa hồng, đạo đức hành nghề, chứng chỉ)', ngan: 'Đại lý BH' },
  { id: 10, ten: 'Nguyên tắc bảo hiểm (bồi thường, thế quyền, đóng góp, khoán, nguyên nhân trực tiếp, trung thực tuyệt đối)', ngan: 'Nguyên tắc BH' },
]

export const topicById = Object.fromEntries(TOPICS.map((t) => [t.id, t]))
