(() => {
  const page = document.body.dataset.page;

  if (page === 'novacards') {
    const cloud = document.getElementById('tag-cloud');
    if (cloud) cloud.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      [...cloud.querySelectorAll('button')].forEach(x => x.classList.remove('active')); b.classList.add('active');
      const parts = b.dataset.path.split('|');
      parts.forEach((p,i) => document.getElementById(`tax-${i+1}`).textContent = p);
    });
    const datasets = {
      cardiology:[['Heart anatomy',58,72],['Hemodynamics',81,68],['ECG patterns',49,64]],
      molecular:[['Nucleotides',73,69],['Replication',52,70],['Transcription',77,74]],
      pharm:[['Beta blockers',44,66],['ACE inhibitors',71,69],['Diuretics',62,63]]
    };
    const chart = document.getElementById('bar-chart');
    function draw(set){ chart.innerHTML = datasets[set].map(([n,v,b]) => `<div class="metric-row"><strong>${n}</strong><div class="track"><div class="fill" style="--w:${v}%"></div><i class="benchmark" style="--b:${b}%" title="population benchmark"></i></div><small>${v}%</small></div>`).join(''); }
    draw('cardiology');
    document.getElementById('dashboard-controls')?.addEventListener('click', e=>{const b=e.target.closest('button');if(!b)return;document.querySelectorAll('#dashboard-controls button').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(b.dataset.set)});
  }

  if (page === 'stipend') {
    const data = {
      peers:{num:'25',title:'Peer institutions',copy:'Established the external benchmark: how did compensation compare with relevant institutions rather than with an arbitrary historical baseline?'},
      survey:{num:'8K+',title:'Student responses',copy:'Added the internal experience layer: which pressures were widespread, and how did compensation relate to stress and self-reported productivity?'},
      cost:{num:'COL',title:'Cost-of-living context',copy:'Translated nominal pay into purchasing-power context so the comparison reflected the actual cost of living rather than salary alone.'},
      synthesis:{num:'1',title:'Decision-ready narrative',copy:'Reduced multiple evidence streams to a small set of implications leadership could evaluate: the gap, the consequences, and the size of the intervention required.'}
    };
    const out = document.getElementById('evidence-content');
    const render = k => { const x=data[k]; out.innerHTML=`<div class="e-number">${x.num}</div><h4>${x.title}</h4><p>${x.copy}</p>`; };
    render('peers');
    document.getElementById('evidence-buttons')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;document.querySelectorAll('#evidence-buttons button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.e)});
  }

  if (page === 'carma7') {
    const figs = {
      '43':['assets/carma7_fig_43.jpg','Morphology: SO₂ is compact around the protostar and elongated along the outflow direction; red/blue contours separate the velocity structure.'],
      '47':['assets/carma7_fig_47.jpg','Selection: SiO gives jet context while CH₃CN marks warm dense gas; the SO₂ analysis positions are chosen to reduce hot-corino contamination.'],
      '51':['assets/carma7_fig_51.jpg','Rotational diagram: the slope of ln(Nᵤ/gᵤ) vs. upper-state energy encodes the excitation temperature.'],
      '53':['assets/carma7_fig_53.jpg','Temperature map: pixel-by-pixel rotational-diagram fitting reveals thermal asymmetry between the northern and southern emission.'],
      '55':['assets/carma7_fig_55.jpg','Linewidth comparison: CH₃CN is narrower, SO₂ broader, and SiO broadest — evidence that the molecules sample different kinematic components.']
    };
    const img=document.getElementById('figure-img'), exp=document.getElementById('figure-explain');
    const render=k=>{img.src=figs[k][0]; exp.textContent=figs[k][1]}; render('43');
    document.getElementById('figure-tabs')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;document.querySelectorAll('#figure-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.fig)});
  }

  if (page === 'constellation') {
    const nodes = [
      {id:1,title:'Messy data',text:'Analytics starts by defining the product signal and what should be measured before choosing a model.',x:.16,y:.25,c:'#d9f52f'},
      {id:2,title:'Product questions',text:'A product metric is useful when the measurement changes a product decision.',x:.42,y:.16,c:'#ff7a1a'},
      {id:3,title:'Astronomy',text:'Astronomy data uses different signals to measure different physical conditions.',x:.73,y:.22,c:'#80d4f7'},
      {id:4,title:'Taxonomy',text:'Shared product language makes benchmarking, measurement, and personalization possible.',x:.29,y:.58,c:'#f29ac2'},
      {id:5,title:'Measurement',text:'Define product success early enough that a launch can be measured and evaluated.',x:.58,y:.53,c:'#fff4c4'},
      {id:6,title:'Design',text:'Product design should reveal information structure and useful signals rather than hide them in folders.',x:.82,y:.68,c:'#8f72c8'},
      {id:7,title:'Human judgment',text:'AI can accelerate analytics and product workflows; human judgment still owns the recommendation.',x:.46,y:.82,c:'#f1533d'}
    ];
    const stop=new Set('the a an and or of to in on for with is are be it that this i my we you your can should into from as at by rather than'.split(' '));
    const tokens=s=>new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>2&&!stop.has(w)));
    const overlap=(a,b)=>{let n=0;const A=tokens(a),B=tokens(b);A.forEach(w=>{if(B.has(w))n++});return n};
    const canvas=document.getElementById('constellation-canvas'), svg=document.getElementById('graph-svg'), detail=document.getElementById('node-detail');
    function render(){
      canvas.querySelectorAll('.graph-node').forEach(n=>n.remove()); svg.innerHTML='';
      nodes.forEach(n=>{const el=document.createElement('button');el.className='graph-node';el.style.left=`${n.x*100}%`;el.style.top=`${n.y*100}%`;el.style.background=n.c;el.textContent=n.title;el.dataset.id=n.id;canvas.appendChild(el)});
      for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)if(overlap(nodes[i].title+' '+nodes[i].text,nodes[j].title+' '+nodes[j].text)>=1){const l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',nodes[i].x*100+'%');l.setAttribute('y1',nodes[i].y*100+'%');l.setAttribute('x2',nodes[j].x*100+'%');l.setAttribute('y2',nodes[j].y*100+'%');svg.appendChild(l)}
    }
    render();
    canvas.addEventListener('click',e=>{const el=e.target.closest('.graph-node');if(!el)return;const n=nodes.find(x=>x.id==el.dataset.id);detail.innerHTML=`<b>${n.title}</b><br>${n.text}<br><br><span style="color:#aaa">keywords: ${[...tokens(n.title+' '+n.text)].slice(0,8).join(', ')}</span>`});
    document.getElementById('graph-search')?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();canvas.querySelectorAll('.graph-node').forEach(el=>{const n=nodes.find(x=>x.id==el.dataset.id);const hit=!q||(n.title+' '+n.text).toLowerCase().includes(q);el.classList.toggle('dim',!!q&&!hit);el.classList.toggle('hit',!!q&&hit)})});
    document.getElementById('add-note')?.addEventListener('click',()=>{const t=document.getElementById('note-title'),x=document.getElementById('note-text');if(!t.value.trim()&&!x.value.trim())return;const i=nodes.length;nodes.push({id:Date.now(),title:t.value.trim()||'Untitled thought',text:x.value.trim(),x:.15+((i*0.19)%0.72),y:.18+((i*0.27)%0.68),c:['#d9f52f','#ff7a1a','#80d4f7','#f29ac2','#fff4c4'][i%5]});t.value='';x.value='';render()});
  }


  /* Home wordmark: one name, several moods. */
  if (page === 'home') {
    const mark = document.getElementById('mihika-wordmark');
    const play = document.getElementById('wordmark-play');
    const modes = ['mode-editorial','mode-wave','mode-sticker','mode-orbit','mode-pixel','mode-skinny','mode-confetti'];
    let modeIndex = 0;
    const setMode = (i) => {
      if (!mark) return;
      modes.forEach(m => mark.classList.remove(m));
      modeIndex = (i + modes.length) % modes.length;
      mark.classList.add(modes[modeIndex]);
    };
    play?.addEventListener('click', () => setMode(modeIndex + 1));
    mark?.addEventListener('click', () => setMode(modeIndex + 1));
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(() => setMode(modeIndex + 1), 3300);
    }
  }

  /* Fog, Funds & Ferns — playable San Francisco property-game prototype. */
  if (page === 'sf-game') {
    const spaces = [
      {name:'START',type:'corner',price:'COLLECT $200',copy:'You made it through another month in San Francisco. Celebrate responsibly.'},
      {name:'Ocean Beach',group:'#7b6b5c',price:'$60',copy:'Fog included. Sun sold separately. Rent doubles if you own a wetsuit.'},
      {name:'Group Chat',type:'deck-space',price:'DRAW',copy:'A social consequence is approaching.'},
      {name:'Outer Sunset',group:'#7b6b5c',price:'$70',copy:'You came for the beach and stayed for the sourdough.'},
      {name:'Wellness Tax',type:'tax',price:'PAY $12',copy:'You bought electrolytes because the packaging said “cellular.”'},
      {name:'N-Judah',type:'transit',price:'$200',copy:'Reliable enough to love, unpredictable enough to build character.'},
      {name:'Inner Sunset',group:'#8bc7df',price:'$100',copy:'Close to the park. Close to noodles. Financially dangerous.'},
      {name:'Angel Round',type:'deck-space',price:'DRAW',copy:'Someone has a warm intro for you.'},
      {name:'Haight-Ashbury',group:'#8bc7df',price:'$110',copy:'Tie-dye heritage, vintage markup, and tourists asking where the hippies went.'},
      {name:'Cole Valley',group:'#8bc7df',price:'$120',copy:'Small, charming, and somehow every stroller costs more than your first car.'},
      {name:'FREE PARKLET',type:'corner',price:'FREE-ish',copy:'Free parking would be unrealistic. You may sit here if you order something.'},
      {name:'Hayes Valley',group:'#e69bc4',price:'$140',copy:'Designer chairs, tiny dogs, and a line for coffee that is definitely worth discussing.'},
      {name:'Compost Fee',type:'tax',price:'PAY $25',copy:'The fork is compostable. The guilt is permanent.'},
      {name:'Lower Haight',group:'#e69bc4',price:'$140',copy:'Good bars, good bikes, excellent likelihood of someone owning a screen-printing setup.'},
      {name:'Mission Dolores',group:'#e69bc4',price:'$160',copy:'Park blanket economics: one bottle, six friends, twelve opinions.'},
      {name:'BART',type:'transit',price:'$200',copy:'Today it is on time. Do not speak of this miracle.'},
      {name:'The Mission',group:'#f3a25e',price:'$180',copy:'Burritos, murals, startups, old-timers, newcomers, and four competing definitions of authenticity.'},
      {name:'Group Chat',type:'deck-space',price:'DRAW',copy:'Someone has typed “quick question” and nothing good can follow.'},
      {name:'Bernal Heights',group:'#f3a25e',price:'$180',copy:'Village energy, hill calves, and at least one dog with a human name.'},
      {name:'Noe Valley',group:'#f3a25e',price:'$200',copy:'Sunshine, strollers, and a farmer’s market tote with excellent structural integrity.'},
      {name:'OFFLINE RETREAT',type:'corner',price:'LOSE SIGNAL',copy:'You are “disconnecting” for 48 hours. Your Instagram story says otherwise.'},
      {name:'Dogpatch',group:'#ef5b4e',price:'$220',copy:'Warehouses became lofts. Lofts became content. Content became rent.'},
      {name:'Angel Round',type:'deck-space',price:'DRAW',copy:'The cap table is about to become a personality test.'},
      {name:'Potrero Hill',group:'#ef5b4e',price:'$220',copy:'Views for days. Legs for hills.'},
      {name:'Mission Bay',group:'#ef5b4e',price:'$240',copy:'Everything is new enough that your map app briefly doubts it exists.'},
      {name:'Caltrain',type:'transit',price:'$200',copy:'The peninsula pilgrimage. Laptop battery recommended.'},
      {name:'SoMa',group:'#f1d34f',price:'$260',copy:'Conference badges, converted warehouses, and a rooftop no one is quite sure how to access.'},
      {name:'Rincon Hill',group:'#f1d34f',price:'$260',copy:'Your apartment has a view. Your living room has the dimensions of a view.'},
      {name:'Coworking Fee',type:'tax',price:'PAY $40',copy:'The cold brew is “free.” The desk absolutely is not.'},
      {name:'Embarcadero',group:'#f1d34f',price:'$280',copy:'Waterfront jogging route by morning, tourist slalom by afternoon.'},
      {name:'GO TO STANDUP',type:'corner',price:'NO ESCAPE',copy:'Do not pass Start. Do not collect $200. Explain your blockers.'},
      {name:'North Beach',group:'#6fbf72',price:'$300',copy:'Espresso, poetry, pasta, and a deeply defensible opinion about focaccia.'},
      {name:'Russian Hill',group:'#6fbf72',price:'$300',copy:'Cable cars outside. Calves inside.'},
      {name:'Angel Round',type:'deck-space',price:'DRAW',copy:'Someone says “just a small check” with complete sincerity.'},
      {name:'Marina',group:'#6fbf72',price:'$320',copy:'Run club at 7. Pilates at 8. Natural wine at 7 again somehow.'},
      {name:'Cable Car',type:'transit',price:'$200',copy:'Public transit, historical artifact, and moving photo booth.'},
      {name:'Cow Hollow',group:'#5379c7',price:'$350',copy:'Neutral athleisure is the unofficial zoning requirement.'},
      {name:'Group Chat',type:'deck-space',price:'DRAW',copy:'The dinner reservation has moved three times and now has a dress code.'},
      {name:'Pacific Heights',group:'#5379c7',price:'$400',copy:'Victorians, views, and money old enough to stop mentioning itself.'},
      {name:'Sea Cliff',group:'#24467d',price:'$450',copy:'You can see the bridge from the house you will not be buying.'}
    ];
    const board = document.getElementById('sf-board');
    const detail = document.getElementById('sf-property-detail');
    const token = document.getElementById('player-token');
    const coords = [];
    for (let c=11;c>=1;c--) coords.push([11,c]);
    for (let r=10;r>=2;r--) coords.push([r,1]);
    for (let c=1;c<=11;c++) coords.push([1,c]);
    for (let r=2;r<=10;r++) coords.push([r,11]);
    const renderDetail = (i) => {
      const s=spaces[i];
      if (!detail || !s) return;
      detail.innerHTML=`<small>${s.type==='deck-space'?'DECK':s.type==='transit'?'TRANSIT':s.type==='tax'?'SAN FRANCISCO SURCHARGE':s.type==='corner'?'CORNER':'PROPERTY'} · SPACE ${String(i).padStart(2,'0')}</small><h3>${s.name}</h3><p><strong>${s.price}</strong> · ${s.copy}</p>`;
    };
    spaces.forEach((s,i)=>{
      const [r,c]=coords[i];
      const el=document.createElement('button');
      el.className='board-space';
      if (s.type) el.classList.add(s.type);
      if (r===11 || r===1) el.classList.add(r===11?'side-bottom':'side-top');
      else el.classList.add(c===1?'side-left':'side-right');
      if ([0,10,20,30].includes(i)) el.classList.add('corner');
      el.style.gridRow=r;el.style.gridColumn=c;el.dataset.space=i;
      el.style.setProperty('--group',s.group||'#171717');
      el.innerHTML=`${s.group?'<i class="stripe"></i>':''}<strong>${s.name}</strong><small>${s.price}</small>`;
      board?.appendChild(el);
    });
    let position=0, rolling=false;
    const placeToken=()=>{if(!token)return;const [r,c]=coords[position];token.style.gridRow=r;token.style.gridColumn=c;};
    placeToken(); renderDetail(0);
    board?.addEventListener('click',e=>{const el=e.target.closest('.board-space');if(!el)return;renderDetail(+el.dataset.space)});
    const diceChars=['⚀','⚁','⚂','⚃','⚄','⚅'];
    document.getElementById('roll-dice')?.addEventListener('click',()=>{
      if(rolling)return;rolling=true;
      const a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6),steps=a+b;
      document.getElementById('die-one').textContent=diceChars[a-1]; document.getElementById('die-two').textContent=diceChars[b-1]; document.getElementById('roll-total').textContent=steps;
      let moved=0;
      const timer=setInterval(()=>{position=(position+1)%40;placeToken();moved++;if(moved>=steps){clearInterval(timer);rolling=false;renderDetail(position)}},115);
    });
    document.getElementById('token-picker')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;document.querySelectorAll('#token-picker button').forEach(x=>x.classList.remove('active'));b.classList.add('active');if(token)token.textContent=b.dataset.token});
    const groupCards=[
      ['Your friend says “small dinner” and 19 people arrive.','Pay $85 for the natural wine you somehow agreed to bring.'],
      ['Someone started a run club in your group chat.','Advance to Marina. You are apparently a morning person now.'],
      ['You said “I’m five minutes away” from across the city.','Pay $25 in rideshare surge pricing.'],
      ['A friend is “soft launching” a relationship.','Collect $20 for correctly identifying the person from a cropped sleeve.'],
      ['You got invited to a house party with no address.','Move back 3 spaces while waiting for the pin.'],
      ['The dinner bill has one shared QR code.','Lose one turn doing forensic Venmo accounting.']
    ];
    const angelCards=[
      ['Your friend’s startup raised a seed round.','Collect $200 in secondhand optimism.'],
      ['Your equity is worth something on paper.','Collect $50. Do not attempt to spend the paper.'],
      ['You bought a $9 matcha because it was “ceremonial.”','Pay $9. The ceremony is complete.'],
      ['A founder says “we’re basically profitable.”','Pay $40 for the definition of “basically.”'],
      ['You got a warm intro.','Advance to SoMa and pretend this was networking strategy.'],
      ['Your startup pivots to AI.','Collect $100 and add “agentic” to the deck.']
    ];
    document.querySelectorAll('.sf-deck').forEach(btn=>btn.addEventListener('click',()=>{
      const isGroup=btn.dataset.deck==='group', deck=isGroup?groupCards:angelCards, pick=deck[Math.floor(Math.random()*deck.length)], out=document.getElementById('sf-drawn-card');
      if(!out)return;out.classList.remove('flip');void out.offsetWidth;out.classList.add('flip');out.innerHTML=`<small>${isGroup?'GROUP CHAT':'ANGEL ROUND'}</small><h3>${pick[0]}</h3><p>${pick[1]}</p>`;
    }));
  }

  /* Colouring Outside the Lines — illustrated book + digital colouring desk. */
  if (page === 'colouring') {
    const palette=['#ef4d3d','#ff8c42','#ffd447','#b7d84b','#5cc98b','#4fc3cf','#4d8ee8','#7357c9','#b76dcc','#ef8fb8','#bb6b45','#72543d','#232323','#f2c9a5','#f8f1dc'];
    let currentColour=palette[0], currentPage='desk', currentBrush='crayon', painting=false;
    const states={desk:{},market:{},apartment:{},window:{}};
    const canvas=document.getElementById('colour-canvas');
    const titles={
      desk:['The Desk Safari','STAY IN / PAGE 04','04'],
      market:['Sunday Market','GO OUT / PAGE 20','20'],
      apartment:['Tiny Apartment Jungle','STAY IN / PAGE 08','08'],
      window:['Window Seat','GO SOMEWHERE / PAGE 36','36']
    };
    const defs=`<defs><filter id="crayonNoise" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".025" numOctaves="2" seed="11" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5"/></filter></defs>`;
    const sceneFrame=()=>`<rect x="18" y="18" width="864" height="564" rx="2" data-outline="1" class="thin"/>`;
    const star=(x,y,r=9)=>`<path d="M${x} ${y-r} L${x+r*.28} ${y-r*.28} L${x+r} ${y} L${x+r*.28} ${y+r*.28} L${x} ${y+r} L${x-r*.28} ${y+r*.28} L${x-r} ${y} L${x-r*.28} ${y-r*.28} Z" data-outline="1" class="thin"/>`;
    const attrs=(i)=>`data-fillable="1" data-index="${i}"`;

    const desk=()=>{
      let i=0,s=defs+sceneFrame();
      s+=`<text x="48" y="62" font-size="19">THE DESK SAFARI</text><path d="M45 448 H855" data-outline="1"/>`;
      // laptop
      s+=`<rect x="278" y="153" width="345" height="218" rx="10" ${attrs(i++)}/><rect x="300" y="176" width="301" height="162" rx="3" data-outline="1"/><path d="M245 373 H655 L700 416 H205 Z" ${attrs(i++)}/><line x1="330" y1="392" x2="575" y2="392" data-outline="1" class="thin"/>`;
      // screen windows
      s+=`<rect x="322" y="198" width="100" height="116" rx="4" ${attrs(i++)}/><rect x="438" y="198" width="140" height="52" rx="4" ${attrs(i++)}/><rect x="438" y="263" width="140" height="51" rx="4" ${attrs(i++)}/>`;
      // mug + saucer
      s+=`<ellipse cx="739" cy="385" rx="65" ry="16" ${attrs(i++)}/><path d="M706 300 H768 V382 Q737 401 706 382 Z" ${attrs(i++)}/><path d="M768 321 Q817 319 808 357 Q803 377 768 367" data-outline="1"/><path d="M718 319 Q737 303 756 319" data-outline="1" class="thin"/>`;
      // plant + pot
      s+=`<path d="M96 300 H188 L178 404 H108 Z" ${attrs(i++)}/>`;
      [[142,245,-34],[120,230,-55],[164,218,48],[138,195,-8],[104,266,-70],[180,266,70]].forEach(([x,y,a])=>{s+=`<ellipse cx="${x}" cy="${y}" rx="24" ry="58" transform="rotate(${a} ${x} ${y})" ${attrs(i++)}/>`});
      s+=`<line x1="142" y1="300" x2="140" y2="191" data-outline="1" class="thin"/>`;
      // lamp
      s+=`<circle cx="812" cy="151" r="26" ${attrs(i++)}/><path d="M812 176 L758 270" data-outline="1"/><path d="M755 268 L824 287" data-outline="1"/><path d="M785 139 L840 119 L851 159 L800 176 Z" ${attrs(i++)}/>`;
      // notebook and pen
      s+=`<path d="M65 458 L276 438 L288 548 L78 568 Z" ${attrs(i++)}/><line x1="176" y1="448" x2="189" y2="557" data-outline="1"/><path d="M96 486 L161 479 M99 510 L162 503 M206 478 L264 472 M210 503 L267 497" data-outline="1" class="thin"/><rect x="228" y="420" width="18" height="138" rx="8" transform="rotate(18 237 489)" ${attrs(i++)}/>`;
      // phone
      s+=`<rect x="642" y="461" width="79" height="126" rx="13" transform="rotate(-7 681 524)" ${attrs(i++)}/><circle cx="681" cy="566" r="5" data-outline="1"/>`;
      // sticky notes + clips
      s+=`<rect x="580" y="424" width="60" height="55" transform="rotate(7 610 452)" ${attrs(i++)}/><rect x="520" y="436" width="52" height="48" transform="rotate(-11 546 460)" ${attrs(i++)}/><path d="M468 474 q22 -38 42 0 q-20 32 -40 2" data-outline="1"/><path d="M451 491 q20 -34 38 0 q-18 28 -36 2" data-outline="1"/>`;
      // headphones
      s+=`<path d="M656 126 Q725 55 793 126" data-outline="1"/><rect x="642" y="120" width="31" height="72" rx="14" ${attrs(i++)}/><rect x="783" y="120" width="31" height="72" rx="14" ${attrs(i++)}/>`;
      // glasses
      s+=`<circle cx="382" cy="468" r="28" ${attrs(i++)}/><circle cx="449" cy="468" r="28" ${attrs(i++)}/><line x1="410" y1="468" x2="421" y2="468" data-outline="1"/><path d="M354 464 l-34 -18 M477 464 l38 -22" data-outline="1"/>`;
      s+=star(231,116,10)+star(690,100,7)+`<path d="M73 105 q40 -30 82 0 q-42 34 -82 0" data-outline="1" class="thin"/><path d="M73 105 q40 30 82 0" data-outline="1" class="thin"/>`;
      return s;
    };

    const market=()=>{
      let i=0,s=defs+sceneFrame();
      s+=`<text x="48" y="62" font-size="19">SUNDAY MARKET</text><path d="M45 480 H855" data-outline="1"/>`;
      // awning
      s+=`<path d="M120 118 H775 L835 215 H64 Z" ${attrs(i++)}/>`;
      for(let x=92,n=0;x<806;x+=78,n++)s+=`<path d="M${x} 118 L${x-28} 215 H${x+34} L${x+62} 118 Z" ${attrs(i++)}/>`;
      s+=`<rect x="112" y="215" width="670" height="238" data-outline="1"/><rect x="335" y="145" width="220" height="72" ${attrs(i++)}/><text x="445" y="178" text-anchor="middle" font-size="16">FLOWERS · FRUIT · BREAD</text><text x="445" y="200" text-anchor="middle" font-size="11">NO, THE TOTE WILL NOT BE ENOUGH</text>`;
      // crates
      [[143,346,176,110],[345,346,176,110],[548,346,176,110]].forEach(([x,y,w,h])=>{s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrs(i++)}/><path d="M${x} ${y+35} H${x+w} M${x} ${y+72} H${x+w}" data-outline="1" class="thin"/>`});
      // fruit circles
      [[170,372],[210,382],[250,370],[283,393],[367,376],[410,389],[458,369],[493,399]].forEach(([x,y],j)=>s+=`<circle cx="${x}" cy="${y}" r="${15+(j%3)*3}" ${attrs(i++)}/>`);
      // flowers
      [[585,320],[625,305],[666,327],[697,302]].forEach(([x,y],j)=>{for(let a=0;a<6;a++){const ang=a*Math.PI/3,cx=x+Math.cos(ang)*23,cy=y+Math.sin(ang)*23;s+=`<ellipse cx="${cx}" cy="${cy}" rx="11" ry="21" transform="rotate(${a*60+90} ${cx} ${cy})" ${attrs(i++)}/>`}s+=`<circle cx="${x}" cy="${y}" r="12" ${attrs(i++)}/><line x1="${x}" y1="${y+12}" x2="${x-8+j*4}" y2="346" data-outline="1" class="thin"/>`});
      // baguettes
      s+=`<path d="M735 316 q42 -80 72 -22 q-20 88 -72 22 Z" ${attrs(i++)}/><path d="M748 294 l28 18 M759 274 l27 18 M772 259 l24 16" data-outline="1" class="thin"/>`;
      // tote
      s+=`<path d="M71 320 H130 L145 454 H56 Z" ${attrs(i++)}/><path d="M72 320 Q94 267 121 320" data-outline="1"/><circle cx="79" cy="373" r="12" ${attrs(i++)}/><circle cx="111" cy="389" r="15" ${attrs(i++)}/>`;
      // bike
      s+=`<circle cx="160" cy="532" r="42" data-outline="1"/><circle cx="290" cy="532" r="42" data-outline="1"/><path d="M160 532 L208 458 L250 532 L189 532 L230 480 L290 532 M208 458 H252 M249 532 L270 450 M263 450 H292" data-outline="1"/>`;
      // bunting + price cards
      s+=`<path d="M125 92 Q447 55 777 92" data-outline="1" class="thin"/>`;for(let x=170;x<740;x+=90)s+=`<path d="M${x} 82 l18 26 l18 -30 Z" ${attrs(i++)}/>`;
      s+=`<rect x="194" y="284" width="75" height="39" transform="rotate(-4 230 303)" ${attrs(i++)}/><rect x="405" y="277" width="82" height="42" transform="rotate(5 446 298)" ${attrs(i++)}/>`;
      return s;
    };

    const apartment=()=>{
      let i=0,s=defs+sceneFrame();
      s+=`<text x="48" y="62" font-size="19">TINY APARTMENT JUNGLE</text><path d="M45 500 H855" data-outline="1"/>`;
      // window
      s+=`<rect x="575" y="90" width="235" height="190" ${attrs(i++)}/><line x1="692" y1="90" x2="692" y2="280" data-outline="1"/><line x1="575" y1="185" x2="810" y2="185" data-outline="1"/><circle cx="765" cy="137" r="28" ${attrs(i++)}/><path d="M590 245 Q630 215 665 245 T742 235 T797 244" data-outline="1" class="thin"/>`;
      // sofa
      s+=`<rect x="248" y="330" width="405" height="150" rx="24" ${attrs(i++)}/><rect x="222" y="366" width="54" height="115" rx="20" ${attrs(i++)}/><rect x="625" y="366" width="54" height="115" rx="20" ${attrs(i++)}/><rect x="282" y="348" width="108" height="82" rx="14" ${attrs(i++)}/><rect x="400" y="350" width="104" height="78" rx="14" ${attrs(i++)}/><rect x="514" y="344" width="93" height="85" rx="14" ${attrs(i++)}/><path d="M277 475 v37 M650 475 v37" data-outline="1"/>`;
      // rug
      s+=`<ellipse cx="460" cy="525" rx="270" ry="45" ${attrs(i++)}/><ellipse cx="460" cy="525" rx="190" ry="28" data-outline="1" class="thin"/>`;
      // shelf/books
      s+=`<rect x="62" y="118" width="155" height="355" data-outline="1"/><line x1="62" y1="235" x2="217" y2="235" data-outline="1"/><line x1="62" y1="352" x2="217" y2="352" data-outline="1"/>`;
      for(let x=77,n=0;x<205;x+=18,n++)s+=`<rect x="${x}" y="${170-(n%3)*12}" width="14" height="${55+(n%3)*12}" ${attrs(i++)}/>`;
      for(let x=75,n=0;x<200;x+=25,n++)s+=`<rect x="${x}" y="${296-(n%2)*15}" width="20" height="${55+(n%2)*15}" ${attrs(i++)}/>`;
      s+=`<circle cx="115" cy="410" r="39" ${attrs(i++)}/><circle cx="115" cy="410" r="10" data-outline="1"/><rect x="165" y="385" width="34" height="70" ${attrs(i++)}/>`;
      // plants around room
      const plants=[[190,285,48],[735,395,57],[810,438,39],[278,285,38],[528,303,44]];
      plants.forEach(([x,y,r],j)=>{s+=`<path d="M${x-r*.45} ${y+r*.65} H${x+r*.45} L${x+r*.34} ${y+r*1.45} H${x-r*.32} Z" ${attrs(i++)}/>`;for(let a=-2;a<=2;a++){const cx=x+a*r*.22,cy=y+a*a*3;s+=`<ellipse cx="${cx}" cy="${cy}" rx="${r*.2}" ry="${r*.62}" transform="rotate(${a*23} ${cx} ${cy})" ${attrs(i++)}/>`}});
      // lamp
      s+=`<path d="M719 175 L719 334" data-outline="1"/><path d="M675 174 H763 L746 112 H692 Z" ${attrs(i++)}/><ellipse cx="719" cy="341" rx="55" ry="13" ${attrs(i++)}/>`;
      // coffee table + objects
      s+=`<ellipse cx="450" cy="454" rx="105" ry="30" ${attrs(i++)}/><path d="M380 470 L358 523 M518 470 L540 523" data-outline="1"/><rect x="415" y="419" width="74" height="25" ${attrs(i++)}/><circle cx="507" cy="435" r="19" ${attrs(i++)}/>`;
      s+=star(835,95,8)+star(255,105,6)+`<path d="M318 103 q38 -26 78 0 q-40 29 -78 0" data-outline="1" class="thin"/>`;
      return s;
    };

    const windowSeat=()=>{
      let i=0,s=defs+sceneFrame();
      s+=`<text x="48" y="62" font-size="19">WINDOW SEAT</text>`;
      // plane wall + window
      s+=`<path d="M76 92 Q178 58 301 84 V525 Q184 554 76 520 Z" ${attrs(i++)}/><rect x="112" y="132" width="156" height="245" rx="78" ${attrs(i++)}/><rect x="135" y="157" width="110" height="196" rx="55" data-outline="1"/>`;
      // clouds inside window
      s+=`<path d="M145 276 q18 -35 47 -8 q22 -38 47 3 q26 -3 28 26 H139 q-11 -13 6 -21 Z" ${attrs(i++)}/><path d="M151 209 q12 -25 34 -7 q18 -30 39 4 q18 0 22 18 H145 q-8 -10 6 -15 Z" ${attrs(i++)}/>`;
      // tray table
      s+=`<path d="M318 346 H823 L855 536 H294 Z" ${attrs(i++)}/><line x1="326" y1="381" x2="832" y2="381" data-outline="1" class="thin"/>`;
      // coffee
      s+=`<ellipse cx="725" cy="420" rx="44" ry="13" ${attrs(i++)}/><path d="M690 421 H760 L752 496 Q725 510 698 496 Z" ${attrs(i++)}/><path d="M760 442 q38 -5 33 25 q-4 20 -36 17" data-outline="1"/>`;
      // passport + boarding pass
      s+=`<rect x="555" y="404" width="105" height="145" rx="5" transform="rotate(8 608 477)" ${attrs(i++)}/><circle cx="611" cy="468" r="27" data-outline="1"/><path d="M590 468 h42 M611 441 q-20 27 0 54 M611 441 q20 27 0 54" data-outline="1" class="thin"/><rect x="430" y="430" width="115" height="62" transform="rotate(-5 488 461)" ${attrs(i++)}/><path d="M446 450 H516 M446 462 H503 M446 474 H523" data-outline="1" class="thin"/>`;
      // book
      s+=`<path d="M326 399 Q397 383 446 420 L437 535 Q389 508 323 529 Z" ${attrs(i++)}/><path d="M446 420 Q505 392 560 416 L560 526 Q508 506 437 535 Z" ${attrs(i++)}/><path d="M446 420 L437 535" data-outline="1"/>`;
      // headphones
      s+=`<path d="M632 311 Q700 245 768 311" data-outline="1"/><rect x="618" y="304" width="33" height="70" rx="15" ${attrs(i++)}/><rect x="756" y="304" width="33" height="70" rx="15" ${attrs(i++)}/>`;
      // little flight path + stars
      s+=`<path d="M344 155 q118 55 214 3 t191 7" data-outline="1" class="thin"/><path d="M742 151 l35 10 l-35 10 l7 -10 Z" ${attrs(i++)}/>`+star(365,116,7)+star(543,114,5)+star(814,108,8);
      // tote corner
      s+=`<path d="M770 505 H849 L859 573 H754 Z" ${attrs(i++)}/><path d="M783 507 Q800 467 830 507" data-outline="1"/>`;
      return s;
    };

    const sceneFns={desk,market,apartment,window:windowSeat};

    const doodles=()=>{
      let s=`<svg viewBox="0 0 540 610" aria-label="Colouring book contents doodles"><g fill="none" stroke="#111" stroke-width="2">`;
      s+=`<circle cx="93" cy="102" r="42"/><path d="M57 102 h72 M93 60 v84"/><path d="M173 72 q42 20 82 0 q-39 48 -82 0 Z"/><rect x="314" y="56" width="90" height="118" rx="12"/><path d="M334 82 h50 M334 105 h36 M334 129 h43"/>`;
      s+=`<path d="M62 228 q35 -60 70 0 q-35 62 -70 0 Z"/><path d="M73 228 q24 -34 48 0 q-24 34 -48 0 Z"/><path d="M187 211 h99 l-12 74 h-75 Z"/><path d="M204 210 q14 -42 32 0 q18 -46 32 0"/><circle cx="379" cy="251" r="53"/><circle cx="379" cy="251" r="18"/>`;
      s+=`<path d="M74 362 h100 l20 116 h-132 Z"/><path d="M91 362 q16 -49 43 0"/><path d="M254 354 q38 -72 76 0"/><rect x="242" y="350" width="100" height="79" rx="24"/><path d="M396 337 q52 22 79 84 q-61 9 -99 -32 Z"/>`;
      s+=`<path d="M63 525 q38 -55 75 0 q-36 41 -75 0 Z"/><circle cx="245" cy="523" r="34"/><path d="M211 523 h68 M245 489 v68"/><path d="M377 493 h87 v66 h-87 Z"/><path d="M389 511 h63 M389 527 h45 M389 543 h56"/>`;
      s+=`</g></svg>`;return s;
    };
    const dd=document.getElementById('book-doodle-page');if(dd)dd.innerHTML=doodles();
    document.querySelectorAll('.book-preview').forEach(svg=>{const fn=sceneFns[svg.dataset.scene];if(fn)svg.innerHTML=fn()});

    const applyPaint=(el,paint)=>{
      if(!el?.hasAttribute('data-fillable'))return;
      const brush=paint.brush||'crayon', colour=paint.colour||currentColour;
      el.style.fill=colour;
      el.style.fillOpacity=brush==='pencil'?'.48':brush==='crayon'?'.78':'1';
      el.style.filter=brush==='crayon'?'url(#crayonNoise)':'none';
    };
    const paint=(el)=>{if(!el?.hasAttribute('data-fillable'))return;const value={colour:currentColour,brush:currentBrush};states[currentPage][el.dataset.index]=value;applyPaint(el,value)};
    const render=()=>{
      if(!canvas)return;
      canvas.innerHTML=sceneFns[currentPage]();
      canvas.querySelectorAll('[data-fillable]').forEach(el=>{const v=states[currentPage][el.dataset.index];if(v)applyPaint(el,v)});
      const [t,sub,num]=titles[currentPage];
      document.getElementById('colour-title').textContent=t;document.getElementById('colour-subtitle').textContent=sub;document.getElementById('colour-page-number').textContent=num;
    };
    const pal=document.getElementById('colour-palette');
    palette.forEach((c,i)=>{const b=document.createElement('button');b.className='colour-swatch'+(i===0?' active':'');b.style.setProperty('--c',c);b.setAttribute('aria-label',`Choose ${c}`);b.addEventListener('click',()=>{currentColour=c;pal.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active')});pal?.appendChild(b)});
    document.getElementById('colour-page-tabs')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;currentPage=b.dataset.page;document.querySelectorAll('#colour-page-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()});
    document.getElementById('colour-brushes')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;currentBrush=b.dataset.brush;document.querySelectorAll('#colour-brushes button').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
    canvas?.addEventListener('pointerdown',e=>{painting=true;paint(e.target);canvas.setPointerCapture?.(e.pointerId)});
    canvas?.addEventListener('pointermove',e=>{if(!painting)return;const el=document.elementFromPoint(e.clientX,e.clientY);if(el&&canvas.contains(el))paint(el)});
    window.addEventListener('pointerup',()=>painting=false);
    document.getElementById('colour-reset')?.addEventListener('click',()=>{states[currentPage]={};render()});
    document.getElementById('colour-random')?.addEventListener('click',()=>{canvas.querySelectorAll('[data-fillable]').forEach(el=>{const v={colour:palette[Math.floor(Math.random()*palette.length)],brush:['crayon','pencil','felt'][Math.floor(Math.random()*3)]};states[currentPage][el.dataset.index]=v;applyPaint(el,v)})});
    render();
  }

})();
