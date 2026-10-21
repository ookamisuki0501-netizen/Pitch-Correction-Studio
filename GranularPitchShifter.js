// Windowed synchronous overlap-add with intra-grain resampling.
// Preserves total sample count; grain-phase resets may create coloration.
export function shiftPitch(input,ratio,sampleRate){
 if(!Number.isFinite(ratio)||ratio<=0)throw Error('Invalid pitch ratio');
 if(Math.abs(ratio-1)<1e-8)return new Float32Array(input);
 const n=input.length,out=new Float32Array(n),weights=new Float32Array(n);
 const grain=Math.max(512,Math.round(sampleRate*0.09)),hop=Math.max(64,Math.floor(grain/20));
 for(let center=0;center<n+grain/2;center+=hop){
  for(let j=0;j<grain;j++){
   const dst=center+j-grain/2|0;if(dst<0||dst>=n)continue;
   const src=center+(j-grain/2)*ratio;
   if(src<0||src>=n-1)continue;
   const a=Math.floor(src),frac=src-a;
   const w=0.5-0.5*Math.cos(2*Math.PI*j/(grain-1));
   out[dst]+=((1-frac)*input[a]+frac*input[a+1])*w;weights[dst]+=w;
  }
 }
 for(let i=0;i<n;i++)out[i]=weights[i]>1e-8?out[i]/weights[i]:input[i];
 return out;
}
