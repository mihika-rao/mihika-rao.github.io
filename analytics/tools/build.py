"""Build the static analytics gallery and articles from one editable project list.
Run from any directory: python analytics/tools/build.py
"""
from pathlib import Path
import csv,json,re
from html import escape as e
from datetime import date
ROOT=Path(__file__).resolve().parents[1]
PROJECTS=json.loads((ROOT/'data/projects.json').read_text())
PROJECTS.sort(key=lambda p:p['date'],reverse=True)
assert len({p['slug'] for p in PROJECTS})==len(PROJECTS),'Duplicate slug'
for p in PROJECTS:
 assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',p['slug']),'Use a URL-safe slug'
 date.fromisoformat(p['date'])
 for k in ['image','csv','code','download']:
  if p.get(k):assert (ROOT/p[k]).is_file(),f'Missing {k}: {p[k]}'
def shell(title,desc,body,article=False):
 base='../' if article else ''
 return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)} — Mihika Rao</title><meta name="description" content="{e(desc,quote=True)}"><link rel="stylesheet" href="{base}styles.css"><link rel="stylesheet" href="{base}analytics/analytics.css"></head>
<body class="analytics-site"><a class="analytics-skip" href="#main">Skip to content</a><header class="site-nav"><a class="nav-name" href="{base}index.html" aria-label="Mihika home">MIHIKA</a><nav aria-label="Main navigation"><a href="{base}projects.html">Projects</a><a class="active-nav" aria-current="{'true' if article else 'page'}" href="{base}analytics.html">Analytics</a><a href="{base}index.html#about">About</a><a href="{base}resume.pdf" target="_blank" rel="noreferrer">Resume</a><a href="{base}index.html#contact">Contact</a></nav></header><main id="main">{body}</main><footer class="analytics-footer"><span>Mihika Rao · Small Wonders</span><a href="{base}index.html#contact">Have a good question? Say hello ↗</a></footer></body></html>'''
def tags(p):return '<div class="analytics-tags">'+''.join(f'<span>{e(t)}</span>' for t in p['tags'])+'</div>'
cards=[]
for p in PROJECTS:
 pretty=date.fromisoformat(p['date']).strftime('%b %d, %Y')
 cards.append(f'''<article class="analysis-card"><a class="analysis-cover" href="analytics/{p['slug']}.html"><img src="analytics/{e(p['image'])}" alt="{e(p['image_alt'],quote=True)}" loading="lazy" width="1600" height="1500"></a><div class="analysis-card-copy"><p class="eyebrow">NO. {e(p['number'])} / <time datetime="{p['date']}">{pretty}</time></p><h2><a href="analytics/{p['slug']}.html">{e(p['title'])}</a></h2><p>{e(p['summary'])}</p>{tags(p)}<a class="analysis-open" href="analytics/{p['slug']}.html">Explore the analysis ↗</a></div></article>''')
body='''<section class="analytics-hero"><p class="eyebrow">ANALYTICS / AN OPEN-ENDED COLLECTION</p><h1>Small<br><em>wonders.</em><span aria-hidden="true">✳</span></h1><p class="analytics-deck">I had a question.<br>Then I found some data.</p><p class="analytics-intro">Skies, cities, everyday objects, and things I couldn’t leave alone. A growing collection of visual investigations, with the data and thinking behind each one.</p></section>'''
body+=f'<section class="analytics-collection" aria-label="Analytics projects"><div class="analytics-collection-head"><h2>The investigations</h2><span>{len(PROJECTS):02d} published · newest first</span></div><div class="analysis-grid">'+''.join(cards)+'</div></section>'
(ROOT.parent/'analytics.html').write_text(shell('Small Wonders — Analytics','A growing collection of visual data stories by Mihika Rao. Explore the questions, raw data, analysis, and findings.',body))
for p in PROJECTS:
 links=''.join(f'<li><a href="{e(s["url"],quote=True)}">{e(s["label"])} ↗</a></li>' for s in p['sources'])
 table=''
 if p.get('table'):
  tab=p['table']
  headings=''.join(f'<th scope="col">{e(str(c))}</th>' for c in tab['columns'])
  rows=''.join('<tr>'+''.join(f'<th scope="row">{e(str(c))}</th>' if i==0 else f'<td>{e(str(c))}</td>' for i,c in enumerate(row))+'</tr>' for row in tab['rows'])
  table=f'<div class="analysis-table-wrap"><table><caption>{e(tab["caption"])}</caption><thead><tr>{headings}</tr></thead><tbody>{rows}</tbody></table></div>'
 downloads=''.join(f'<a class="analysis-button" href="{e(p[k])}" download>{label} ↓</a>' for k,label in [('csv','Results CSV'),('code','Python analysis'),('download','Reproduce this analysis')] if p.get(k))
 rights=f'<p>{e(p.get("rights_note",""))} <a href="{e(p.get("rights_url","#"))}">License</a></p>' if p.get('rights_note') else ''
 content=f'''<section class="analysis-article-head"><a class="analysis-back" href="../analytics.html">← All investigations</a><p class="eyebrow">NO. {e(p['number'])} / <time datetime="{p['date']}">{date.fromisoformat(p['date']).strftime('%B %d, %Y')}</time></p><h1>{e(p['title'])}</h1><p>{e(p['question'])}</p>{tags(p)}</section><figure class="analysis-figure"><a href="{e(p['image'])}" aria-label="Open the full-size chart"><img src="{e(p['image'])}" alt="{e(p['image_alt'],quote=True)}" width="1600" height="1500"></a><figcaption>Data: <a href="{e(p['sources'][0]['url'])}">{e(p['sources'][0]['label'])}</a>. Analysis &amp; graphic: Mihika Rao. <a href="{e(p['image'])}" download>Download graphic ↗</a></figcaption></figure><section class="analysis-story"><div><p class="eyebrow">THE WORK BEHIND THE PICTURE</p><h2>Follow the question.</h2></div><div><h3>What I did</h3><p>{e(p['approach'])}</p><h3>What stood out</h3><p>{e(p['finding'])}</p><h3>What this can’t tell us</h3><p>{e(p['limits'])}</p></div></section><section class="analysis-evidence"><h2>Look under the hood.</h2><p>The source data, calculations, and assumptions are part of the story.</p><div class="analysis-downloads">{downloads}</div><details><summary>Read the data table</summary>{table}</details><details><summary>Sources &amp; method</summary><p>{e(p['method_note'])}</p><ul>{links}</ul>{rights}</details></section>'''
 (ROOT/f'{p["slug"]}.html').write_text(shell(p['title'],p['summary'],content,True))
print(f'Built gallery and {len(PROJECTS)} article(s).')
