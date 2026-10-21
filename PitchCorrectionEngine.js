import {shiftPitch} from '../DSP/GranularPitchShifter.js';
export function correctChannels(channels,sampleRate,semitones){const ratio=2**(semitones/12);return channels.map(ch=>shiftPitch(ch,ratio,sampleRate));}
