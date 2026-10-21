export function encodeWav(channels,sampleRate,bitDepth=16){
 if(![16,24].includes(bitDepth))throw Error('Unsupported bit depth');const n=channels[0].length,c=channels.length,b=bitDepth/8;const bytes=new ArrayBuffer(44+n*c*b),v=new DataView(bytes);const str=(off,s)=>{for(let i=0;i<s.length;i++)v.setUint8(off+i,s.charCodeAt(i));};
 str(0,'RIFF');v.setUint32(4,36+n*c*b,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,c,true);v.setUint32(24,sampleRate,true);v.setUint32(28,sampleRate*c*b,true);v.setUint16(32,c*b,true);v.setUint16(34,bitDepth,true);str(36,'data');v.setUint32(40,n*c*b,true);
 let off=44;for(let i=0;i<n;i++)for(let ch=0;ch<c;ch++){const x=Math.max(-1,Math.min(1,channels[ch][i]));if(bitDepth===16){v.setInt16(off,Math.round(x<0?x*32768:x*32767),true);off+=2;}else{let k=Math.round(x<0?x*8388608:x*8388607);v.setUint8(off++,k&255);v.setUint8(off++,(k>>8)&255);v.setUint8(off++,(k>>16)&255);}}return bytes;
}
