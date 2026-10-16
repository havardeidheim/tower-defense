# Road Defender: Revenge of the Road (full direct port)

A from-scratch TypeScript port of the original Java game in `../original-java-game/`.
The goal is to behave exactly like the Java version: same menus, layout, graphics,
numbers, timings, balance and quirks. The only additions are browser wrapping: a
loading screen, a cookie save, scaling the canvas to the window, and audio unlocking.

This is the reference copy of the original game. Keep it faithful: do not rebalance
it or copy changes from `../opus-4-6-manual-port/` into it. When behaviour is in doubt,
the Java source decides.

## Technologies

- TypeScript (strict), Vite, HTML5 Canvas. No game frameworks.

## Structure

```
src/
├── index.html, main.ts   # Browser wrapper: canvas scaling, loading screen, input, frame loop
├── engine/
│   ├── Scheduler.ts      # Virtual clock + SwingTimer (emulates javax.swing.Timer)
│   ├── Graphics.ts       # java.awt.Graphics-like canvas wrapper, Rect, Java int/double helpers
│   ├── AudioClip.ts      # Web Audio version of java.applet.AudioClip (play restarts the clip)
│   └── Assets.ts         # Preloads images, sounds and level text; BufferedReader-style parsing
├── game/                 # Board, MainFrame, Menu (TDMenu), Help (TDHelp), Level, Account, Co, Pic, Audio, AreaShot, SaveManager
├── enemies/              # Enemy base + Peasant, Scout, Assassin, Solider, Vanguard, Paragon
├── towers/               # Tower base + Stone, Frost, Fire (spread), Poison
├── projectiles/          # Heat-seeking projectiles
├── spells/               # Lightning, PlaceRunestone
└── buttons/              # AddKnapp, InfoKnapp, Upgrade/Sell, SimpleKnapp

public/                   # images/ and levels/ copied from the Java resources; sounds/ is gitignored
```

Class and field names follow the Java source (including Norwegian names such as
`fiender`, `taarn`, `konto`, `knapper`) so the two can be compared side by side.

## How timing works

The Java game ran logic on a 20 ms `java.util.Timer` and used real-time Swing timers
for spawning (1 s), poison and mana (0.7 s), tower reloads, and slow duration (1.6 s).
`Scheduler` reproduces this with one virtual clock that advances with real time
(capped per frame, and it stops while the tab is hidden). "Faster" keeps the original's
behaviour: two logic steps per tick, halved spawn and poison timers, and halved reloads
only for towers that already exist when it is toggled.

## Save

A cookie named `roadDefenderClassicSave` holds the same content as the original `data.txt`:
one `t`/`f` per level for unlocked levels, then one digit per level for stars (the health left, 0-5).

## Development

```bash
npm install
npm run dev        # http://localhost:8081, also reachable on the LAN/Tailscale
npm run typecheck
npm run build
```

The sound files are not in git. Copy the original `.wav` files into `public/sounds/`.
Without them the game runs silently.
