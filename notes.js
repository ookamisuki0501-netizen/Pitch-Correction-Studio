export const hzToMidi=hz=>69+12*Math.log2(hz/440);
export const midiToHz=m=>440*2**((m-69)/12);
const median=a=>{const b=[...a].sort((x,y)=>x-y);return b[Math.floor(b.length/2)]};
export function segmentNotes(frames,duration){
 const clean=frames.map((f,i)=>{if(!f.hz||f.confidence<.73)return null;const m=hzToMidi(f.hz);if(m<35||m>95)return null;const nearby=frames.slice(Math.max(0,i-2),Math.min(frames.length,i+3)).filter(x=>x.hz&&x.confidence>=.73).map(x=>hzToMidi(x.hz));if(nearby.length<2)return null;const sm=median(nearby);return Math.abs(m-sm)>2.3?null:sm});
 // Fill only isolated one-frame gaps, not real rests.
 for(let i=1;i<clean.length-1;i++)if(clean[i]===null&&clean[i-1]!==null&&clean[i+1]!==null&&Math.abs(clean[i-1]-clean[i+1])<.9)clean[i]=(clean[i-1]+clean[i+1])/2;
 const hop=frames.length>1?frames[1].time-frames[0].time:.02;const groups=[];let current=[];
 function flush(){if(current.length>=4){const vals=current.map(i=>clean[i]);const start=Math.max(0,frames[current[0]].time-hop/2),end=Math.min(duration,frames[current.at(-1)].time+hop/2);if(end-start>=.09)groups.push({start,end,pitch:median(vals),indices:current.slice()})}current=[]}
 for(let i=0;i<clean.length;i++){if(clean[i]===null){flush();continue}if(current.length){const last=current.at(-1);const recent=median(current.slice(-7).map(j=>clean[j]));if(i-last>1||Math.abs(clean[i]-recent)>1.65){flush()}}current.push(i)}flush();
 // Join short interruptions with matching pitch, but preserve meaningful note changes.
 const joined=[];for(const g of groups){const prev=joined.at(-1);if(prev&&g.start-prev.end<.09&&Math.abs(g.pitch-prev.pitch)<.7){prev.end=g.end;prev.indices.push(...g.indices);prev.pitch=median(prev.indices.map(i=>clean[i]))}else joined.push(g)}
 return joined.map((g,i)=>({id:i+1,start:g.start,end:g.end,midi:Math.round(g.pitch),originalMidi:g.pitch,offset:0,confidence:g.indices.reduce((s,j)=>s+frames[j].confidence,0)/g.indices.length}));
}
