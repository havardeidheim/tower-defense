# Road Defender: Revenge of the Road

A tower defense game, kept here in four versions side by side:

| Folder | What it is |
|---|---|
| `original-java-game/` | The original Java (Swing) game: source, images and level files. The reference for gameplay and balance. |
| `opus-4-6-manual-port/` | TypeScript port made by Claude Opus 4.6 and then polished by hand. Reworked UI, and some balance changes. Deployed to GitHub Pages. |
| `full-direct-port/` | TypeScript port written directly from the Java source, as close to the original as possible, including its balance and quirks. |
| `polished-port/` | TypeScript port with a clean architecture (fixed 20 ms ticks, no ported Java timers) and the original's gameplay, checked tick by tick against `full-direct-port/` in its tests. Known bugs fixed; UI and gameplay changes come next. |

Each TypeScript port is a self-contained Vite + TypeScript + Canvas project with its own
`package.json`, `public/` assets and `CLAUDE.md`. Read the `CLAUDE.md` in the folder you are working in.
Keep changes inside one port unless asked otherwise. The ports do not share code, except that
the polished port's tests run `full-direct-port/` as the reference.

## Running

```bash
cd opus-4-6-manual-port && npm install && npm run dev   # http://localhost:8080
cd full-direct-port && npm install && npm run dev       # http://localhost:8081
cd polished-port && npm install && npm run dev          # http://localhost:8082
```

The dev servers listen on the network and accept any hostname, so they can be reached
from other machines (for example `http://knurr:8081` over Tailscale).

## Sounds

The `.wav` files are not in git. Copy them into `public/sounds/` in each port. Without them
the games run silently.
