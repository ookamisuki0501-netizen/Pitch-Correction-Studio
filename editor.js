import {hzToMidi} from './notes.js';
export function createEditor(canvas,onEdit,onSeek=()=>{}){
 const ctx=canvas.getContext('2d');let notes=[],frames=[],duration=1,selected=null,playhead=0;
 let zoom=1,scroll=0,centerMidi=60,semi=23;const left=62,top=34;let drag=null,gesture=null;const pointers=new Map();
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const w=()=>canvas.getBoundingClientRect().width,h=()=>canvas.getBoundingClientRect().height;
 const view=()=>Math.max(.5,12/zoom),pps=()=>Math.max(1,w()-left)/view(),maxScroll=()=>Math.max(0,duration-view());
 const xAt=t=>left+(t-scroll)*pps(),timeAt=x=>scroll+(x-left)/pps();
 const yAt=m=>top+(h()-top)/2+(centerMidi-m)*semi,midiAt=y=>centerMidi-(y-top-(h()-top)/2)/semi;
 const pos=e=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(3,devicePixelRatio||1);if(!r.width||!r.height)return;canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
 function draw(){const W=w(),H=h();if(!W||!H)return;ctx.clearRect(0,0,W,H);ctx.fillStyle='#101522';ctx.fillRect(0,0,W,H);
  const lo=clamp(Math.floor(midiAt(H)-1),0,127),hi=clamp(Math.ceil(midiAt(top)+1),0,127);
  ctx.font='11px system-ui';
  for(let m=lo;m<=hi;m++){const y=yAt(m),black=[1,3,6,8,10].includes(m%12),oct=m%12===0;
   ctx.fillStyle=black?'#192237':'#22314a';ctx.fillRect(0,y-semi/2,left,semi);
   ctx.fillStyle=black?'#101827':'#182336';ctx.fillRect(left,y-semi/2,W-left,semi);
   ctx.strokeStyle=oct?'#6c839f':'#304057';ctx.beginPath();ctx.moveTo(0,y+semi/2);ctx.lineTo(W,y+semi/2);ctx.stroke();
   ctx.fillStyle=oct?'#f0f5ff':'#b3c3d7';ctx.fillText(['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][m%12]+(Math.floor(m/12)-1),6,y+4);
  }
  ctx.save();ctx.beginPath();ctx.rect(left,top,W-left,H-top);ctx.clip();
  const step=view()>18?5:view()>7?2:view()>3?1:.25;ctx.strokeStyle='#34475c';for(let t=Math.ceil(scroll/step)*step;t<=Math.min(duration,scroll+view());t+=step){const x=xAt(t);ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,H);ctx.stroke()}
  // Show detected F0 as a continuous, discontinuity-aware contour rather than random dots.
  ctx.strokeStyle='#ffb86c';ctx.lineWidth=1.5;ctx.beginPath();let active=false,prevT=-1,prevM=0;
  for(const f of frames){if(!f.hz||f.confidence<.7){active=false;continue}const m=hzToMidi(f.hz),x=xAt(f.time),y=yAt(m);if(x<left-4||x>W+4||y<top-20||y>H+20){active=false;continue}if(!active||f.time-prevT>.07||Math.abs(m-prevM)>2){ctx.moveTo(x,y)}else ctx.lineTo(x,y);active=true;prevT=f.time;prevM=m}ctx.stroke();ctx.lineWidth=1;
  for(const n of notes){const x=xAt(n.start),x2=xAt(n.end),y=yAt(n.midi+(n.offset||0));if(x2<left||x>W||y<top-20||y>H+20)continue;
   const bx=Math.max(left,x),bw=Math.max(2,x2-bx),bh=Math.min(20,semi-3);ctx.fillStyle=n.id===selected?'#69e4ef':'#478fd0';ctx.fillRect(bx,y-bh/2,bw,bh);ctx.strokeStyle='#c3e9ff';ctx.strokeRect(bx+.5,y-bh/2+.5,Math.max(0,bw-1),bh-1);
   if(bw>35){ctx.fillStyle='#081827';ctx.fillText(['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][n.midi%12]+(Math.floor(n.midi/12)-1),bx+4,y+4)}
  }
  const ph=xAt(playhead);if(ph>=left&&ph<=W){ctx.strokeStyle='#ff647c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ph,top);ctx.lineTo(ph,H);ctx.stroke();ctx.lineWidth=1}
  ctx.restore();ctx.fillStyle='#131e2f';ctx.fillRect(0,0,W,top);ctx.fillStyle='#e2eaf8';for(let t=Math.ceil(scroll/step)*step;t<=Math.min(duration,scroll+view());t+=step){const x=xAt(t);if(x<left)continue;ctx.fillText(t.toFixed(step<1?2:0)+'s',x+3,21)}ctx.fillStyle='#25334a';ctx.fillRect(0,0,left,top);ctx.fillStyle='#c9d7e9';ctx.fillText('PITCH',6,21);if(ph>=left&&ph<=W){ctx.fillStyle='#ff647c';ctx.beginPath();ctx.moveTo(ph-6,top-1);ctx.lineTo(ph+6,top-1);ctx.lineTo(ph,top+7);ctx.fill()}
 }
 function hit(p){if(p.x<left||p.y<top)return null;return [...notes].reverse().find(n=>p.x>=xAt(n.start)-3&&p.x<=xAt(n.end)+3&&Math.abs(p.y-yAt(n.midi+(n.offset||0)))<=Math.max(12,semi/2))||null}
 function emit(commit=false){onEdit(notes,selected,commit)}
 canvas.addEventListener('pointerdown',e=>{e.preventDefault();const p=pos(e);pointers.set(e.pointerId,p);try{canvas.setPointerCapture(e.pointerId)}catch{}
  if(pointers.size>=2){drag=null;const [a,b]=[...pointers.values()],mx=(a.x+b.x)/2,my=(a.y+b.y)/2;gesture={type:'pinch',dist:Math.hypot(a.x-b.x,a.y-b.y)||1,zoom,semi,anchorT:timeAt(mx),anchorM:midiAt(my)};return}
  if(p.y<top&&p.x>=left){onSeek(clamp(timeAt(p.x),0,duration));gesture={type:'seek'};return}
  const n=hit(p);if(n){selected=n.id;drag={id:n.id,startY:p.y,midi:n.midi};gesture=null;emit()}else{selected=null;drag=null;gesture={type:'pan',x:p.x,y:p.y,scroll,centerMidi};emit()}draw()
 });
 canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;e.preventDefault();const p=pos(e);pointers.set(e.pointerId,p);
  if(pointers.size>=2){if(gesture?.type!=='pinch')return;const [a,b]=[...pointers.values()],mx=(a.x+b.x)/2,my=(a.y+b.y)/2,ratio=(Math.hypot(a.x-b.x,a.y-b.y)||1)/gesture.dist;zoom=clamp(gesture.zoom*ratio,.5,16);semi=clamp(gesture.semi*ratio,13,42);scroll=clamp(gesture.anchorT-(mx-left)/pps(),0,maxScroll());centerMidi=clamp(gesture.anchorM+(my-top-(h()-top)/2)/semi,12,115)}
  else if(drag){const n=notes.find(n=>n.id===drag.id);if(n){n.midi=clamp(drag.midi+Math.round((drag.startY-p.y)/semi),0,127);emit()}}
  else if(gesture?.type==='pan'){scroll=clamp(gesture.scroll+(gesture.x-p.x)/pps(),0,maxScroll());centerMidi=clamp(gesture.centerMidi+(p.y-gesture.y)/semi,12,115)}
  else if(gesture?.type==='seek')onSeek(clamp(timeAt(p.x),0,duration));draw()
 });
 function release(e){if(!pointers.has(e.pointerId))return;pointers.delete(e.pointerId);if(drag){drag=null;emit(true)}if(pointers.size<2)gesture=null;draw()}
 for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,release);
 canvas.addEventListener('wheel',e=>{e.preventDefault();const p=pos(e);if(e.ctrlKey||e.metaKey){const t=timeAt(p.x);zoom=clamp(zoom*(e.deltaY<0?1.12:.89),.5,16);scroll=clamp(t-(p.x-left)/pps(),0,maxScroll())}else{scroll=clamp(scroll+(e.deltaX+e.deltaY)/pps(),0,maxScroll())}draw()},{passive:false});
 new ResizeObserver(resize).observe(canvas);resize();
 return{setData(n,f,d){notes=n;frames=f;duration=Math.max(.01,d);selected=null;scroll=0;zoom=clamp(12/Math.min(12,Math.max(2,duration)),.5,16);const vals=notes.map(n=>n.midi);if(vals.length){const min=Math.min(...vals),max=Math.max(...vals);centerMidi=clamp((min+max)/2,12,115);semi=clamp((h()-top-32)/Math.max(12,max-min+4),13,30)}else{centerMidi=60;semi=23}draw();emit()},selected(){return notes.find(n=>n.id===selected)},changeCents(v){const n=this.selected();if(n){n.offset=Number(v)/100;draw();emit(true)}},zoom(v){zoom=clamp(Number(v),.5,16);scroll=clamp(scroll,0,maxScroll());draw()},setPlayhead(t){playhead=t;draw()},seekTo(t){scroll=clamp(t-view()/2,0,maxScroll());draw()},draw};
}
