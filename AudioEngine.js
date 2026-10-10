import {PlaybackEngine} from './PlaybackEngine.js';
export function createAudioEngine(onTick){const context=new (window.AudioContext||window.webkitAudioContext)();return {context,playback:new PlaybackEngine(context,onTick)};}
