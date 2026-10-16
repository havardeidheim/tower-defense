# Road Defender: Revenge of the Road

A tower defense game, kept here in three versions side by side:

| Folder | What it is |
|---|---|
| `original-java-game/` | The original Java (Swing) game: source, images and level files. The reference for gameplay and balance. |
| `opus-4-6-manual-port/` | TypeScript port made by Claude Opus 4.6 and then polished by hand. Reworked UI, and some balance changes. Deployed to GitHub Pages. |
| `full-direct-port/` | TypeScript port written directly from the Java source, as close to the original as possible, including its balance and quirks. |

Each TypeScript port is a self-contained Vite + TypeScript + Canvas project with its own
`package.json`, `public/` assets and `CLAUDE.md`. Read the `CLAUDE.md` in the folder you are working in.
Keep changes inside one port unless asked otherwise. The ports do not share code.

## Running

```bash
cd opus-4-6-manual-port && npm install && npm run dev   # http://localhost:8080
cd full-direct-port && npm install && npm run dev       # http://localhost:8081
```

Both dev servers listen on the network and accept any hostname, so they can be reached
from other machines (for example `http://knurr:8081` over Tailscale).

## Sounds

The `.wav` files are not in git. Copy them into `public/sounds/` in each port. Without them
the games run silently.
