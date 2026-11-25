"""Gộp data/bo-sung-tracnghiem.csv vào src/data/questions.json theo bảng rà soát thủ công.
Chạy sau scripts/build_questions.py."""
import csv, json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from build_questions import clean, topic

CSV = 'bo-sung-tracnghiem.csv'
# dòng CSV -> id câu PDF trùng (cùng câu hỏi, cùng đáp án đúng): bỏ, giữ bản PDF
DUP_PDF = {1: 'de3-c13', 2: 'de9-c16', 3: 'de8-c09', 5: 'de13-c08', 7: 'de5-c35', 8: 'de5-c02',
           9: 'de9-c32', 10: 'de8-c11', 11: 'de13-c16', 12: 'de4-c29', 18: 'de11-c33', 19: 'de14-c29',
           22: 'de5-c25', 23: 'de13-c27', 26: 'de10-c22', 27: 'de9-c06', 32: 'de15-c21', 33: 'de8-c18',
           37: 'de12-c33', 38: 'de3-c02', 39: 'de15-c27', 42: 'de14-c20', 43: 'de14-c32', 44: 'de1-c07',
           45: 'de6-c34'}
# dòng CSV -> câu XLSX chỉ có đáp án đúng: gộp, lấy đủ phương án từ CSV, đáp án đúng theo XLSX
MERGE_XLSX = {4: 'ot10-c08', 6: 'ot12-c19', 15: 'ot11-c06', 20: 'ot11-c04', 21: 'ot13-c06',
              25: 'ot4-c08', 29: 'ot6-c27', 30: 'ot7-c07'}
# câu mới, đáp án đã đối chiếu (căn cứ ghi trong báo cáo)
NEW = {14: 'de13-c06, de15-c33 (thế quyền: DNBH thay người được BH đòi người thứ ba)',
       16: 'Luật KDBH 2022 Điều 8; de1-c34, de5-c04 (TNDS chủ xe cơ giới là bảo hiểm bắt buộc)',
       17: 'ot1-c18 (Luật KDBH không áp dụng cho BHXH, BHYT…; TNDS xe cơ giới là bảo hiểm thương mại)',
       24: 'Luật KDBH 2022: DNBH gốc chịu toàn bộ trách nhiệm với người được bảo hiểm',
       31: 'de10-c06, de1-c33 (đại lý, môi giới hưởng hoa hồng do DNBH trả; môi giới đại diện khách hàng)',
       47: 'ot4-c12 (miễn thường không khấu trừ: tổn thất nhỏ hơn mức miễn thường thì không bồi thường)'}
DROP_SET = {13: 'nguyên tắc thế quyền', 36: 'hàng hải — mua bảo hiểm lô hàng',
            40: 'phát biểu sai về đại lý bảo hiểm', 46: 'đại lý không được ủy quyền hoạt động nào'}
DROP_ANS = {28: 'chi phí giám định cháy nổ bắt buộc: không có trong 2 file, không quy định trong Luật KDBH',
            34: 'tàu đâm va: không có trong 2 file/Luật; BH thân tàu cũng bảo hiểm một phần trách nhiệm đâm va nên đáp án D không chắc',
            35: 'các loại HĐBH: đáp án B theo luật cũ; Luật 2022 (de13-c07) chia nhân thọ, sức khỏe, tài sản, thiệt hại, trách nhiệm',
            41: 'gián đoạn kinh doanh: đáp án đầu trang mâu thuẫn lời giải, không có trong 2 file/Luật',
            48: 'trách nhiệm vận chuyển tổng hợp: không có trong 2 file/Luật'}
NOTES = {15: 'CSV ghi D "Tất cả đều đúng" — sai với XLSX và Luật KDBH 2022 (đối tượng HĐBH sức khỏe là sức khỏe con người), lấy đáp án C',
         32: 'PDF de15-c21 ghi D "A, B, C đúng"; CSV, XLSX và Luật KDBH 2022 (đại lý do DNBH ủy quyền) đều là B — chủ sở hữu nên xem lại câu PDF này',
         6: 'PDF de14-c30 (cùng câu hỏi, khác phương án D) ghi "A, B, C đúng" gồm cả "không biết sự kiện đã xảy ra" — trái Luật KDBH 2022 (vô hiệu khi bên mua BIẾT); chủ sở hữu nên xem lại'}


