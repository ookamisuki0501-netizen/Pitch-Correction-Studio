// Overlap-add pitch shifter: time is preserved; individual grains are resampled.
// This is experimental DSP, not a formant-preserving commercial vocal engine.
export function pitchShift(input,semitones,sampleRate){
 if(!Number.isFinite(semitones)||Math.abs(semitones)>12)throw Error('Transpose must be within ±12 semitones');
 const n=input.length,ratio=2**(semitones/12);if(Math.abs(semitones)<.001)return input.slice();
 const out=new Float32Array(n),weights=new Float32Array(n);
 const grain=Math.min(n,Math.max(256,Math.round(sampleRate*.060))),hop=Math.max(64,Math.round(grain/6)),half=Math.floor(grain/2);
 if(grain<256)return input.slice();
 for(let center=0;center<n+half;center+=hop){
  for(let j=0;j<grain;j++){
   const dst=center+j-half;if(dst<0||dst>=n)continue;
   const src=center+(j-half)*ratio;const k=Math.floor(src);if(k<0||k+1>=n)continue;
   const phase=(j+.5)/grain,w=.5-.5*Math.cos(2*Math.PI*phase);
   const v=input[k]+(input[k+1]-input[k])*(src-k);
   out[dst]+=v*w;weights[dst]+=w;
  }
 }
 for(let i=0;i<n;i++)out[i]=weights[i]>1e-6?out[i]/weights[i]:input[i];
 return out;
}
