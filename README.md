# Pitch Correction Studio v1.2.0 Alpha — Note Editor

Flat-file deployment: upload all root files together to GitHub. No folders are required.

## Working features
- Decode audio supported by Safari; waveform preview
- YIN monophonic pitch tracking and note segmentation
- Touch-select and vertically drag note blocks in piano roll; cents slider
- Render note-by-note pitch changes into actual audio using experimental overlap-add pitch shifter
- Before/After playback, 16-bit WAV export, Web Worker rendering
- Non-destructive source buffer; audio duration preserved

## Limits
- Alpha-quality pitch shifting; **not** equivalent to Melodyne/NewTone. No formant preservation, phase locking, sophisticated transient/sibilant protection, or per-point curve editing.
- Note boundaries and voiced classification can be wrong, especially with noisy or polyphonic audio.
- Touch two-finger pan/pinch not implemented; zoom and scroll sliders provided instead.
- Renders after editing, not instant live processing. Large files may exceed iPad memory.
- Original audio is not bundled in a project file; project save not implemented.

## Commands
`npm install` then `npm test` then `npm run build`. Output `dist/`.

## Cloudflare Workers
Build: `npm run build`; Deploy: `npx wrangler deploy`; `wrangler.jsonc` configures `assets.directory=./dist`.

## Algorithm
YIN difference-function with cumulative mean normalization, confidence gating. Segment contiguous stable F0 frames into notes. Pitch changes are applied to voiced note regions with 18ms crossfades to original; short overlapping window synthesis (experimental), no speed-based transposition.
