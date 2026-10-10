# Pitch Correction Studio

Version **0.1.0 Alpha** — Phase 1 implementation. English UI, designed for iPad Safari and static hosting.

## Run

```sh
npm install
npm run dev
npm run build
npm test
```

Deploy the contents of `dist/` to GitHub Pages, or use the included GitHub Actions workflow (Settings → Pages → GitHub Actions). Vite uses a relative base path.

## Implemented

- Audio import via browser `decodeAudioData` (WAV/MP3/M4A/AAC/FLAC only where Safari supports decoding).
- Audio sample rate, channel count, duration and file name display.
- Original audio playback, pause, stop, waveform seek and looping through Web Audio API.
- Actual waveform peak extraction from decoded audio; scrollable/zoomable piano-roll grid with note names.
- Two-finger pinch and pan gesture foundation for pitch grid; slider zoom and horizontal scroll.
- Audio stays unmodified. No pitch correction is claimed or applied.

## Not implemented

Phase 2: F0 analysis, voicing, note detection. Phase 3: note and curve editing. Phase 4: pitch shifting, PSOLA, formants, transient protection. Phase 5: Auto-Tune. Phase 6: undo/redo, project save, WAV export. Phase 7: quality and performance optimization. AudioWorklet processing, background rendering and long-file streaming are not yet implemented. Current decoding holds a full decoded file in memory; large recordings may exhaust Safari memory. The waveform is a downsampled visualization. Orbitron is loaded from Google Fonts when online; system font is the offline fallback. Safari device testing and listening tests remain pending.

## Architecture

`UI` draws views and forwards interactions; `Audio` decodes, stores and plays audio; `Analysis` will produce time-stamped F0; `Correction` will render pitch edits; `DSP` will hold reusable math; `Editor` will store nondestructive edit commands; `Project` will serialize project state; `Workers` will host compute-intensive jobs; `Utils` provides shared values; `Tests` contains automated tests. These future modules are not represented by empty placeholder files.

## License

MIT. See LICENSE.
