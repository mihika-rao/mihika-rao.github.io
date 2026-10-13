from pathlib import Path
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from rasterio.features import geometry_mask
from rasterio.warp import reproject,Resampling,calculate_default_transform
from rasterio.windows import from_bounds,Window
import rasterio
from shapely.geometry import shape,mapping
from shapely.ops import transform as project
from pyproj import Transformer
P=Path(__file__).parent
results=json.loads((P/'results.json').read_text());features=json.loads((P/'country-boundaries.geojson').read_text())['features']
geoms={f['properties']['name']:shape(f['geometry']) for f in features}
BG='#0b1729';PANEL='#102039';INK='#f5efdf';MUTED='#a8bad0';GOLD='#edb06a';DARK='#486481'
plt.rcParams['svg.fonttype']='path'
fig=plt.figure(figsize=(16,15),facecolor=BG)
a=fig.add_axes([0,0,1,1]);a.set(xlim=(0,1600),ylim=(1500,0));a.axis('off')
def t(x,y,s,size=18,color=INK,weight='normal',family='DejaVu Sans',**kw):a.text(x,y,s,fontsize=size,color=color,weight=weight,fontfamily=family,va='top',**kw)
t(65,42,'SMALL WONDERS  /  A RAW-DATA EXPLORATION',11,GOLD,weight='bold')
t(65,95,'The sky we’re missing.',58,family='DejaVu Serif')
t(65,206,'How much of each country lies under skies that hide the Milky Way?',22)
t(65,257,'About half of Belgium. About 3% of Switzerland.',20,GOLD)
t(65,303,'New calculations from the World Atlas raster • historical satellite inputs from 2014',12,MUTED)
# Legend makes geographic meaning explicit before the map.
a.scatter(77,359,s=125,marker='s',color=GOLD);t(97,345,'Milky Way obscured by skyglow',14)
a.scatter(650,359,s=125,marker='s',color=DARK);t(670,345,'Below the atlas’s loss-of-visibility cutoff',14)
trans=Transformer.from_crs(4326,3035,always_xy=True).transform
with rasterio.open(P/'europe-atlas-extract.tif') as src:
 for i,r in enumerate(results):
  col=i%4;row=i//4;left=65+col*382;top=410+row*438
  t(left,top,r['country'],19,weight='bold')
  t(left,top+38,f"{r['obscured_pct']:.1f}%",37,GOLD,weight='bold')
  t(left,top+101,'of mapped area obscured',11,MUTED)
  g=geoms[r['country']]
  w=from_bounds(*g.bounds,src.transform).round_offsets();w=Window(w.col_off,w.row_off,int(np.ceil(w.width))+1,int(np.ceil(w.height))+1)
  v=src.read(1,window=w,masked=True);st=src.window_transform(w)
  inside=geometry_mask([mapping(g)],v.shape,st,invert=True)
  categorical=np.where(inside & ~np.ma.getmaskarray(v),np.where(v.data>.688,2,1),0).astype('uint8')
  from rasterio.transform import array_bounds
  bounds=array_bounds(*v.shape,st)
  dt,dw,dh=calculate_default_transform(src.crs,'EPSG:3035',v.shape[1],v.shape[0],*bounds,resolution=1000)
  dest=np.zeros((dh,dw),dtype='uint8')
  reproject(categorical,dest,src_transform=st,src_crs=src.crs,dst_transform=dt,dst_crs='EPSG:3035',src_nodata=0,dst_nodata=0,resampling=Resampling.nearest)
  mx=fig.add_axes([left/1600,(1500-(top+402))/1500,325/1600,270/1500],facecolor=BG)
  b=array_bounds(dh,dw,dt)
  mx.imshow(np.ma.masked_equal(dest,0),extent=[b[0],b[2],b[1],b[3]],origin='upper',cmap=ListedColormap([DARK,GOLD]),vmin=1,vmax=2,interpolation='nearest')
  gp=project(trans,g)
  polys=list(gp.geoms) if hasattr(gp,'geoms') else [gp]
  for poly in polys:
   if poly.geom_type=='Polygon':
    x,y=poly.exterior.xy;mx.plot(x,y,lw=.45,color='#b8c8d4',alpha=.65)
  mx.set_aspect('equal');mx.axis('off')
  if row==0:a.plot([left,left+325],[top+420,top+420],color=MUTED,alpha=.2,lw=.6)
a.plot([65,1535],[1310,1310],color=MUTED,alpha=.3,lw=.6)
t(65,1330,'Map colors show actual modeled locations. Percentages measure area, not people.',13)
t(65,1360,'Maps resized to fit • eight selected European territories • visibility depends on conditions',11,MUTED)
t(65,1400,'Data: World Atlas of Artificial Night Sky Brightness / GFZ (2016). Boundaries: Natural Earth.',12,MUTED)
t(65,1432,'Analysis & graphic: Mihika Rao',12,GOLD,weight='bold');t(1535,1432,'mihika-rao.github.io',12,MUTED,ha='right')
fig.savefig(P/'sky-missing-raw-analysis.png',dpi=160,facecolor=BG)
fig.savefig(P/'sky-missing-raw-analysis.svg',facecolor=BG)
