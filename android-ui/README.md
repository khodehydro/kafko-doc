# Kafko — mobile UI

Interactive design prototype of **Kafko** — learn languages with music.
This folder covers the **home screen** at production fidelity (markup, styles, motion, state).

```
android-ui/
├── index.html      screen shell: status bar · app bar · pinned filters · dock · toast
├── styles.css      design tokens + components + motion (commented by section)
├── app.js          content model, rendering, interaction state
└── assets/
    ├── artists/    artist portraits (story row)
    ├── covers/     album artwork
    ├── flags/      country flags, 1:1 SVG for the round chips
    └── fonts/      Plus Jakarta Sans (variable, latin + latin-ext), self-hosted
```

## Run

No build step.

```bash
python3 -m http.server 8080 --bind 0.0.0.0 --directory android-ui
# open http://localhost:8080
```

Every asset is local, so opening `index.html` from disk works too.

## Screen anatomy

**Sky** — tinted green background with two slow-drifting light blobs (fixed behind the
scroller, so nothing slides with the content).

**App bar** (pinned) — brand mark, search, learning streak. Compacts on scroll: the mark and
title shrink, the tagline collapses, so the header costs ~30px less once you start reading.
The sticky filter strip is positioned from the app bar's real measured height
(`ResizeObserver` → `--sticky-top`), so the pin is exact at any state.

**Artists** — story-style rings: animated gradient for unseen artists, flag badge for the
language they sing in, **See all** expands the row in place (FLIP-measured height).

**Browse by language** (pinned) — circular flag chips; compacting to flags-only on scroll.

**Continue learning** (hero) — picks the most advanced unfinished song of the current filter,
shows coverage (`24 / 38 phrases`), level, language and a progress bar. Dissolves away when the
active language has no in-progress song.

**Song sheet** — white rounded sheet over the tinted sky. Each card carries cover art with the
language flag on the corner, title, artist, and a metadata row: CEFR level (`A1…B2`),
phrase count, and Free / Premium. Cards already started show a learning-progress bar.
Playing a card swaps the badge for a live equaliser.

**Dock** (floating, pure green) — Home / Leitner / Profile with a sliding white pill and a
**5** due-cards badge. Centred, clear of every edge.

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#EDF7F0` | sky (green-tinted, not flat white) |
| `--surface` | `#FFFFFF` | sheet and cards |
| `--green` | `#00A94F` | brand, dock, active states |
| `--ink` / `--ink-2` / `--ink-3` | `#08190F` / `#55705F` / `#8CA79A` | text hierarchy |
| `--amber` | `#B4740A` | Premium + streak |
| `--r-card` / `--r-sheet` | `20px` / `30px` | corners |
| `--sh-hero` / `--sh-dock` | green-tinted shadows | depth without grey haze |

Motion: springs at `cubic-bezier(.34,1.42,.48,1)` for anything touchable, `rise` for list
entrances with a 34ms stagger, bar-grow for progress, drifting ambience at 24–29s, and full
`prefers-reduced-motion` support.

## Interactions in the prototype

| Action | Result |
| --- | --- |
| Scroll | app bar + filters compact and stay pinned, frost saturates |
| Language chip | list and hero re-render for that language, toast-free |
| Song card | play/pause state, equaliser, hero stays in sync |
| Hero play | same state as the matching card |
| Artist | ring highlights, "new" gradient cleared |
| Dock item | pill slides; Leitner reports due cards, Profile says coming soon |
| Search | wired to a toast placeholder |

## Phone sizing

Laid out at real phone proportions (393 × 852). On desktop it renders inside a device frame;
below 640px wide it becomes a full-screen app. Below 372px the phrase count drops out first.

## Next screens

`Leitner` (flashcard review) and `Profile` are nav stubs — ready to be designed.
