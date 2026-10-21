// YIN cumulative mean normalized difference, silence and periodicity gates.
export function detectPitch(samples,sampleRate,{minHz=65,maxHz=1400}={}) {
 const x=samples, n=x.length;let energy=0;for(let i=0;i<n;i++)energy+=x[i]*x[i];
 if(energy/n<1e-7)return {hz:0,confidence:0,voiced:false};
 const lo=Math.max(2,Math.floor(sampleRate/maxHz)),hi=Math.min(Math.floor(sampleRate/minHz),Math.floor(n/2)-1);
 if(hi<=lo)return {hz:0,confidence:0,voiced:false};
 const d=new Float64Array(hi+1);for(let t=1;t<=hi;t++){let s=0;for(let i=0;i<n-hi;i++){const v=x[i]-x[i+t];s+=v*v;}d[t]=s;}
 let sum=0,best=-1,bestVal=Infinity;for(let t=1;t<=hi;t++){sum+=d[t];d[t]=d[t]*t/(sum||1);}
 for(let t=lo;t<=hi;t++){if(d[t]<bestVal){bestVal=d[t];best=t;}if(d[t]<0.12){while(t<hi&&d[t+1]<d[t])t++;best=t;break;}}

 if(best<0||d[best]>0.28)return {hz:0,confidence:0,voiced:false};
 const a=d[best-1]??d[best],b=d[best],c=d[best+1]??b,delta=Math.abs(a-2*b+c)>1e-12?0.5*(a-c)/(a-2*b+c):0;
 return {hz:sampleRate/(best+Math.max(-1,Math.min(1,delta))),confidence:Math.max(0,1-d[best]),voiced:true};
}
export function trackPitch(samples,sampleRate,step=0.025){const size=Math.min(samples.length,Math.max(2048,Math.round(sampleRate*0.085)));const hop=Math.max(1,Math.round(step*sampleRate));const frames=[];for(let i=0;i+size<=samples.length;i+=hop){const result=detectPitch(samples.subarray(i,i+size),sampleRate);frames.push({time:(i+size/2)/sampleRate,...result});}return frames;}
