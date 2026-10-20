from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import xml.etree.ElementTree as ET
import json
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.tags=[];self.scripts=[];self.buf=None;self.feed(path.read_text())
 def handle_starttag(self,t,a):
  d=dict(a);self.tags.append((t,d))
  if t=='script' and d.get('type')=='application/ld+json':self.buf=''
 def handle_data(self,s):
  if self.buf is not None:self.buf+=s
 def handle_endtag(self,t):
  if t=='script' and self.buf is not None:self.scripts.append(json.loads(self.buf));self.buf=None
urls=[e.text for e in ET.parse(ROOT/'sitemap.xml').findall('.//{*}loc')];assert len(urls)==len(set(urls))
for url in urls:
 u=urlsplit(url);assert u.scheme=='https' and u.netloc=='thenextwebec.com'
 rel=u.path.lstrip('/');path=ROOT/(rel+'index.html' if not rel or rel.endswith('/') else rel);p=Page(path)
 assert sum(t=='h1' for t,d in p.tags)==1,path
 assert sum(t=='title' for t,d in p.tags)==1,path
 assert [d['href'] for t,d in p.tags if t=='link' and d.get('rel')=='canonical']==[url],path
 assert any(t=='meta' and d.get('name')=='description' and d.get('content') for t,d in p.tags),path
 assert not any(t=='meta' and d.get('name')=='robots' and 'noindex' in d.get('content','') for t,d in p.tags),path
 assert not any(t=='meta' and d.get('http-equiv','').lower()=='refresh' for t,d in p.tags),path
 for t,d in p.tags:
  if t=='img':assert d.get('alt') and d.get('width') and d.get('height'),(path,d)
  for attr in (['href'] if t in ('a','link') else ['src'] if t in ('img','script') else []):
   link=urlsplit(d.get(attr,''))
   if link.scheme or link.netloc or not link.path:continue
   target=ROOT/unquote(link.path.lstrip('/')) if link.path.startswith('/') else path.parent/unquote(link.path)
   if target.is_dir():target=target/'index.html'
   assert target.exists(),(path,target)
   if link.fragment and target.suffix=='.html':assert any(a.get('id')==link.fragment for _,a in Page(target).tags),(path,link.fragment)
 print('PASS',u.path,'metadata, canonical, H1, indexability, resources, links, JSON-LD')
# A redirect-only geographic alias must stay out of the sitemap.
assert 'https://thenextwebec.com/diseno-web-ecuador/' not in urls
for path in ['404.html','THEWEBPAGEEC/index.html','clinica_veterinaria_foto.html']:
 assert any(t=='meta' and d.get('name')=='robots' and 'noindex' in d.get('content','') for t,d in Page(ROOT/path).tags),path
assert 'Disallow: /\n' not in (ROOT/'robots.txt').read_text()
print('PASS legacy noindex, redirect exclusion, robots')
