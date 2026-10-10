import {decodeAudio} from './AudioDecoder.js';
export async function loadAudio(context,file){if(!file)throw new Error('No file selected');const buffer=await decodeAudio(context,await file.arrayBuffer());return {name:file.name,buffer,sampleRate:buffer.sampleRate,channels:buffer.numberOfChannels,duration:buffer.duration};}
