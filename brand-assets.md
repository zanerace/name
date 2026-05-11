# Race Kipping � Brand Asset Handoff

## Fonts

- **Primary display/serif:** `Newsreader`
  - Usage: headlines, section titles, project titles, body italics
  - Weights/styles used: `400`, `500`, `600`, `italic 400`
- **UI/mono:** `JetBrains Mono`
  - Usage: nav labels, metadata, chips, uppercase microcopy
  - Weights used: `400`, `500`

Google Fonts import:

`https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;500&display=swap`

## Color System

### Core palette

- `--background`: `#0f1113`
- `--bg-soft`: `#121416`
- `--foreground`: `#f1eadf`
- `--text-soft`: `#c8bdb0`
- `--muted`: `#131518`
- `--muted-foreground`: `#9d9287`
- `--accent`: `#652a31`
- `--oxblood`: `#652a31`
- `--secondary`: `#17181b`
- `--surface-warm`: `#1b1715`

### Borders/ink overlays

- `--border`: `rgba(241, 234, 223, 0.1)`
- `--border-strong`: `rgba(241, 234, 223, 0.18)`
- `--rule`: `rgba(241, 234, 223, 0.16)`
- `--ink-soft`: `rgba(241, 234, 223, 0.05)`
- `--ink-mid`: `rgba(241, 234, 223, 0.1)`
- `--ink-hard`: `rgba(241, 234, 223, 0.4)`

## Motion + spacing tokens

- `--ease-premium`: `cubic-bezier(0.22, 1, 0.36, 1)`
- `--section-space-y-mobile`: `80px`
- `--section-space-y-desktop`: `116px`

## Cursor token

- `--cursor-active`: inline SVG dot cursor (`#5c1a1f`) with hotspot `11 11`

## Visual media paths

### Work stills

- `/work/01.jpg` � Gradual Sans cover
- `/work/02.png` � Climate Change Exhibition cover
- `/work/03.png` � LunaCast cover
- `/work/04.jpg` � Rwanda cover
- `/about-portrait.png` � About portrait

### Motion/Reel media

- `/reel/poster.png`
- `/reel/reel.webm`
- `/reel/motion-reel.webm`
- `/reel/reel.mp4`
- `/reel/motion-reel.mp4`
- `/reel/poster.mp4`
- `/reel/reel-h264.mp4`
- `/reel/motion-reel-h264.mp4`
- `/reel/motion-reel.mov`
- `/work/gradual-sans.mp4`
- `/work/gradual-sans.mp4.mp4`

## Project metadata map

1. `01` � Gradual Sans (`Type Design`, `2025`)
2. `02` � Climate Change Exhibition (`Identity / Campaign`, `2025`)
3. `03` � LunaCast (`UX / Motion`, `2024`)
4. `04` � Rwanda (`Identity`, `2024`)

## Notes for external use

- Keep the dark editorial contrast model: warm-cream text on charcoal background with restrained copper accents.
- Use Newsreader for expressive headline moments and JetBrains Mono for utility/meta labels.
- Preserve subtle motion timing (no bouncy easing, no aggressive transforms).
