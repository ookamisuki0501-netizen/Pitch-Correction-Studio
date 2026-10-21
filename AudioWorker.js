import {trackPitch} from '../Analysis/PitchDetector.js';
import {correctChannels} from '../Correction/PitchCorrectionEngine.js';
self.onmessage=({data})=>{const {id,type,channels,sampleRate,semitones}=data;try{if(type==='analyze'){const frames=trackPitch(channels[0],sampleRate);self.postMessage({id,type,frames});}else if(type==='render'){const output=correctChannels(channels,sampleRate,semitones);self.postMessage({id,type,channels:output},output.map(c=>c.buffer));}else throw Error('Unknown worker operation');}catch(e){self.postMessage({id,error:String(e.stack||e)});}};
