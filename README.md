# All Hearts GIVE Bazaar

Signup site for the Studio+91 GIVE Bazaar (Kite All Hearts, 23 October 2026).
Live: https://vibehub.microsoft.com/app/ranjithravi-kq9qtf/

## Files
- `index.html`, `styles.css`, `app.js` — the site (plain HTML/CSS/JS, no build step)
- `vibehub-storage-local.js` — local stand-in for VibeHub storage when running locally
- `last-year/`, `fonts/`, `*.png` — assets

## Run locally
```
python3 -m http.server 4173
```
Open http://127.0.0.1:4173

## Publish to VibeHub
1. `git pull` to get the latest changes.
2. Zip the site files (everything except `test-results/`, `README.md`, `.gitignore`).
3. Upload the zip as a new version of project `ranjithravi-kq9qtf` on VibeHub (co-owners only).
4. Commit and push your changes so the repo matches what's live.
