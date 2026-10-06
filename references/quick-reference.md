# Quick reference

The numbers a build or audit reaches for most, on one page. Every value equals
`assets/m3-expressive-tokens.css` (token database DSDB 38.2.9, third-party baseline, web context).
`--md-*` names are Material tokens; `--m3e-*` names are this skill's web helpers, never Material tokens.
Units: 1dp = 1px; type sizes are rem in the file and shown here in px. This page lists values only: open
the linked topic reference for the reasoning, the trade-offs and code.

## Contents

1. [Layout and spacing](#layout-and-spacing)
2. [Shape](#shape)
3. [Typography](#typography)
4. [Motion](#motion)
5. [Interaction states](#interaction-states)
6. [Elevation](#elevation)
7. [Color](#color)
8. [Helper list](#helper-list)

## Layout and spacing

Details: [layout.md](layout.md).

| Width class | Range | Window margin | Panes | Lower-bound helper |
|---|---|---|---|---|
| Compact | < 600px | 16px | 1 | none (starts at 0) |
| Medium | 600–839px | 24px | 1 (2 only for low-density content) | `--m3e-breakpoint-medium` = 600px |
| Expanded | 840–1199px | 24px | 2 (fixed pane 360px) | `--m3e-breakpoint-expanded` = 840px |
| Large | 1200–1599px | 24px | 2 (fixed pane 412px) | `--m3e-breakpoint-large` = 1200px |
| Extra-large | ≥ 1600px | 24px | 2 (a third only as a side sheet, at most 400px) | `--m3e-breakpoint-extra-large` = 1600px |

- **Height classes** (from Android; Material publishes no numbers): compact < 480px, medium 480–899px
  (`--m3e-breakpoint-height-medium` = 480px), expanded ≥ 900px (`--m3e-breakpoint-height-expanded` = 900px).
- **Margins and panes:** `--m3e-window-margin` is 16px and switches to 24px at 600px; the per-class values
  are `--m3e-window-margin-compact` (16px) and `-medium`, `-expanded`, `-large`, `-extra-large` (24px each).
  Panes sit `--m3e-pane-spacer` (24px) apart. Fixed panes: `--m3e-fixed-pane-width-expanded` (360px) and
  `--m3e-fixed-pane-width-large` (412px, from 1200px). A side sheet is at most `--m3e-side-sheet-max-width`
  (400px).
- **Media queries:** write the number, as in `@media (width >= 840px)`. A media or container condition
  can't read `var()`, so the breakpoint helpers are for `calc()` and JS.
- **Line length:** aim for 40–60 characters per line. Cap body text with `max-inline-size: 50ch`: in
  Roboto body-large with its tracking, a 50ch column held 53–59 characters (see
  [typography.md, Readability](typography.md#readability)).

**Spacing** (`--md-sys-measurement-space*`, base `space100` = 8px; Material lists them for Compose only, and the
file exposes them for the web):

| Token suffix | space0 | space25 | space50 | space75 | space100 | space125 | space150 | space175 | space200 |
|---|---|---|---|---|---|---|---|---|---|
| px | 0 | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 |

| Token suffix | space250 | space300 | space400 | space450 | space500 | space600 | space700 | space800 | space900 |
|---|---|---|---|---|---|---|---|---|---|
| px | 20 | 24 | 32 | 36 | 40 | 48 | 56 | 64 | 72 |

Spacing tokens name gaps and padding. Sizes use their own helpers: `--m3e-min-target-size` for targets and
`--m3e-state-layer-size` for circular state layers (see [Interaction states](#interaction-states)).

## Shape

Details: [shape.md](shape.md).

| Step | `--md-sys-shape-corner-*` | Value |
|---|---|---|
| none | `-none` | 0px |
| extra-small | `-extra-small` | 4px |
| small | `-small` | 8px |
| medium | `-medium` | 12px |
| large | `-large` | 16px |
| large-increased | `-large-increased` | 20px |
| extra-large | `-extra-large` | 28px |
| extra-large-increased | `-extra-large-increased` | 32px |
| extra-extra-large | `-extra-extra-large` | 48px |
| full | `-full` | 9999px |

- **Single-corner values:** `--md-sys-shape-corner-value-<step>` holds the same lengths (none through
  extra-extra-large) for the logical longhands such as `border-start-start-radius`.
- **Asymmetric presets** (border-radius shorthands, top-left top-right bottom-right bottom-left):
  `-extra-small-top` 4px 4px 0px 0px, `-large-top` 16px 16px 0px 0px, `-large-start` 16px 0px 0px 16px,
  `-large-end` 0px 16px 16px 0px, `-extra-large-top` 28px 28px 0px 0px. Start and end flip under
  `dir="rtl"`.
- **Full:** use `9999px` only when all four corners are full and nothing animates to or from it. Beside
  smaller radii, or in a morph, use half the element's height (`calc(var(--height) / 2)`).
- **Nested corners:** inner radius = outer radius − the padding between them, never below 0.
- **Grouped lists and segmented groups** (a skill default, since Material publishes no values): outer
  corners from the nesting rule, inner corners extra-small (4px), items `space25` (2px) apart.
- **Library shapes:** 35 shapes as `--m3e-shape-<id>` `clip-path` values in `assets/material-shapes.css`
  (CSS `shape()`: Chrome 135+, Firefox 148+, Safari 18.4+), with SVG and JSON versions for older engines
  and tooling.

## Typography

Details: [typography.md](typography.md).

| Role | Size | Line height | Tracking | Weight: baseline → emphasized |
|---|---|---|---|---|
| display-large | 57px | 64px | -0.25px | 400 → 500 |
| display-medium | 45px | 52px | 0px | 400 → 500 |
| display-small | 36px | 44px | 0px | 400 → 500 |
| headline-large | 32px | 40px | 0px | 400 → 500 |
| headline-medium | 28px | 36px | 0px | 400 → 500 |
| headline-small | 24px | 32px | 0px | 400 → 500 |
| title-large | 22px | 28px | 0px | 400 → 500 |
| title-medium | 16px | 24px | 0.15px | 500 → 700 |
| title-small | 14px | 20px | 0.1px | 500 → 700 |
| body-large | 16px | 24px | 0.5px | 400 → 500 |
| body-medium | 14px | 20px | 0.25px | 400 → 500 |
| body-small | 12px | 16px | 0.4px | 400 → 500 |
| label-large | 14px | 20px | 0.1px | 500 → 700 |
| label-medium | 12px | 16px | 0.5px | 500 → 700 |
| label-small | 11px | 16px | 0.5px | 500 → 700 |

- **Properties:** each role has five longhands, `--md-sys-typescale-<role>-{font,weight,size,line-height,tracking}`,
  and the emphasized twin `--md-sys-typescale-emphasized-<role>-*` changes only the weight. Set all five
  (`letter-spacing` takes the tracking); don't use the `font` shorthand.
- **Typefaces:** `--md-ref-typeface-brand` and `--md-ref-typeface-plain` are both
  `Roboto, "Noto Sans", sans-serif`. The static scale needs real 400, 500 and 700 faces
  (`--md-ref-typeface-weight-regular`, `-medium`, `-bold`); `-semibold` (600) belongs to the variable
  emphasized set. `data-typeface="variable"` switches to Roboto Flex with tracking 0.
- **Line heights above** are the Small language-height category (Latin except Vietnamese, Greek,
  Cyrillic, Hebrew). Medium,
  Large and Extra large rewrite them; the table is in
  [typography.md, Language height](typography.md#language-height).
- **Button labels:** label-large (baseline or emphasized) on small buttons; larger Expressive buttons may
  use a title or headline role.

## Motion

Details: [motion.md](motion.md).

| Spring | Damping / stiffness: expressive · standard | Helper, expressive | Helper, standard | `-linear` trace: expressive · standard |
|---|---|---|---|---|
| fast spatial | 0.6 / 800 · 0.9 / 1400 | `350ms cubic-bezier(0.42, 1.67, 0.21, 0.9)` | `350ms cubic-bezier(0.27, 1.06, 0.18, 1)` | 360ms · 230ms |
| default spatial | 0.8 / 380 · 0.9 / 700 | `500ms cubic-bezier(0.38, 1.21, 0.22, 1)` | `500ms cubic-bezier(0.27, 1.06, 0.18, 1)` | 440ms · 320ms |
| slow spatial | 0.8 / 200 · 0.9 / 300 | `650ms cubic-bezier(0.39, 1.29, 0.35, 0.98)` | `750ms cubic-bezier(0.27, 1.06, 0.18, 1)` | 600ms · 490ms |
| fast effects | 1 / 3800 in both | `150ms cubic-bezier(0.31, 0.94, 0.34, 1)` | same | 150ms in both |
| default effects | 1 / 1600 in both | `200ms cubic-bezier(0.34, 0.8, 0.34, 1)` | same | 240ms in both |
| slow effects | 1 / 800 in both | `300ms cubic-bezier(0.34, 0.88, 0.34, 1)` | same | 330ms in both |

- **Names:** damping and stiffness are tokens (`--md-sys-motion-spring-<speed>-<type>-damping`,
  `-stiffness`). The helpers are `--m3e-motion-spring-<speed>-<type>` (shorthand "duration easing"), its
  `-duration` and `-easing` parts, and the `-linear`, `-linear-duration`, `-linear-easing` traces of the
  real spring (`linear()`: Chrome 113+, Firefox 112+, Safari 17.2+; put them behind `@supports`).
  `data-motion-scheme="standard"` swaps the spatial values (effects are identical in both schemes);
  expressive is the file's default.
- **Spatial vs effects:** spatial helpers drive position, size, scale, rotation, `border-radius` and
  `clip-path`, and may overshoot. Effects helpers drive `opacity`, colors, `filter` and `box-shadow`, and
  never overshoot.
- **Speed follows size and travel:** fast for small components and short moves, default for medium and
  partial-screen surfaces (the usual choice), slow for full-screen changes and long travel. A hero
  moment earns emphasis through larger travel, a shape morph or the expressive scheme, not by switching
  to slow.
- **Defaults this skill uses:** press and toggle or selection morphs on small and medium controls take
  `--m3e-motion-spring-fast-spatial`; button color and state-layer changes take
  `--m3e-motion-spring-fast-effects`. Giving the spatial and effects halves of one change the same speed
  is a sensible default, not a pass/fail rule.
- **Reduced motion:** the file turns every spatial helper into `1ms linear` (so `transitionend` still
  fires) and leaves effects alone. JS springs, transitions on the legacy tokens, `@keyframes` and View
  Transitions need their own `prefers-reduced-motion` check.

**Legacy easing and duration** (still used for screen-to-screen navigation; component enter and exit,
such as menus and sheets, may use springs):

| Movement | Easing token | Duration token |
|---|---|---|
| Stays on screen | `--md-sys-motion-easing-emphasized` | `--md-sys-motion-duration-long2` (500ms) |
| Enters | `--md-sys-motion-easing-emphasized-decelerate` | `--md-sys-motion-duration-medium4` (400ms) |
| Leaves for good | `--md-sys-motion-easing-emphasized-accelerate` | `--md-sys-motion-duration-short4` (200ms) |
| Utility, stays on screen | `--md-sys-motion-easing-standard` | `--md-sys-motion-duration-medium2` (300ms) |
| Utility, enters | `--md-sys-motion-easing-standard-decelerate` | `--md-sys-motion-duration-medium1` (250ms) |
| Utility, leaves | `--md-sys-motion-easing-standard-accelerate` | `--md-sys-motion-duration-short4` (200ms) |

- **Easing values:** emphasized `cubic-bezier(0.2, 0, 0, 1)` (on the web the same curve as standard; the
  true two-segment curve is `--m3e-motion-easing-emphasized-linear`), emphasized-decelerate
  `cubic-bezier(0.05, 0.7, 0.1, 1)`, emphasized-accelerate `cubic-bezier(0.3, 0, 0.8, 0.15)`, standard
  `cubic-bezier(0.2, 0, 0, 1)`, standard-decelerate `cubic-bezier(0, 0, 0, 1)`, standard-accelerate
  `cubic-bezier(0.3, 0, 1, 1)`, legacy `cubic-bezier(0.4, 0, 0.2, 1)`, legacy-decelerate
  `cubic-bezier(0, 0, 0.2, 1)`, legacy-accelerate `cubic-bezier(0.4, 0, 1, 1)`, linear
  `cubic-bezier(0, 0, 1, 1)`.
- **Durations** (`--md-sys-motion-duration-*`): short1–4 = 50, 100, 150, 200ms; medium1–4 = 250, 300,
  350, 400ms; long1–4 = 450, 500, 550, 600ms; extra-long1–4 = 700, 800, 900, 1000ms.

## Interaction states

Details: [interaction-states.md](interaction-states.md).

| State | Layer opacity token | Value |
|---|---|---|
| Hover | `--md-sys-state-hover-state-layer-opacity` | 0.08 |
| Focus | `--md-sys-state-focus-state-layer-opacity` | 0.1 |
| Pressed | `--md-sys-state-pressed-state-layer-opacity` | 0.1 |
| Dragged | `--md-sys-state-dragged-state-layer-opacity` | 0.16 |

- **The layer** is the content ("on") color at that opacity, painted between the container and its
  content, one state at a time. Small controls show a circular layer of `--m3e-state-layer-size` (40px)
  centered in the 48px target. Hover rules belong inside `@media (hover: hover)` and skip disabled
  elements.
- **Disabled:** content in `on-surface` at `--md-sys-state-disabled-state-layer-opacity` (0.38; despite the
  name it is the content opacity), a filled container in `on-surface` at
  `--m3e-state-disabled-container-opacity` (0.1; in `color-mix()` write
  `calc(var(--m3e-state-disabled-container-opacity) * 100%)`), no state layer, elevation level 0.
- **Focus ring:** `outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color)`,
  which is 3px in the `secondary` role, on `:focus-visible` only. `outline-offset` is
  `--md-sys-state-focus-indicator-outer-offset` (2px, the default) or `-inner-offset` (-3px, only where
  the outside is clipped, and never on a primary or secondary fill).
- **Targets:** at least 48×48px (`--m3e-min-target-size`; 44×44px is acceptable for pointer-only
  targets), with 8px between separate targets. Targets that sit edge to edge and tile a container without
  overlapping (list rows, segments, connected button groups) need no gap, as WCAG 2.5.8's spacing
  exception allows; each one still reaches 48px.

## Elevation

Details: [elevation.md](elevation.md).

| Level | `--md-sys-elevation-*` (distance) | Key shadow, 30% of `shadow` | Ambient shadow, 15% of `shadow` |
|---|---|---|---|
| 0 | `level0` = 0px | none | none |
| 1 | `level1` = 1px | 0 1px 2px 0 | 0 1px 3px 1px |
| 2 | `level2` = 3px | 0 1px 2px 0 | 0 2px 6px 2px |
| 3 | `level3` = 6px | 0 1px 3px 0 | 0 4px 8px 3px |
| 4 | `level4` = 8px | 0 2px 3px 0 | 0 6px 10px 4px |
| 5 | `level5` = 12px | 0 4px 4px 0 | 0 8px 12px 6px |

- **Paint with the helpers:** `box-shadow: var(--m3e-elevation-shadow-levelN)`, or
  `filter: var(--m3e-elevation-drop-shadow-levelN)` on a parent when `clip-path` or a mask would cut the
  box shadow off (`drop-shadow()` has no spread, so the ambient layer comes out slightly tighter). The
  level tokens are distances, not paint.
- **Levels in use:** things rest at levels 0–3; 4 and 5 are reached only through interaction. Hover adds
  one level; focus and press add none; disabled drops to 0. Dragged elements rise 3 levels, capped at 5;
  chips and list items go to level 4 per their component tokens (filled card 0 → 3, elevated card 1 → 4).
- **Tone first:** separate regions with surface-container roles; shadows are for protection over busy
  content and for lift during interaction. Surface tint is deprecated.
- **Scrim:** `--m3e-scrim` is the `scrim` role (#000000) at 32% (`--m3e-scrim-opacity` = 0.32).

## Color

Details: [color.md](color.md). Baseline scheme at standard contrast (source color `#6750A4`).

| Role | Light | Dark |
|---|---|---|
| `primary` / `on-primary` | #6750A4 / #FFFFFF | #D0BCFF / #381E72 |
| `primary-container` / `on-primary-container` | #EADDFF / #4F378B | #4F378B / #EADDFF |
| `secondary` / `on-secondary` | #625B71 / #FFFFFF | #CCC2DC / #332D41 |
| `secondary-container` / `on-secondary-container` | #E8DEF8 / #4A4458 | #4A4458 / #E8DEF8 |
| `tertiary` / `on-tertiary` | #7D5260 / #FFFFFF | #EFB8C8 / #492532 |
| `tertiary-container` / `on-tertiary-container` | #FFD8E4 / #633B48 | #633B48 / #FFD8E4 |
| `error` / `on-error` | #B3261E / #FFFFFF | #F2B8B5 / #601410 |
| `error-container` / `on-error-container` | #F9DEDC / #8C1D18 | #8C1D18 / #F9DEDC |
| `surface` | #FEF7FF | #141218 |
| `surface-dim` | #DED8E1 | #141218 |
| `surface-bright` | #FEF7FF | #3B383E |
| `surface-container-lowest` | #FFFFFF | #0F0D13 |
| `surface-container-low` | #F7F2FA | #1D1B20 |
| `surface-container` | #F3EDF7 | #211F26 |
| `surface-container-high` | #ECE6F0 | #2B2930 |
| `surface-container-highest` | #E6E0E9 | #36343B |
| `on-surface` / `on-surface-variant` | #1D1B20 / #49454F | #E6E0E9 / #CAC4D0 |
| `inverse-surface` / `inverse-on-surface` / `inverse-primary` | #322F35 / #F5EFF7 / #D0BCFF | #E6E0E9 / #322F35 / #6750A4 |
| `outline` / `outline-variant` | #79747E / #CAC4D0 | #938F99 / #49454F |
| `scrim`, `shadow` | #000000 | #000000 |

- **Pairs:** text and icons on `X` use `on-X`, on `X-container` use `on-X-container`, and on any surface
  use `on-surface` (main) or `on-surface-variant` (secondary).
- **Equal pairs to watch:** `surface-bright` equals `surface` in light, and `surface-dim` equals
  `surface` in dark, so neither makes a visible step on its own there.
- **Fixed roles** keep one value in both themes at standard contrast: `primary-fixed` #EADDFF,
  `primary-fixed-dim` #D0BCFF, `on-primary-fixed` #21005D, `on-primary-fixed-variant` #4F378B; the
  secondary and tertiary sets follow the same pattern (see color.md).
- **Contrast levels:** medium and high rewrite 35 roles (accents, containers, `on-*`, fixed, inverse and
  outline roles); surfaces, `background`, `scrim` and `shadow` stay the same at every level in this
  baseline. Those values are in the token file and color.md.
- **Legacy roles:** `background`, `on-background` and `surface-variant` stay for old code (use `surface`,
  `on-surface` and `surface-container-highest`); `surface-tint` is deprecated.
- **Focus color:** `--m3e-focus-indicator-color` resolves to `secondary` in every theme and contrast level.

## Helper list

These are this skill's web helpers: values Material documents (or that the web needs) with no Material
token behind them. Call them helpers, and keep product properties out of the `--m3e-` prefix.

| Helper | Value | Use |
|---|---|---|
| `--m3e-breakpoint-medium`, `-expanded`, `-large`, `-extra-large` | 600px, 840px, 1200px, 1600px | Width-class bounds for `calc()` and JS |
| `--m3e-breakpoint-height-medium`, `-height-expanded` | 480px, 900px | Height-class bounds |
| `--m3e-window-margin` | 16px; 24px from 600px | Side margins in layout code |
| `--m3e-window-margin-compact`, `-medium`, `-expanded`, `-large`, `-extra-large` | 16px, then 24px each | Margin for one named class |
| `--m3e-pane-spacer` | 24px | Gap between panes |
| `--m3e-fixed-pane-width-expanded`, `-large` | 360px, 412px | Fixed pane in a fixed + flexible layout |
| `--m3e-side-sheet-max-width` | 400px | Side sheet, including the optional third pane at extra-large |
| `--m3e-elevation-shadow-level0` … `level5` | `none`, then two layers (table above) | `box-shadow` for levels 0–5 |
| `--m3e-elevation-drop-shadow-level0` … `level5` | `none`, then two `drop-shadow()` layers | `filter` shadows for clipped or non-rectangular shapes |
| `--m3e-scrim` | `scrim` at 32% | Modal scrim fill |
| `--m3e-scrim-opacity` | 0.32 | Fading a scrim with `opacity` |
| `--m3e-focus-indicator-color` | `var(--md-sys-color-secondary)` | Focus ring color (redeclare it on a re-themed subtree) |
| `--m3e-state-disabled-container-opacity` | 0.1 | Disabled filled container (`on-surface` at 10%) |
| `--m3e-state-layer-size` | 40px | Circular state layer on small controls |
| `--m3e-min-target-size` | 48px | Minimum target width and height |
| `--m3e-motion-spring-<speed>-<type>` plus `-duration`, `-easing` | See the spring table | CSS transitions and WAAPI |
| `--m3e-motion-spring-<speed>-<type>-linear` plus `-linear-duration`, `-linear-easing` | `linear()` traces | Closer spring feel behind `@supports` |
| `--m3e-motion-easing-emphasized-linear` | `linear()` trace | The true emphasized curve |
| `--m3e-shape-<id>` (in `assets/material-shapes.css`) | CSS `shape()` | `clip-path` for the 35 library shapes |

The shadow, drop-shadow, scrim and focus-color helpers are built with `var()`, so they resolve where the
token file declares them (`:root` and its theme and contrast blocks). To change one for a subtree,
redeclare the helper on that subtree; overriding only the token it reads has no effect there.
