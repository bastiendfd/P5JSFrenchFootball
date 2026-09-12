# P5JS French Football

A small, self-contained **learning visualization** built with [p5.js](https://p5js.org/). It demonstrates a canvas animation loop, simple boundary collisions, scorekeeping, and mouse input through a playful French-football-inspired scene.

## Run it

This is a static site with no build step.

1. Serve the repository directory with any static web server, for example:
   ```sh
   python -m http.server 8000
   ```
2. Open [http://localhost:8000](http://localhost:8000) in a browser.
3. Click the ball, then click elsewhere on the pitch to send it in that direction. Score by moving the ball through either goal.

The page loads a pinned p5.js release from cdnjs with Subresource Integrity (SRI). An internet connection is required for that one library asset when using the demo as provided.

## Validate

No dependencies need to be installed:

```sh
node tests/validate-static.mjs
```

The validator checks the p5.js asset reference and its SRI metadata, confirms the removed local-library references stay absent, validates the editor configuration, and runs `node --check` on `sketch.js`.

## Project layout

- `index.html` — document structure and pinned p5.js CDN asset
- `sketch.js` — the p5.js sketch
- `style.css` — responsive page styling
- `tests/validate-static.mjs` — dependency-free static checks

## Notes

This is an educational visual experiment, not an official French Football Federation or national-team product. The French comments in the source are retained from the original sketch; public documentation is maintained in English.

## Security

Please see [SECURITY.md](SECURITY.md) for vulnerability-reporting guidance.
