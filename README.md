# Pitch Correction Studio v1.3.0 — Experimental note editor

Client-side iPad Safari-compatible static site. All files stay at repository root for manual GitHub upload.

## Improvements since v1.2.1
- Visible red playhead synchronized to audio playback in piano roll and waveform; time readout and seek via ruler, waveform, or seek slider.
- Notes use the piano-key pitch grid and a continuous detected pitch contour.
- Drag note vertically to change pitch; drag empty area to pan; two fingers to zoom; auto-center pitch range.
- Improved note segmentation: 5-frame median filter, confidence gating, short gap filling, short interruption merging.
- Replaced broken previous pitch shift with windowed granular overlap-add resampling. Edited notes are actually rendered into new WAV samples.
- Canvas DPI-aware resize and viewport-fitting layout.

## Deployment
Cloudflare Workers: Build command `npm run build`, deploy command `npx wrangler deploy`. `wrangler.jsonc` points to `dist` assets. Or Cloudflare Pages output `dist`.

## Local verification
`npm test` and `npm run build`.

## Important limitations
This is **not** equivalent to Melodyne, NewTone, Auto-Tune or other commercial pitch correction tools. The granular shifter is experimental, does **not** preserve formants, and can cause phasing or metallic artifacts on real singing. YIN note detection works best on dry monophonic vocals and may fail on breathy voice, harmonies, instruments, or noisy recordings. The program does not yet have a robust multi-resolution F0 tracker, spectral envelope/formant correction, transient/voiceless preservation, or high-quality time-domain pitch-synchronous processing. Tests are synthetic and do not establish perceived vocal quality. iPad Safari device testing has not been performed.
