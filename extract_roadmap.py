import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

path = Path('16-Week-Fullstack-Roadmap.docx')
with zipfile.ZipFile(path) as z:
    xml = z.read('word/document.xml')

root = ET.fromstring(xml)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
texts = []
for p in root.findall('.//w:p', ns):
    paras = []
    for t in p.findall('.//w:t', ns):
        if t.text:
            paras.append(t.text)
    if paras:
        texts.append(''.join(paras))

print('\n'.join(texts))
