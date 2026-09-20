# Kafko — Android UI prototype

Interactive design prototype of the **Kafko** mobile app (learn languages with music).
This folder currently covers the **home screen** only.

```
android-ui/
├── index.html          markup + screen shell (status bar, dock, toast)
├── styles.css          design tokens + all component styles + animations
├── app.js              mock data, rendering, interaction layer
└── assets/
    ├── artists/        artist portraits (story row)
    ├── covers/         album artwork (song cards)
    ├── flags/          country flags as SVG, 1:1, for the round chips
    └── fonts/          Plus Jakarta Sans (variable, latin + latin-ext), self-hosted
```

## Run

No build step — it is plain HTML/CSS/JS.

```bash
python3 -m http.server 8080 --bind 0.0.0.0 --directory android-ui
# then open http://localhost:8080
```

Opening `index.html` directly from disk also works, because every asset is local.

## Screen anatomy

| Area | Notes |
| --- | --- |
| App bar | brand mark + name, sticky, frosted when content scrolls under it |
| Artists | story-style ring row, flag badge on each avatar, **See all** expands the row in place |
| Filters | sticky circular language chips: All + 9 languages |
| Songs | cover (flag on the corner), title, artist, Free/Premium badge, play/equaliser state |
| Dock | floating pure-green bar, Home / Leitner / Profile with a sliding white pill |
| Toast | feedback for the wires the real app will replace (playback, artist tap) |

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#F3FAF5` | screen background (white with a green cast) |
| `--green` | `#00A94F` | dock, accents, active states |
| `--ink` / `--ink-2` / `--ink-3` | `#0B1F14` / `#5E7D6C` / `#93AF9F` | text hierarchy |
| `--r-lg` | `20px` | card radius |
| font | Plus Jakarta Sans | 200–800 variable |

Film-level details that matter: 1px hairline borders on cards, `52px` covers, `36px` play
buttons (thumb-friendly for kids and adults), `cubic-bezier(.34,1.42,.48,1)` spring easing,
and `prefers-reduced-motion` support.

## Behaviour in the prototype

* Tapping a language chip filters the list in place (`--i` drives the stagger animation).
* Tapping a song card toggles the play state (equaliser replaces the badge).
* Tapping an artist highlights the ring and clears its "new" gradient.
* Tapping a dock item slides the pill; Leitner/Profile only tell you they are coming.

## Phone sizing

The prototype is laid out at real phone proportions (393 × 852). On a desktop browser it is
shown inside a device frame; below `640px` wide it becomes a full-screen app.
