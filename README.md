# Pitch Correction Studio v0.2.0 Alpha

Functional experimental pitch shifting browser app. `npm install && npm run build`; `npm test`. Cloudflare Pages build command `npm run build`, output `dist`, root repository. GitHub Pages via `.github/workflows/deploy.yml`.

## Implemented
- Browser-supported audio decoding, waveform, YIN F0 analysis and display, before/after playback, +/-12 semitone offline grain-based pitch shifting, 16-bit PCM WAV export. Original buffer remains untouched.
- Synchronous windowed overlap-add grain resampling keeps output sample count; it is **not** production-quality PSOLA. On sustained vocals it can cause periodic grain artifacts, phase cancellation, timbral/formant changes and pitch tracking errors. It does not preserve formants.

## Limitations / unimplemented
- No precise note segmentation, curve editing, automatic tuning, 24-bit export UI, offline worker processing, transport seek/loop, full iPad performance validation, or long-file memory safeguards. Render runs on main thread and can stall Safari on long files. Audio format support depends on browser decoder. No commercial quality guarantee. Tests use synthetic tones and are not subjective listening tests.
