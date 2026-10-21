# Pitch Correction Studio

Version **0.1.1 Alpha** — Phase 1 implementation. English UI, designed for iPad Safari and static hosting.

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

## Cloudflare Pages deployment (important)

Upload **all files and folders inside `Pitch-Correction-Studio/`** to the root of your GitHub repository. Do not upload only `index.html`, and do not place the entire `Pitch-Correction-Studio` directory one level below the repository root unless Cloudflare's **Root directory** is set to `Pitch-Correction-Studio`.

In Cloudflare Pages > Settings > Builds & deployments, use:

- Framework preset: `Vite` (or None)
- Root directory: `/` if `package.json`, `main.js`, `UI/` are at repository root
- Build command: `npm run build`
- Build output directory: `dist`
- Environment: Node.js 20+ recommended

The source file `main.js` imports `UI/App.js`; case-sensitive names matter on Cloudflare Linux. The build must have the complete `UI/`, `Audio/`, and `Utils/` folders. If a build reports missing `UI/App.js`, check GitHub's file browser for that exact path and verify Cloudflare's Root directory setting. ZIP extraction alone does not publish files to GitHub.

Run `npm run check` before deploying. This validates local source structure and automated unit tests. A full Vite build requires installing npm dependencies.

## v0.1.1 changes

- Added an explicit root `main.js` entrypoint and clearer HTML module reference.
- Added source structure validation and a Cloudflare entry test.
- Added Cloudflare deployment instructions and static security headers.
- No new pitch correction features are claimed in this patch.


## v0.1.2 deployment fix
Cloudflare Pages must use the repository root containing `index.html`, `main.js`, and `UI/App.js`. Upload the **contents** of `Pitch-Correction-Studio/` to the repository root, not the enclosing directory. `npm run build` now checks missing files before Vite. If GitHub does not show `UI/App.js` at the repository root, the deployment cannot succeed. This is a Phase 1 build/package fix; pitch correction remains unimplemented.