def main():
    rows = list(csv.DictReader(open(f'data/{CSV}', encoding='utf-8-sig')))
    assert len(rows) == 48
    Q = json.load(open('src/data/questions.json'))
    by_id = {q['id']: q for q in Q}
    for i, r in enumerate(rows, 1):
        opts = {k: clean(r[k]) for k in 'ABCD' if clean(r[k])}
        src = f'{CSV} dòng {i} (tracnghiem.net)'
        if i in MERGE_XLSX:
            q = by_id[MERGE_XLSX[i]]
            ans = q['dapAn'].get('A', '')
            key = next(k for k, v in opts.items() if v.lower().rstrip('.') == ans.lower().rstrip('.') or v.lower().startswith(ans.lower().rstrip('.')))
            q.update(dapAn=opts, dapAnDung=key, nguon=q['nguon'] + '; ' + src)
            q.pop('thieuDapAn', None)
            if len(opts) < 4:
                q['chiOnTap'] = True
        elif i in NEW:
            n = len([q for q in Q if q['id'].startswith('tn-')]) + 1
            q = {'id': f'tn-c{n:02d}', 'de': 'Bổ sung', 'cacDe': ['Bổ sung'], 'chuDe': 0,
                 'cauHoi': clean(r['cau_hoi']), 'dapAn': opts, 'dapAnDung': r['dap_an_dung'].strip(),
                 'giaiThich': '', 'nguon': src}
            q['chuDe'] = topic(q)
            Q.append(q); by_id[q['id']] = q
        else:
            assert i in DUP_PDF or i in DROP_SET or i in DROP_ANS, i
    json.dump(Q, open('src/data/questions.json', 'w'), ensure_ascii=False, indent=1)
    exam = [q for q in Q if not q.get('thieuDapAn') and not q.get('chiOnTap') and len(q['dapAn']) >= 2]
    L = ['# Báo cáo bổ sung từ tracnghiem.net', '',
         f'- Số câu trong file: **{len(rows)}** (chỉ phần xem miễn phí)',
         f'- Lấy vào thành câu mới: **{len(NEW)}**',
         f'- Trùng đã bỏ: **{len(DUP_PDF) + len(MERGE_XLSX)}** ({len(DUP_PDF)} trùng câu PDF; {len(MERGE_XLSX)} trùng câu XLSX chỉ-có-đáp-án → gộp, bổ sung đủ phương án cho câu XLSX)',
         f'- Bỏ vì không xác nhận được thuộc bộ "1000+ câu": **{len(DROP_SET)}**',
         f'- Bỏ vì không đối chiếu chắc chắn được đáp án: **{len(DROP_ANS)}**',
         f'- Tổng câu duy nhất cuối cùng: **{len(Q)}**; đủ phương án thi thử: **{len(exam)}**', '',
         '## Câu mới (id tn-cXX)', '']
    L += [f'- Dòng {i} → {next(q["id"] for q in Q if q["nguon"].startswith(f"{CSV} dòng {i} "))}: căn cứ {v}' for i, v in NEW.items()]
    L += ['', '## Gộp vào câu XLSX', ''] + [f'- Dòng {i} → {v}' + (' (3 phương án, chỉ flashcard/tìm kiếm)' if i == 25 else '') for i, v in MERGE_XLSX.items()]
    L += ['', '## Trùng câu PDF (bỏ)', '', ', '.join(f'dòng {i} = {v}' for i, v in DUP_PDF.items())]
    L += ['', '## Bỏ — không xác nhận được bộ nguồn', ''] + [f'- Dòng {i}: {v}' for i, v in DROP_SET.items()]
    L += ['', '## Bỏ — không đối chiếu chắc chắn được đáp án', ''] + [f'- Dòng {i}: {v}' for i, v in DROP_ANS.items()]
    L += ['', '## Ghi chú cho chủ sở hữu', ''] + [f'- Dòng {i}: {v}' for i, v in NOTES.items()]
    open('data/BAO_CAO_BO_SUNG.md', 'w').write('\n'.join(L) + '\n')
    print('\n'.join(L[:9]))


if __name__ == '__main__':
    main()
