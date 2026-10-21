import {hzToMidi} from './notes.js';

export function createEditor(canvas,onEdit){
  const ctx=canvas.getContext('2d');
  let notes=[],frames=[],duration=1,selected=null;
  let zoom=1,scroll=0,centerMidi=60,pxPerSemi=22;
  const left=67,top=30,pointers=new Map();
  let gesture=null,drag=null;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const width=()=>canvas.getBoundingClientRect().width;
  const height=()=>canvas.getBoundingClientRect().height;
  const timelineWidth=()=>Math.max(1,width()-left);
  const secondsPerView=()=>Math.max(.5,12/zoom);
  const pixelsPerSecond=()=>timelineWidth()/secondsPerView();
  const maxScroll=()=>Math.max(0,duration-secondsPerView());
  const xAt=t=>left+(t-scroll)*pixelsPerSecond();
  const timeAt=x=>scroll+(x-left)/pixelsPerSecond();
  const yAt=m=>top+(height()-top)/2+(centerMidi-m)*pxPerSemi;
  const midiAt=y=>centerMidi-(y-top-(height()-top)/2)/pxPerSemi;
  const pos=e=>{const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};};
  function size(){
    const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
    if(!r.width||!r.height)return;
    canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function draw(){
    const w=width(),h=height();if(!w||!h)return;
    ctx.fillStyle='#101522';ctx.fillRect(0,0,w,h);
    ctx.font='11px system-ui';
    const lo=Math.max(0,Math.floor(midiAt(h)-1)),hi=Math.min(127,Math.ceil(midiAt(top)+1));
    for(let m=lo;m<=hi;m++){
      const y=yAt(m),black=[1,3,6,8,10].includes(m%12);
      ctx.fillStyle=black?'#1a2232':'#243048';ctx.fillRect(0,y-pxPerSemi/2,left,pxPerSemi);
      ctx.fillStyle=black?'#121a2a':'#1a2639';ctx.fillRect(left,y-pxPerSemi/2,w-left,pxPerSemi);
      ctx.strokeStyle=m%12===0?'#66819d':'#304055';
      ctx.beginPath();ctx.moveTo(0,y+pxPerSemi/2);ctx.lineTo(w,y+pxPerSemi/2);ctx.stroke();
      ctx.fillStyle='#d0deee';ctx.fillText(['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][m%12]+(Math.floor(m/12)-1),5,y+4);
    }
    ctx.strokeStyle='#3a4c63';ctx.fillStyle='#b4c4d7';
    const step=secondsPerView()>25?5:secondsPerView()>10?2:secondsPerView()>4?1:.25;
    for(let t=Math.ceil(scroll/step)*step;t<=Math.min(duration,scroll+secondsPerView());t+=step){
      const x=xAt(t);ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,h);ctx.stroke();
      ctx.fillText(t.toFixed(step<1?2:0)+'s',x+3,18);
    }
    for(const f of frames){
      if(!f.hz)continue;
      const x=xAt(f.time),y=yAt(hzToMidi(f.hz));
      if(x<left||x>w||y<top||y>h)continue;
      ctx.fillStyle='#ffba69';ctx.fillRect(x,y-1,2,3);
    }
    for(const n of notes){
      const x=xAt(n.start),end=xAt(n.end),y=yAt(n.midi+(n.offset||0));
      if(end<left||x>w||y<top-20||y>h+20)continue;
      const bx=Math.max(left,x),bw=Math.max(3,end-bx);
      ctx.fillStyle=n.id===selected?'#64dce9':'#5a91dc';
      ctx.fillRect(bx,y-9,bw,18);
      ctx.strokeStyle='#c5e7ff';ctx.strokeRect(bx+.5,y-8.5,bw-1,17);
      if(bw>42){ctx.fillStyle='#071b2c';ctx.fillText(['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][Math.round(n.midi)%12],bx+5,y+4);}
    }
    ctx.fillStyle='#101827';ctx.fillRect(0,0,w,top);
    ctx.fillStyle='#b4c4d7';ctx.fillText(`${scroll.toFixed(1)}–${Math.min(duration,scroll+secondsPerView()).toFixed(1)}s`,left+8,19);
    ctx.fillStyle='#182438';ctx.fillRect(0,0,left,top);
  }
  function hit(x,y){
    if(x<left||y<top)return null;
    return [...notes].reverse().find(n=>x>=xAt(n.start)-5&&x<=xAt(n.end)+5&&Math.abs(y-yAt(n.midi+(n.offset||0)))<=15)||null;
  }
  function emit(committed=false){onEdit(notes,selected,committed);}
  canvas.addEventListener('pointerdown',e=>{
    e.preventDefault();const p=pos(e);pointers.set(e.pointerId,p);
    try{canvas.setPointerCapture(e.pointerId);}catch{}
    if(pointers.size>=2){
      drag=null;
      const a=[...pointers.values()],midX=(a[0].x+a[1].x)/2,midY=(a[0].y+a[1].y)/2;
      gesture={type:'pinch',distance:Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y)||1,zoom,pxPerSemi,anchorTime:timeAt(midX),anchorMidi:midiAt(midY),midX,midY};
      return;
    }
    const n=hit(p.x,p.y);
    if(n){selected=n.id;drag={id:n.id,startY:p.y,original:n.midi};gesture=null;emit();}
    else{drag=null;gesture={type:'pan',startX:p.x,startY:p.y,scroll,centerMidi};}
    draw();
  });
  canvas.addEventListener('pointermove',e=>{
    if(!pointers.has(e.pointerId))return;
    e.preventDefault();const p=pos(e);pointers.set(e.pointerId,p);
    if(pointers.size>=2){
      const a=[...pointers.values()];
      if(!gesture||gesture.type!=='pinch')return;
      const d=Math.hypot(a[1].x-a[0].x,a[1].y-a[0].y)||1;
      const midX=(a[0].x+a[1].x)/2,midY=(a[0].y+a[1].y)/2;
      const ratio=d/gesture.distance;
      zoom=clamp(gesture.zoom*ratio,.5,16);
      pxPerSemi=clamp(gesture.pxPerSemi*ratio,12,42);
      scroll=clamp(gesture.anchorTime-(midX-left)/pixelsPerSecond(),0,maxScroll());
      centerMidi=clamp(gesture.anchorMidi+(midY-top-(height()-top)/2)/pxPerSemi,12,115);
    }else if(drag){
      const n=notes.find(v=>v.id===drag.id);
      if(n){n.midi=clamp(drag.original+Math.round((drag.startY-p.y)/pxPerSemi),0,127);emit();}
    }else if(gesture?.type==='pan'){
      scroll=clamp(gesture.scroll+(gesture.startX-p.x)/pixelsPerSecond(),0,maxScroll());
      centerMidi=clamp(gesture.centerMidi+(p.y-gesture.startY)/pxPerSemi,12,115);
    }
    draw();
  });
  function release(e){
    if(!pointers.has(e.pointerId))return;
    pointers.delete(e.pointerId);
    if(drag){drag=null;emit(true);}
    if(pointers.size===0)gesture=null;
    else if(gesture?.type==='pinch'){gesture=null;drag=null;}
    draw();
  }
  canvas.addEventListener('pointerup',release);
  canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('wheel',e=>{
    e.preventDefault();
    if(e.ctrlKey||e.metaKey){const anchor=timeAt(pos(e).x);zoom=clamp(zoom*(e.deltaY<0?1.12:.89),.5,16);scroll=clamp(anchor-(pos(e).x-left)/pixelsPerSecond(),0,maxScroll());}
    else{scroll=clamp(scroll+e.deltaX/pixelsPerSecond()+e.deltaY/pixelsPerSecond(),0,maxScroll());}
    draw();
  },{passive:false});
  new ResizeObserver(size).observe(canvas);
  size();
  return {
    setData(n,f,d){
      notes=n;frames=f;duration=Math.max(.01,d);selected=null;scroll=0;
      zoom=clamp(12/Math.max(2,Math.min(duration,12)),.5,16);
      const values=notes.map(n=>n.midi).filter(Number.isFinite);
      if(values.length){
        const min=Math.min(...values),max=Math.max(...values);
        centerMidi=clamp((min+max)/2,12,115);
        pxPerSemi=clamp((height()-top-45)/Math.max(12,max-min+5),12,30);
      }else{centerMidi=60;pxPerSemi=22;}
      draw();emit();
    },
    selected(){return notes.find(n=>n.id===selected);},
    changeCents(v){const n=this.selected();if(n){n.offset=Number(v)/100;draw();emit(true);}},
    zoom(v){zoom=clamp(Number(v),.5,16);scroll=clamp(scroll,0,maxScroll());draw();},
    scroll(v){scroll=clamp(Number(v),0,maxScroll());draw();},
    draw
  };
}
