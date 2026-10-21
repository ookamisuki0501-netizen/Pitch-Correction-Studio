import test from 'node:test';import assert from 'node:assert/strict';import {detectPitch} from '../Analysis/PitchDetector.js';import {shiftPitch} from '../DSP/GranularPitchShifter.js';import {encodeWav} from '../Audio/AudioExporter.js';
const sr=22050,n=sr*2,sine=f=>Float32Array.from({length:n},(_,i)=>0.6*Math.sin(2*Math.PI*f*i/sr));
const hz=x=>detectPitch(x.subarray(Math.floor(sr*.5),Math.floor(sr*.5)+4096),sr).hz;
test('440 Hz YIN',()=>assert.ok(Math.abs(hz(sine(440))-440)<5));
test('+12 semitones real output',()=>assert.ok(Math.abs(hz(shiftPitch(sine(440),2,sr))-880)<25));
test('-12 semitones real output',()=>assert.ok(Math.abs(hz(shiftPitch(sine(440),.5,sr))-220)<15));
test('preserves sample count',()=>assert.equal(shiftPitch(sine(440),1.5,sr).length,n));
test('WAV contains modified PCM',()=>{const a=sine(440),b=shiftPitch(a,2,sr),wav=encodeWav([b],sr);assert.equal(new DataView(wav).getUint32(24,true),sr);assert.equal(wav.byteLength,44+n*2);assert.notEqual(new DataView(wav).getInt16(100,true),Math.round(a[28]*32767));});
test('silence unvoiced',()=>assert.equal(detectPitch(new Float32Array(4096),sr).voiced,false));
