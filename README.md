# Pitch Correction Studio v1.0.0 — Clean-room rebuild

This project was created **from an empty directory**. It does not reuse prior source files. It is an experimental working audio editor, **not** a commercial-grade correction engine.

## Features
- Browser-native WAV/MP3/M4A/AAC decoding where supported by Safari; FLAC is browser-dependent.
- Actual waveform display, YIN fundamental-frequency tracking and visual pitch contour.
- Experimental pitch-synchronous overlap-add pitch transposition (-12 to +12 semitones) in a dedicated Web Worker. This changes the actual audio samples and does not change playback rate. Stereo channels are processed separately.
- Original/processed comparison, play/pause/stop/seek, 16-bit PCM WAV export of processed samples at original sample rate.
- No server required; static deployment.

## Build
`npm install` (zero third-party dependencies), `npm test`, `npm run build`.
Deploy the **contents** of this folder to repository root. Cloudflare Pages: build command `npm run build`, output directory `dist`, root `/`. GitHub Pages: upload the `dist/` contents to a Pages-enabled branch or configure a workflow.

## Algorithms and limitations
YIN uses cumulative mean normalized difference and threshold-based minimum selection; no neural model. The pitch shifter estimates a representative F0 with YIN, uses period-spaced synthesis windows and interpolated sample reads with overlap normalization. It is a simplified pitch-synchronous overlap-add approach, not full adaptive PSOLA. It does **not** preserve formants, and can cause phasing, metallic artifacts, transient smearing and discontinuities, especially on polyphonic sources. It does not offer per-note manual editing, automatic tuning, drift/vibrato editing, 24-bit WAV, project serialization, streaming for long recordings or live editing. Long files require substantial memory. Export uses the same rendered signal as preview. Orbitron is loaded from Google Fonts with a system fallback if offline.

## Verification
`npm test` exercises YIN 440 Hz, silence, noise, +12 and -12 semitone audio output, duration preservation, and modified PCM export. This does not establish perceptual quality. Safari device testing is still required.
