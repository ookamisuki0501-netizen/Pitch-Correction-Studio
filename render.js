import {pitchShift} from './pitch-shift.js';
export function renderNotes(input,notes,rate){
 const out=input.slice();
 for(const note of notes){
  const semitones=(note.midi-note.originalMidi)+(note.offset||0);
  if(Math.abs(semitones)<.01)continue;
  const a=Math.max(0,Math.floor(note.start*rate)),b=Math.min(input.length,Math.ceil(note.end*rate));if(b-a<rate*.055)continue;
  const pad=Math.min(Math.floor(rate*.08),Math.floor((b-a)/3));
  const left=Math.max(0,a-pad),right=Math.min(input.length,b+pad);
  const shifted=pitchShift(input.subarray(left,right),Math.max(-12,Math.min(12,semitones)),rate);
  const fade=Math.max(1,Math.min(Math.floor(rate*.025),Math.floor((b-a)/3)));
  for(let i=a;i<b;i++){const t=Math.min(1,(i-a)/fade,(b-1-i)/fade);out[i]=input[i]*(1-t)+shifted[i-left]*t}
 }
 return out;
}
