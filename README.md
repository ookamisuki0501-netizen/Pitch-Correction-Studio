# Pitch Correction Studio v0.2.2 Alpha

## Fixes and root cause
Previous releases repeatedly failed in Cloudflare because GitHub repository paths did not match the imported module paths or a referenced prebuild script was missing. This release has a **zero-dependency native ES-module build**. The build validates all statically imported local modules, plus worker URL modules, and copies the runnable app to `dist/`. This removes reliance on remote Vite installation; `vite.config.js` is retained as optional compatibility configuration but **Vite is not used for this build**.

## Commands
`npm install` (no dependencies), `npm test`, `npm run build`, `npm run dev`.

Cloudflare Pages: Build command `npm run build`, output `dist`, repository root `/`. Upload the **contents** of this project's folder into the GitHub repository root. Verify `UI/App.js` and `Workers/AudioWorker.js` exist on GitHub with exactly this capitalization.

## Implemented
Browser decoding of Safari-supported audio files, waveform, YIN F0 tracking, fixed semitone correction using windowed overlap-add resampling, before/after playback, 16-bit PCM WAV export, dedicated Web Worker for F0 analysis and rendering, sample count preserved, non-destructive original audio. Audio decoding is browser codec dependent; FLAC is not guaranteed.

## Limitations / NOT implemented
Not production-grade vocal correction; grain overlap-add may color the sound, smear transients, and alter formants. No note-specific correction, manual pitch curve editing, robust voiced/unvoiced classification, real-time preview, PSOLA, formant preservation, 24/32-bit WAV UI, undo/redo, project persistence, or AudioWorklet playback. Full decoded audio and copied worker buffers may exhaust iPad memory on long files. Safari actual-device playback and codec support remain unverified. A build passing does not imply perceptual quality.

## Deployment
Both `Pitch-Correction-Studio-v0.2.2.zip` (project folder) and `Pitch-Correction-Studio-v0.2.2-repository-root.zip` (repository contents) are supplied. Do not upload a nested project folder when root is `/`.
