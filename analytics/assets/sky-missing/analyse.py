from pathlib import Path
import json,csv
import numpy as np
import rasterio
from rasterio.features import geometry_mask
from rasterio.windows import from_bounds,Window
from shapely.geometry import shape,mapping,box
from pyproj import Geod
P=Path(__file__).parent
THRESHOLD=.688 # mcd/m2; equivalent to 688 microcd/m2.
with rasterio.open(P/'europe-atlas-extract.tif') as ds:
 features=json.loads((P/'country-boundaries.geojson').read_text())['features']
 results=[]
 for feature in features:
  g=shape(feature['geometry'])
  w=from_bounds(*g.bounds,transform=ds.transform).round_offsets()
  w=Window(w.col_off,w.row_off,int(np.ceil(w.width))+1,int(np.ceil(w.height))+1)
  v=ds.read(1,window=w,masked=True)
  transform=ds.window_transform(w)
  inside=geometry_mask([mapping(g)],v.shape,transform,invert=True,all_touched=False)
  valid=inside & ~np.ma.getmaskarray(v) & np.isfinite(v.data) & (v.data>=0)
  geod=Geod(ellps='WGS84');weights=[]
  dx=transform.a
  for r in range(v.shape[0]):
   top=transform.f+r*transform.e;bot=top+transform.e
   area,_=geod.polygon_area_perimeter([0,dx,dx,0],[top,top,bot,bot])
   weights.append(abs(area)/1e6)
  weights=np.array(weights)[:,None]
  total=float((valid*weights).sum())
  pct=lambda threshold:float(((valid & (v.data>threshold))*weights).sum()/total*100)
  touched=geometry_mask([mapping(g)],v.shape,transform,invert=True,all_touched=True)&~np.ma.getmaskarray(v)&(v.data>=0)
  edge=float(((touched&(v.data>THRESHOLD))*weights).sum()/(touched*weights).sum()*100)
  result=dict(country=feature['properties']['name'],area_km2=total,obscured_pct=pct(THRESHOLD),below_threshold_pct=100-pct(THRESHOLD),valid_pixels=int(valid.sum()),missing_pixels=int((inside&~valid).sum()),threshold_minus20_pct=pct(THRESHOLD*.8),threshold_plus20_pct=pct(THRESHOLD*1.2),all_touched_pct=edge)
  results.append(result);print(result,flush=True)
 results.sort(key=lambda x:x['obscured_pct'],reverse=True)
 with (P/'results.csv').open('w') as f:
  wr=csv.DictWriter(f,fieldnames=list(results[0]));wr.writeheader();wr.writerows(results)
 (P/'results.json').write_text(json.dumps(results,indent=2))
