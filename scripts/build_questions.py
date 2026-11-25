"""Gộp PDF + XLSX thành src/data/questions.json (chạy: python3 scripts/build_questions.py)."""
import json, re, sys, difflib
from collections import Counter, defaultdict
import openpyxl
sys.path.insert(0, 'scripts')
from parse_pdf import parse, clean

PDF = 'XTI-FULL-__-T_NG-H_P-PNT_0_kcbm.pdf'
XLSX = 'on_tap-1_1_lvo6.xlsx'


def norm(s):
    s = clean(str(s)).lower().replace('“', '"').replace('”', '"').replace('khoẻ', 'khỏe')
    s = re.sub(r'\s*([,.:;?!)])', r'\1', s)
    return re.sub(r'[\s.:;?!]+$', '', s)


def ans_norm(s):
    s = norm(s)
    s = re.sub(r'^(cả|tất cả)\s+', '', s)
    s = re.sub(r'\b(đều|đúng)\b', '', s)
    return re.sub(r'[\s,;.]+', '', s)


def ans_eq(a, b):
    a, b = ans_norm(a), ans_norm(b)
    if not a or not b:
        return False
    if a == b or (len(a) > 25 and len(b) > 25 and (a in b or b in a)):
        return True
    return len(a) > 12 and difflib.SequenceMatcher(None, a, b).ratio() >= 0.9


def pdf_questions():
    out = []
    for e in parse('data/' + PDF):
        for i, q in enumerate(e['questions'], 1):
            opts = {k: clean(v) for k, v in q['opts'].items() if clean(v).lower() != 'none'}
            out.append({'de': f"Đề {e['de']}", 'so': i, 'cauHoi': clean(q['text']), 'dapAn': opts,
                        'dapAnDung': sorted(q['red'])[0], 'file': PDF})
    return out


def xlsx_questions():
    wb = openpyxl.load_workbook('data/' + XLSX)
    out = []
    for ws in wb.worksheets:
        m = re.match(r'DE (\d+)$', ws.title)
        de = int(m.group(1)) if m else 1
        so = 0
        for r in ws.iter_rows(values_only=True):
            a = clean(str(r[0])) if r[0] is not None else ''
            b = clean(str(r[1])) if len(r) > 1 and r[1] is not None else ''
            h = re.fullmatch(r'Đ[ỀỂ]\s*(\d+)', a, re.I)
            if h:
                de, so = int(h.group(1)), 0
                continue
            if not a:
                continue
            so += 1
            out.append({'sheet': ws.title, 'xde': de, 'so': so, 'cauHoi': a, 'dung': b,
                        'extra': [clean(str(c)) for c in r[2:] if c not in (None, '')]})
    return out


RULES = [
    (9, ('đại lý', 'hoa hồng', 'chứng chỉ', 'đạo đức hành nghề')),
    (6, ('cháy, nổ', 'cháy nổ', 'phòng cháy')),
    (8, ('xây dựng', 'lắp đặt', 'car/ear', '(car', '(ear', 'mọi rủi ro', 'gián đoạn kinh doanh', 'công trình', 'chủ thầu')),
    (5, ('xe cơ giới', 'chủ xe', 'mô tô', 'xe máy', 'ô tô', 'lái xe', 'ngồi trên xe', 'vật chất xe')),
    (7, ('trách nhiệm sản phẩm', 'trách nhiệm công cộng', 'trách nhiệm nghề nghiệp', 'bảo hiểm trách nhiệm',
         'người sử dụng lao động')),
    (4, ('sức khỏe', 'tai nạn con người', 'chi phí y tế', 'thương tật', 'thời gian chờ', 'nằm viện', 'phẫu thuật',
         'điều trị', 'bệnh')),
    (10, ('nguyên tắc', 'thế quyền', 'đóng góp bồi thường', 'khoán', 'nguyên nhân trực tiếp', 'trung thực tuyệt đối',
          'quyền lợi có thể được bảo hiểm')),
    (3, ('tài sản', 'giá trị bảo hiểm', 'dưới giá trị', 'trên giá trị', 'bảo hiểm trùng', 'miễn thường', 'tổn thất')),
    (2, ('hợp đồng bảo hiểm', 'giao kết', 'vô hiệu', 'chấm dứt', 'chuyển giao', 'bên mua bảo hiểm', 'người thụ hưởng',
         'phí bảo hiểm', 'bồi thường', 'trả tiền bảo hiểm')),
]


def topic(q):
    """Chủ đề theo từ khóa: xét câu hỏi trước, nếu không có mới xét thêm đáp án đúng."""
    for text in (norm(q['cauHoi']), norm(q['cauHoi'] + ' ' + q['dapAn'].get(q['dapAnDung'], ''))):
        for tid, keys in RULES:
            if any(k in text for k in keys):
                return tid
    return 1


