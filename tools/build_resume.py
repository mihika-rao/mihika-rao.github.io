from pathlib import Path
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,HRFlowable,KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("ResumeSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("ResumeSans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFontFamily("ResumeSans",normal="ResumeSans",bold="ResumeSans-Bold",italic="ResumeSans",boldItalic="ResumeSans-Bold")
P=Path(__file__).resolve().parents[1]
INK=colors.HexColor('#192b39')
styles={
 'name':ParagraphStyle('name',fontName='ResumeSans-Bold',fontSize=22,leading=25,textColor=INK,alignment=TA_CENTER),
 'contact':ParagraphStyle('contact',fontName='ResumeSans',fontSize=9,leading=13,alignment=TA_CENTER),
 'body':ParagraphStyle('body',fontName='ResumeSans',fontSize=9,leading=11.2,spaceAfter=3),
 'section':ParagraphStyle('section',fontName='ResumeSans-Bold',fontSize=10,leading=12,spaceBefore=7,spaceAfter=4,textColor=INK),
 'role':ParagraphStyle('role',fontName='ResumeSans-Bold',fontSize=10,leading=13),
 'date':ParagraphStyle('date',fontName='ResumeSans',fontSize=9,leading=13,alignment=2),
 'bullet':ParagraphStyle('bullet',fontName='ResumeSans',fontSize=9,leading=11.2,leftIndent=10,firstLineIndent=-8,spaceAfter=3),
}
story=[]
def para(s,k='body'):story.append(Paragraph(s,styles[k]))
def section(s):para(s,'section');story.append(HRFlowable(width='100%',thickness=.5,color=INK,spaceAfter=5))
def role(title,dates,subtitle):
 tab=Table([[Paragraph(title,styles['role']),Paragraph(dates,styles['date'])]],colWidths=[365,157]);tab.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('VALIGN',(0,0),(-1,-1),'TOP')]))
 story.append(tab);para(subtitle)
def bullet(s):para('• '+s,'bullet')
para('MIHIKA RAO','name')
para('Product Analytics | Decision Science | Measurement Strategy','contact')
para('Nashville, TN | 615.403.1003 | mr2cy@virginia.edu','contact')
para('<link href="https://mihika-rao.github.io">mihika-rao.github.io</link> | <link href="https://www.linkedin.com/in/mihikarao">linkedin.com/in/mihikarao</link>','contact')
section('PROFILE')
para('I start with the question behind the metric: what are we trying to learn, and what would change the decision? Astronomy PhD with experience in product analytics, learning platforms, statistical modeling, and communicating evidence across technical and nontechnical teams.')
section('EXPERIENCE')
role('NovaCards | Data Science Fellow - Personalization','May - Aug 2025','434 Accelerator Program | Remote')
bullet('Structured content into a Subject / Topic / Subtopic taxonomy, standardizing names and resolving duplicates to support measurement and personalization across a learning platform with 5K+ users.')
bullet('Used Python classification workflows and SQL analysis to connect content structure with learner behavior; built cohort and retention reporting to inform product and content decisions.')
bullet('Contributed to a personalization pilot reporting a 30% lift in 30-day retention; automated analytics workflows to reduce manual reporting by approximately 50%.')
role('University of Virginia &amp; NRAO','2021 - 2026','Graduate Research Assistant | Charlottesville, VA')
bullet('Led a multiyear research analysis using large telescope datasets: defined the question, built reproducible Python pipelines, and compared models under noise and uncertainty.')
bullet('Automated data preparation and analysis, reducing processing time by 40% versus prior workflows; used statistical modeling and validation to test the reliability of conclusions.')
bullet('Translated complex findings into figures, publications, and presentations; collaborated with researchers across five institutions.')
role('UVA Karsh Institute of Democracy','Jan - Oct 2023','Graduate Student Advocacy Lead - Quantitative Strategy')
bullet('Combined stipend benchmarking across 25 peer institutions with student survey evidence to quantify compensation gaps and communicate priorities to university leadership.')
bullet('Contributed analysis and evidence to the case for a $10K annual graduate stipend increase, from $26K to $36K.')
section('SELECTED ANALYTICS PROJECT')
role('Small Wonders | The sky we’re missing','Oct 2026','Independent spatial analysis | Python, raster data, visualization')
bullet('Analyzed raw sky-brightness data across eight European territories, combining geographic boundaries with area-weighted raster calculations to map Milky Way visibility loss.')
bullet('Checked sensitivity to boundary handling and the visibility cutoff; prepared reproducible code and a sourced visual with explicit assumptions and limitations.')
section('SKILLS')
para('<b>Analytics:</b> Metric design, cohort and retention analysis, hypothesis testing, regression, uncertainty estimation, survey analysis, model comparison, data visualization, stakeholder communication.')
para('<b>Tools:</b> Python (Pandas, NumPy, SciPy, scikit-learn), SQL, R, Git/GitHub, Jupyter, dashboards and automated data pipelines.')
section('EDUCATION')
para('<b>University of Virginia</b> - PhD, Astronomy, Aug 2026; MS, Astronomy, May 2023.')
para('<b>Agnes Scott College</b> - BS, Astrophysics; BA, Economics, May 2021.<br/>Summa Cum Laude | Phi Beta Kappa')
SimpleDocTemplate(str(P/'resume.pdf'),pagesize=(612,792),rightMargin=45,leftMargin=45,topMargin=29,bottomMargin=28,title='Mihika Rao - Product Analytics Resume',author='Mihika Rao').build(story)
