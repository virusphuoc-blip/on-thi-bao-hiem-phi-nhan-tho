"""Đọc file PDF đề thi: đáp án đúng là chữ in đậm màu đỏ."""
import json, re, sys, unicodedata
import pymupdf

RED = 0xFF0000


def clean(s):
    s = unicodedata.normalize('NFD', s.replace('\xa0', ' '))
    s = re.sub(r'\s+(?=[\u0300-\u036f])', '', s)
    s = unicodedata.normalize('NFC', s)
    return re.sub(r'\s+', ' ', s).strip()


def lines(path):
    doc = pymupdf.open(path)
    for pno, page in enumerate(doc, 1):
        for b in page.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                spans = [s for s in l['spans'] if s['text'].strip()]
                if not spans:
                    continue
                text = clean(' '.join(s['text'] for s in spans))
                red = any(s['color'] == RED for s in spans)
                yield pno, text, red, spans


def parse(path):
    exams, cur, item = [], None, None
    for pno, text, red, spans in lines(path):
        if text.startswith('CÔNG TY CỔ PHẦN VIỆN PHÁT TRIỂN') or re.fullmatch(r'\d{1,3}', text):
            continue
        if text == 'HẾT':
            continue
        m = re.match(r'^(?:ĐỀ|ĐỂ|Đề)\s*(\d+)\b\s*(.*)$', text)
        if m:
            cur = {'de': int(m.group(1)), 'questions': []}
            exams.append(cur)
            item = None
            text = m.group(2)
            if not text:
                continue
        q = cur['questions'][-1] if cur and cur['questions'] else None
        # "A. none" dùng làm ô trống cho phương án D (câu Đúng/Sai)
        if q is not None and re.fullmatch(r'[A-D]\s*\.\s*none', text, re.I) and 0 < len(q['opts']) < 4:
            q['opts']['ABCD'[len(q['opts'])]] = 'None'
            item = ('opt', 'ABCD'[len(q['opts']) - 1])
            continue
        m = re.match(r'^([A-D])\s*\.\s*(.*)$', text)
        if m and q is not None and (m.group(1) not in q['opts']) and (len(q['opts']) == 'ABCD'.index(m.group(1))):
            k = m.group(1)
            q['opts'][k] = m.group(2)
            if red:
                q['red'].add(k)
            item = ('opt', k)
            continue
        if item and item[0] == 'opt' and q and len(q['opts']) < 4:
            q['opts'][item[1]] += ' ' + text
            if red:
                q['red'].add(item[1])
            continue
        if item and item[0] == 'q' and q and not q['opts']:
            q['text'] += ' ' + text
            q['qred'] |= red
            continue
        if item and item[0] == 'opt' and q and len(q['opts']) == 4 and item[1] == 'D' and not looks_like_question_start(text, q):
            # dòng tiếp theo của đáp án D
            q['opts']['D'] += ' ' + text
            if red:
                q['red'].add('D')
            continue
        if cur is None:
            continue
        cur['questions'].append({'text': text, 'opts': {}, 'red': set(), 'qred': red, 'page': pno})
        item = ('q', None)
    return exams


def looks_like_question_start(text, q):
    # Đáp án D kéo dài sang dòng sau: dòng tiếp không viết hoa đầu câu
    return text[:1].isupper() or text[:1].isdigit() or text[:1] in '“"('


if __name__ == '__main__':
    exams = parse(sys.argv[1])
    out = []
    for e in exams:
        for i, q in enumerate(e['questions'], 1):
            out.append({'de': e['de'], 'so': i, 'cauHoi': clean(q['text']), 'dapAn': {k: clean(v) for k, v in q['opts'].items() if clean(v).lower() != 'none'},
                        'red': sorted(q['red']), 'qred': q['qred'], 'page': q['page']})
    json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1)
    from collections import Counter
    print('exams', [(e['de'], len(e['questions'])) for e in exams])
    print('total', len(out))
    print('opts count', Counter(len(q['dapAn']) for q in out))
    print('red count', Counter(len(q['red']) for q in out))
    print('qred', sum(q['qred'] for q in out))