def main():
    pdf, xl = pdf_questions(), xlsx_questions()
    report = defaultdict(list)
    # 1. khử trùng trong PDF: cùng câu hỏi + cùng bộ đáp án
    uniq, by_key = [], {}
    for q in pdf:
        key = (norm(q['cauHoi']), tuple(sorted(norm(v) for v in q['dapAn'].values())))
        if key in by_key:
            u = by_key[key]
            u['cacDe'].append(q['de']); u['nguonList'].append(f"{PDF} – {q['de']} câu {q['so']}")
            if norm(u['dapAn'][u['dapAnDung']]) != norm(q['dapAn'][q['dapAnDung']]):
                report['pdf_conflict'].append((u['id0'], q['de'], q['so']))
            report['dup_pdf'].append((q['de'], q['so']))
            continue
        u = dict(q, cacDe=[q['de']], nguonList=[f"{PDF} – {q['de']} câu {q['so']}"], id0=f"{q['de']} câu {q['so']}")
        by_key[key] = u; uniq.append(u)
    by_q = defaultdict(list)
    for u in uniq:
        by_q[norm(u['cauHoi'])].append(u)
    # 2. ghép XLSX vào PDF
    seen_x = {}
    for x in xl:
        xde = f"Ôn tập {x['xde']}"
        tag = f"{XLSX} – sheet {x['sheet']}, Đề {x['xde']} câu {x['so']}"
        nq, na = norm(x['cauHoi']), norm(x['dung'])
        def ans_ok(u):
            return na and any(ans_eq(v, na) for v in u['dapAn'].values())
        same = by_q.get(nq, [])
        cands, how = [u for u in same if ans_ok(u)], 'exact'
        if not cands and len(same) == 1 and len(nq) >= 60:
            cands = same
        if not cands:
            best = []
            for u in uniq:
                sm = difflib.SequenceMatcher(None, nq, norm(u['cauHoi']))
                if sm.real_quick_ratio() >= 0.9 and sm.quick_ratio() >= 0.9 and sm.ratio() >= 0.9 and ans_ok(u):
                    best.append((sm.ratio(), u))
            cands, how = [u for r, u in sorted(best, key=lambda z: -z[0])][:1], 'fuzzy'
        if cands:
            u = cands[0]
            if how == 'fuzzy':
                report['fuzzy'].append((tag, x['cauHoi'], u['cauHoi']))
            if na and not ans_ok(u):
                report['ans_not_in_opts'].append((tag, x['dung'], u['dapAn']))
            elif na and not ans_eq(u['dapAn'][u['dapAnDung']], na):
                report['conflict'].append((tag, x['dung'], u['dapAnDung'], u['dapAn'][u['dapAnDung']]))
            if xde not in u['cacDe']:
                u['cacDe'].append(xde)
            u['nguonList'].append(tag)
            report['dup_xlsx'].append(tag)
            continue
        k = (nq, na)
        if k in seen_x:
            seen_x[k]['cacDe'].append(xde) if xde not in seen_x[k]['cacDe'] else None
            seen_x[k]['nguonList'].append(tag)
            report['dup_xlsx_only'].append(tag)
            continue
        u = {'de': xde, 'so': x['so'], 'cauHoi': x['cauHoi'], 'dapAn': {'A': x['dung']} if x['dung'] else {},
             'dapAnDung': 'A' if x['dung'] else '', 'cacDe': [xde], 'nguonList': [tag], 'xlsxOnly': True}
        seen_x[k] = u; uniq.append(u)
        report['xlsx_only'].append((tag, x['cauHoi'], x['dung']))
    # 3. id + chủ đề
    cnt = Counter()
    out = []
    for u in uniq:
        n = int(re.search(r'\d+', u['de']).group())
        pre = 'de' if u['de'].startswith('Đề') else 'ot'
        cnt[u['de']] += 1
        q = {'id': f"{pre}{n}-c{cnt[u['de']]:02d}", 'de': u['de'], 'cacDe': u['cacDe'], 'chuDe': topic(u),
             'cauHoi': u['cauHoi'], 'dapAn': u['dapAn'], 'dapAnDung': u['dapAnDung'], 'giaiThich': '',
             'nguon': '; '.join(u['nguonList'])}
        if u.get('xlsxOnly'):
            q['thieuDapAn'] = True
        out.append(q)
    json.dump(out, open('src/data/questions.json', 'w'), ensure_ascii=False, indent=1)
    json.dump({k: v for k, v in report.items()}, open('/tmp/report.json', 'w'), ensure_ascii=False, indent=1)
    print('pdf', len(pdf), 'xlsx', len(xl), 'unique', len(out))
    print({k: len(v) for k, v in report.items()})
    print('topics', sorted(Counter(q['chuDe'] for q in out).items()))
    per = Counter(d for q in out for d in q['cacDe'])
    print('per de', sorted(per.items(), key=lambda z: (z[0][0], int(re.search(r'\d+', z[0]).group()))))


if __name__ == "__main__":
    main()
