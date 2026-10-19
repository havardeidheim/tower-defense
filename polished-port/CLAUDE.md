# Road Defender: Revenge of the Road (polished port)

A TypeScript port of the original Java game in `../original-java-game/` with a clean,
plain-TypeScript architecture. Gameplay matches the original (the tests compare it with
`../full-direct-port/` tick by tick), but nothing of Java's machinery is ported: no Swing
timers, no deferred remove lists. Menus and the in-game layout are still the original's;
reworking the UI and adjusting gameplay (for example mana per wave instead of over time)
come next.

## Technologies

- TypeScript (strict), Vite, HTML5 Canvas. No game frameworks.
- Vitest for the tests, which run headless in Node.

## Structure

```
src/
├── main.ts, index.html  # Boot: canvas, loading scene
├── game/
│   ├── Game.ts          # Canvas scaling, input mapping, current scene
│   ├── GameLoop.ts      # Fixed 20 ms ticks, render per animation frame
│   ├── constants.ts     # Sizes, tick timings, economy and combat numbers
│   └── theme.ts         # The original's colors and font
├── core/                # Rectangle, Interval (tick timer), Random (seedable)
├── scenes/              # Scene base, LoadingScene, MenuScene, GameScene
├── world/
│   ├── World.ts         # One game on one level: entities, resources, tick order, player commands
│   └── Economy.ts       # Gold (with rising tower prices), Mana
├── level/
│   ├── Level.ts         # Tile grid, spawn points, foundations
│   └── WaveSpawner.ts   # Reads the wave scripts
├── entities/
│   ├── enemies/         # Enemy (one class), EnemyTypes (stats and traits as data)
│   ├── towers/          # Tower base, one class per tower, TowerTypes (stats per level)
│   └── attacks/         # Projectile base, stone/poison/fireball projectiles, FrostRing effect
├── spells/              # Lightning, Runestone (place foundation)
├── ui/                  # SidePanel, BuildButton, EnemyInfoButton, TextButton, HelpOverlay
├── resources/           # ResourceLoader (images, sounds, levels), SoundManager, LevelLoader
└── save/                # SaveManager (progress in localStorage)
tests/                   # Parity with the direct port, bug regressions, mechanics, game scene
public/                  # images/ and levels/ from the Java resources; sounds/ is gitignored
```

`World` knows nothing about input, pausing or fast mode. `GameScene` owns a `World`,
decides when it ticks, turns clicks into world commands and draws everything.

## How time works

Everything runs in fixed ticks of 20 ms (50 per second), the rate of the original's logic
timer, so speeds are in pixels per tick exactly as in the Java code. Every duration is a
whole number of ticks (`constants.ts`): spawn pulse 50, poison pulse 35, mana every 70
(first after 35), slow 80, tower reloads from `TowerTypes.ts`.

- A timer started in tick N with length L fires at the start of tick N + L, before anything
  moves. This matches when the original's timers fired relative to its logic loop.
- Tick order: spawn, mana and poison pulses, then enemies walk, towers act, projectiles
  fly, effects animate, then the sweep.
- Pause: the world is not ticked. Fast mode: two ticks per 20 ms. Nothing else changes.

## Entity lifecycle

An enemy is `alive`, `killed` or `escaped`. Only alive enemies can be targeted or hurt.
Killed enemies, finished projectiles and effects are removed by `World.sweep()`, which
also pays each killed enemy's bounty once. It runs at the end of every tick and after
every player command, so the lists are clean between ticks, also while paused. Player
commands (build, upgrade, sell, spells) take effect at once.

## Differences from the original, on purpose

Bugs fixed:
- Double gold. In the original, killed enemies stayed in the list until the end of the tick
  (or until unpaused) and could die again: two frost towers hitting the same enemy, a
  fireball retargeting a dead enemy, lightning twice on a dead enemy while paused, and
  projectiles "killing" enemies that had already escaped.
- Selling while paused: the sold tower stayed on the map and could be sold again. Reset
  also kept the old selection, so a tower from before the reset could be sold.
- Pausing restarted the spawn, poison and mana timers on resume, while reloads and slows
  kept running in real time. Now pause freezes everything.
- Fast mode halved spawn and poison timers but not slows, and towers built after switching
  kept slow reloads. Now it simply runs the game twice as fast.
- A projectile whose target escapes is dropped and its tower reloads at once, as when the
  target dies. A frost tower no longer keeps pulsing at an escaped enemy.
- Help: pressing Help again rewinds the window instead of stacking duplicate buttons, and
  clicks on the window no longer reach the map below it.
- All levels are open from the start (the original unlocked them one by one).
- Display: "Slow: 40%" instead of "Slow: 39.99999999999999%"; the frost ring is not drawn
  out of place on its first frame.

Original behavior kept for now (candidates for the gameplay pass):
- Selling pays half the *current* price of that tower type (prices rise with every tower
  bought) plus 10 per upgrade, and does not lower the price.
- Mana regenerates over time, 1 per 1.4 s up to 100.
- The poison tower's tie-break between equally poisoned enemies is not "furthest first".
- Lightning stuns slow-immune enemies (Vanguard, Paragon).
- Any click elsewhere deselects the selected tower, including clicking Pause.
- After the last wave the counter shows one past the total (for example "19/ 18").

## Tests

`npm test` runs:
- `parity.test.ts`: plays scripted games in this port and in `../full-direct-port/` (run
  headless) and compares gold, mana, health, waves and every enemy, tower and projectile
  after every tick. Each first difference must be one of the deliberate fixes above.
- `bugs.test.ts`, `gameScene.test.ts`: the fixed bugs, pausing, selling, reset, fast mode.
- `mechanics.test.ts`: wave scripts, spawn points, enemy defenses, timers, tower stats.
- `benchmarks.test.ts` (also `npm run benchmark`): difficulty benchmarks. Scripted players
  in `tests/support/benchmarks.ts` must get five stars on every one of 60 seeds (dodges
  are random). Five stars means "the level can be beaten perfectly", and that must still
  hold after any gameplay change. Only The Butchers Ballroom has a benchmark so far.

If a gameplay change is intended, the parity test will start failing; update or narrow it.
The benchmarks should keep passing; if one fails, the level got harder.

## Save

Every level can be played from the start; there is no unlocking. localStorage keeps the
best stars (health left, 0 to 5) per level under `roadDefender.polishedPort.progress`.

## Development

```bash
npm install
npm run dev        # http://localhost:8082, also reachable on the LAN/Tailscale
npm test
npm run typecheck
npm run build
```

The sound files are not in git. Copy the original `.wav` files into `public/sounds/`.
Without them the game runs silently.
