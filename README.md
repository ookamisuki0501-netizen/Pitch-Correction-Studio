# Pitch Correction Studio v1.1.0 (Flat Upload Edition)

**All project files are intentionally in one directory.** Extract the ZIP and upload the *individual files* into the GitHub repository root. Do not upload the enclosing folder. No `scripts/`, `UI/` or other nested directories are required. JavaScript modules remain separate files.

## Cloudflare Pages
- Framework: None
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `/`

`npm install` requires no third-party packages. `npm run build` validates imports and copies all runtime assets into `dist/`. `npm test` executes DSP tests. GitHub Pages can serve these files directly without a build.

## Implemented
- Decode browser-supported audio using Web Audio API (WAV/MP3/M4A/AAC, FLAC if supported by Safari)
- Waveform canvas, YIN pitch tracking, visible F0 curve, transpose ±12 semitones
- Worker-based experimental pitch-synchronous overlap-add audio transformation
- Original and processed playback, seeking, stop, 16-bit PCM WAV export with original sample rate and channel count

## Limitations
- Pitch shifter is experimental and not production-grade PSOLA: artifacts can occur on vocals, transitions, breath, and polyphonic signals. Formant preservation is not implemented. Non-voiced regions are passed through. No note editing, automatic scale tuning, 24-bit export, undo/redo or project saving yet.
- For very long recordings, decoding and export require considerable memory; each channel is processed separately in a worker.
- No iPad Safari hardware verification has been performed.
- This is an independent implementation, no proprietary audio libraries.

## Cloudflare Workers deployment (v1.1.1)

Upload **all files**, including `wrangler.jsonc`, to the GitHub repository root. Build command: `npm run build`; deploy command: `npx wrangler deploy`. `wrangler.jsonc` explicitly configures the `dist` static assets directory and prevents Wrangler from guessing Hydrogen. No framework is required. The deploy still requires valid Cloudflare account/project permissions. Do not upload `dist` manually.
