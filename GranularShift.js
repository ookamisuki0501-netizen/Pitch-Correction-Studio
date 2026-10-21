import {yin} from '../Analysis/YIN.js';
// Experimental pitch-synchronous resynthesis for sustained monophonic voiced signals.
export function pitchShift(input,semitones,sampleRate){
 if(!Number.isFinite(semitones)||Math.abs(semitones)>24)throw Error('Invalid transpose');
 const ratio=2**(semitones/12),n=input.length;if(ratio===1)return input.slice();
 const probe=Math.min(n,Math.round(sampleRate*.09));const f0=probe>=2048?yin(input.subarray(Math.min(Math.floor(n/4),Math.max(0,n-probe)),Math.min(n,Math.floor(n/4)+probe)),sampleRate):null;
 if(!f0)return input.slice();
 const sourcePeriod=sampleRate/f0.hz,targetPeriod=sourcePeriod/ratio;
 const radius=Math.max(8,Math.ceil(targetPeriod));const out=new Float32Array(n),weights=new Float32Array(n);
 // Match source epochs to output epochs by time, with Hann windows over two target periods.
 for(let center=0;center<n+radius;center+=targetPeriod){
  const sourceCenter=Math.round(center/sourcePeriod)*sourcePeriod;
  const begin=Math.max(0,Math.floor(center-radius)),end=Math.min(n,Math.ceil(center+radius));
  for(let t=begin;t<end;t++){
   const d=t-center,src=sourceCenter+d*ratio,idx=Math.floor(src);
   if(idx<0||idx+1>=n)continue;
   const weight=.5+.5*Math.cos(Math.PI*d/radius),sample=input[idx]*(1-(src-idx))+input[idx+1]*(src-idx);
   out[t]+=sample*weight;weights[t]+=weight;
  }
 }
 for(let i=0;i<n;i++)out[i]=weights[i]>1e-5?out[i]/weights[i]:input[i];return out;
}
