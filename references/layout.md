# Layout

Layout decides where each part of the UI sits in the window and how that arrangement changes when the
window grows, shrinks, folds or switches reading direction. Material 3 builds it from a handful of fixed
numbers (five width breakpoints, 16/24dp window margins, a 24dp spacer between panes, 360/412dp fixed
panes) plus an 8dp spacing scale. The May 2026 "Expressive layout" update reorganised the model around a
scaffold of bars, rails and panes, renamed window size classes to breakpoints and added the
`md.sys.measurement` spacing tokens; the layout numbers themselves did not change.

## Contents

- [Key ideas](#key-ideas)
- [What M3 Expressive changed](#what-m3-expressive-changed)
- [The layout scaffold](#the-layout-scaffold)
- [Breakpoints (window size classes)](#breakpoints-window-size-classes)
- [Panes](#panes)
- [Margins and layout helpers](#margins-and-layout-helpers)
- [Spacing system](#spacing-system)
- [Density](#density)
- [Grids and rulers](#grids-and-rulers)
- [Canonical layout examples and adaptive strategies](#canonical-layout-examples-and-adaptive-strategies)
- [Foldables, hardware and multi-window](#foldables-hardware-and-multi-window)
- [Line length](#line-length)
- [Bidirectionality and RTL](#bidirectionality-and-rtl)
- [Applying it on the web](#applying-it-on-the-web)
- [Screen patterns from product reviews](#screen-patterns-from-product-reviews): filters on the list, a list and
  its main action on a phone, quiet secondary actions
- [Do and don't](#do-and-dont)
- [Auditing](#auditing)
- [Sources](#sources)

## Key ideas

- **Design for the window, not the device.** One phone is compact in portrait and medium or expanded in
  landscape; a desktop browser window can be any class. Classify by the space the app actually gets and
  re-check on every resize, rotation, fold and split-screen change.
- **Width classes drive the scaffold; pane width drives components.** Pane count and navigation type
  switch at 600, 840, 1200 and 1600dp (window margins only at 600dp). Components inside a pane respond
  to the pane, which can be far narrower than the window.
- **All content lives in panes.** Bars frame the window, rails line its edges, panes hold the content, and
  system safety regions surround everything. A layout shows one to three panes, and at least one of them
  must flex.
- **Extra space should reveal, not inflate.** When the window grows, first show a second pane, open the
  navigation rail or add columns. Scaling up the compact layout wastes the space.
- **A few numbers, used everywhere.** Margins are 16dp at compact and 24dp above it; panes sit 24dp apart;
  a fixed pane is 360dp at expanded and 412dp at large and wider. Reuse these instead of inventing
  per-screen values, so the sizes stay consistent with each other.
- **Spacing is a scale with meaning.** 8dp is the base unit; nested steps (2, 4, 6, 10, 12, 14, 20, 36dp)
  fill in the values components and layouts need between the 8dp steps. Spacing groups, separates and
  emphasises, so treat an off-scale value as a decision that needs a reason.
- **Density belongs to the person.** Tighter layouts are opt-in, never a side effect of a breakpoint,
  and never shrink touch targets below 48×48dp.
- **Leading and trailing, not left and right.** Layouts mirror for right-to-left scripts, so write every
  horizontal rule in logical terms.

## What M3 Expressive changed

Layout changed in two waves. The breakpoint ranges, margins, spacer, fixed-pane widths and pane-count
tables are identical before and after both.

### May 2026: "Expressive layout" (announced at Google I/O, 19 May 2026)

- **New scaffold model.** Every adaptive layout is described as bars, rails and panes, with safety
  regions reserved for system UI around them. It replaces the older model of a window split into a
  navigation region and a body region.
- **New spacing system.** Token set `md.sys.measurement`: 18 tokens from `space0` to `space900`,
  `space100` = 8dp (set created April 2026, revised May 2026). Material lists these tokens as available in
  Jetpack Compose only and says component adoption is still in progress. The shipped
  `m3-expressive-tokens.css` exposes them as `--md-sys-measurement-space*`; on the web that is an
  unofficial mapping of official values.
- **4dp framing became 8dp framing.** The old Layout basics page measured padding in 4dp increments. The
  new system is an 8dp scale with nested sub-units down to 2dp (see [4dp or 8dp?](#4dp-or-8dp)).
- **Renames.** Window size classes are now **breakpoints** (the pages still note the old name);
  responsive layout is now **adaptive design**; canonical layouts are now **canonical layout examples**.
- **Grid first, with rulers.** The layout grid is now described as the base of every layout: place
  columns (4 compact, 8 medium/expanded, 12 large/extra-large), then bars and rails, then panes guided by
  a canonical example. Earlier guidance said columns belong inside panes and to start from a canonical
  layout instead of a grid. Rulers (named alignment lines) are new.
- **Pane advice shifted.** The breakpoints overview now suggests considering three panes at extra-large;
  before, it said two panes work best from expanded up. At medium, two panes for dense content went from
  a soft caution to a plain don't. On large screens, floating panes are now called the default, and
  Material now suggests converting docked panes to co-planar ones (before: they could stay docked).
- **Navigation names on the compact and medium pages.** Compact now pairs the navigation bar with a modal
  expanded navigation rail (was a modal navigation drawer). The medium page dropped the drawer: a rail for
  single-pane layouts, a navigation bar for two-pane layouts.
- **Experience types.** Guidance now targets mobile, desktop and spatial (XR) experiences, with new watch
  and XR pages.
- **Dropped from the published pages.** The "Hardware considerations" section (cutouts, folds, device
  postures, multi-window) and most drag-handle detail (keyboard and screen-reader behaviour, back-gesture
  priority). Nothing replaced them, so this reference keeps them, labelled as legacy.
- **Component spacing names.** Padding, margin and gap plus a position word (horizontal, vertical,
  leading, trailing, top, bottom) replace leading-space, trailing-space, top-space, bottom-space and
  between-space.

### May 2025: M3 Expressive launch

- Breakpoint tables renamed navigation components: navigation drawer became **expanded navigation rail**
  (modal or standard) and navigation rail became **collapsed navigation rail**. The overview table's
  medium row changed to a navigation bar plus a modal expanded rail.
- Panes gained permanent vs temporary types, three display modes (co-planar, floating, docked), focus
  rules, and drag-handle activation by tap, double tap or long press. On large screens the scrim behind a
  floating pane became optional.
- Split-pane wording: navigation shrinks only one pane, so the spacer stays visually centred.

### Not new

- **Large (1200–1599dp) and extra-large (≥1600dp)** were already in M3 guidance in February 2024. What is
  recent is Android support: androidx.window 1.5.0 (stable 24 September 2025) added the 1200/1600 bounds,
  and Compose Material3 Adaptive 1.3.0 (stable 12 August 2026) made them the default through
  `currentWindowAdaptiveInfoV2()`.
- Density rules, the 48×48dp target, the 40–60 character line length and the RTL guidance are unchanged
  in substance.

## The layout scaffold

| Part | What it holds | Rules |
|---|---|---|
| Safety region | System UI: status bar, system gesture or navigation area, display cutouts | Never place primary content here. On compact screens it runs along the top and bottom edges. |
| Bars | Top app bar (title plus 1–2 essential actions such as search or back); bottom navigation bar (3–5 top destinations, compact and medium) | Sit right next to the safety regions, never inside them. A bar can span one pane or the whole window. |
| Rails | The perimeter just inside the bars. Compact: top and bottom rail regions for toolbars, chat inputs and FABs (a toolbar sits above the navigation bar). Wider: a leading rail (navigation rail, collapsed or expanded) and a trailing rail for controls that act on pane content, such as a vertical toolbar | Rails can also float over panes. In XR, rail components become orbiters outside the content. |
| Panes | All content, 1–3 per layout | Fixed or flexible width; permanent or temporary. |

- **Order of construction:** 1. place grid columns; 2. fill the regions nearest the edges (bars, rails,
  app bars, toolbars); 3. fill the middle with panes, using a canonical layout example as the guide.
- **Containment.** Panes may blend into the background (implicit grouping, which reads as related
  content) or be set apart with a distinct container colour or outline (explicit grouping). In
  multi-pane layouts, colour adds emphasis and tight spacing groups related items. In XR, give every pane
  a container colour so it reads against whatever real or rendered scene sits behind it.
- **Legacy parts of layout.** Before May 2026 a window had a *navigation region* at the leading edge and a
  *body region* holding the panes. Read older specs with this mapping: navigation region → bars and rails,
  body region → panes.
- **App bars.** The legacy model put app bars inside panes and showed or hid their actions by available
  width; the current model allows a bar per pane or one across the window. When a layout goes from one
  pane to two, keep elements in the pane they belonged to (legacy advice that still holds).
- **Glossary.** Column: vertical blocks of content inside a pane or on the window grid. Gap: space between
  elements inside a container. Margin: space between the window edge and its content. Spacer: space
  between two panes (the new glossary ties it to foldables, but every two-pane layout uses it). Fold: a
  flexible screen area or a hinge between displays. Drag handle: the control that resizes panes.
  Multi-window: several apps sharing one screen.

## Breakpoints (window size classes)

A breakpoint is a window width at which the layout should change to fit the space, the device's
conventions and how people hold it. The five width breakpoints apply to Android and the web. 1dp = 1 CSS
px (see [units](#units-and-query-rules)).

### Width classes

| Class | Width (dp = px) | Typical windows | Panes | Navigation | Margin | Spacer | Helper property |
|---|---|---|---|---|---|---|---|
| Compact | 0–599 | Phone portrait | 1 | Navigation bar, or modal expanded navigation rail | 16 | none | (lower bound 0) |
| Medium | 600–839 | Tablet portrait, open foldable portrait | 1 recommended; 2 only for low-density content | Navigation rail (one pane) or navigation bar (two panes); modal expanded rail in either case | 24 | 24 | `--m3e-breakpoint-medium` = 600px |
| Expanded | 840–1199 | Phone or tablet landscape, open foldable landscape, desktop | 2 recommended (1 for dense media) | Navigation rail, collapsed or expanded (modal or standard) | 24 | 24 | `--m3e-breakpoint-expanded` = 840px |
| Large | 1200–1599 | Desktop | 2 recommended (1 for dense media) | Navigation rail; expanded when content allows | 24 | 24 | `--m3e-breakpoint-large` = 1200px |
| Extra-large | 1600 and up | Desktop, ultra-wide monitor | 2 by default; 3 allowed (third is a standard side sheet) | Expanded navigation rail suits it best | 24 | 24 | `--m3e-breakpoint-extra-large` = 1600px |

- **Classify from the top down.** A window belongs to the largest class whose lower bound is at most its
  width (Android's `isWidthAtLeastBreakpoint` works this way). Classes follow the window the app gets, not
  the physical screen, so split screen, resizing and folding change them at runtime.
- **Large and extra-large are optional.** They matter mostly for laptop and desktop web. A product that
  skips them treats expanded as 840dp and up, which is what Android's older three-class API does. Decide
  from your platform and users.
- The `--m3e-breakpoint-*` properties are this skill's web helpers, not Material tokens; Material
  publishes no breakpoint tokens.

### Height classes

| Class | Height (dp = px) | Helper property | What to change |
|---|---|---|---|
| Compact height | 0–479 | (lower bound 0) | Almost all phones in landscape land here. Don't force two panes; keep top and bottom bars slim so content keeps most of the height. |
| Medium height | 480–899 | `--m3e-breakpoint-height-medium` = 480px | Most phones in portrait and tablets in landscape. No special handling. |
| Expanded height | 900 and up | `--m3e-breakpoint-height-expanded` = 900px | Most tablets in portrait. When the width fits only one column, Compose's pane scaffold stacks two panes vertically with a 24dp spacer. |

Material says height classes exist on Android and are rarely needed, because most layouts scroll
vertically; it publishes no numbers. The 480/900 bounds, the device examples and the compact-height advice
come from Android's documentation and androidx.window. Using them on the web is this skill's
extrapolation.

### What to change at each width class

**Compact (under 600px)**
- One pane. Navigation bar along the bottom where thumbs reach it, or a modal expanded navigation rail.
- 16px side margins. Toolbars and FABs sit in the bottom rail region above the navigation bar.
- Supplemental choices go in bottom sheets; dialogs can be basic or full-screen.
- The window can leave compact at any moment (unfold, rotate, leave split screen, resize), so keep state
  outside the layout.

**Medium (600–839px)**
- One pane by default. Two panes only for light content with clear actions, such as settings; never for
  information-dense content. Two panes at medium are 50/50 with no custom widths, and a drag handle may
  expand one of them to the full width.
- Navigation: a rail with one pane, a navigation bar with two panes (so the panes get the full width), a
  modal expanded rail in either case. The rail may hide on secondary screens as long as back returns to
  the top-level destination.
- 24px margins and a 24px spacer. Menus replace bottom sheets.
- Reach: on landscape tablets and open foldables the top quarter of the screen is hard to reach, and the
  very bottom edge is awkward for large hands. Keep primary controls out of both.

**Expanded (840–1199px)**
- Two panes are usually best: a split with the spacer centred, or a 360px fixed pane beside a flexible
  one. Use one pane for visually or informationally dense content such as video.
- Navigation rail, collapsed or expanded. Put sorting, filtering and secondary navigation inside the pane
  (tabs and similar), not in the scaffold.
- Watch the expanded rail: at 840px an expanded rail at its 360px maximum leaves the leading pane of a
  centred split 48px wide (840 − 360 − 24 spacer − 384 trailing pane − 24 margin). Collapse the rail or
  drop to one pane.

**Large (1200–1599px)**
- Two panes; the fixed pane grows to 412px. The rail is collapsed or expanded depending on content;
  collapse it on deeper pages or when space is tight.
- Cap text measure (see [Line length](#line-length)); wide panes make lines too long.

**Extra-large (1600px and up)**
- Two panes by default. A third pane is allowed as a standard side sheet (at most 400px wide); the
  expanded rail can then stay, collapse or hide. Never more than three panes.
- The expanded navigation rail fits best here. Cap text measure as at large.

### Moving between classes

Design one class first, then ask five questions for the next size up:

1. **Reveal.** What was hidden that now fits? A rail that was collapsed on mobile can start open; a second
   pane can show the selected item.
2. **Divide.** How many panes? One at compact and medium, two at expanded and large, consider three at
   extra-large. Single-pane layouts suit focused work: games, films, video calls, creative tools.
3. **Resize.** Which containers grow? Cards, feeds, lists and panes can widen; margins, orientation and
   text size can change.
4. **Reposition.** Where should things move? Reflow content, add a column or negative space, and keep
   controls reachable (for example, actions move from the bottom at compact to the leading edge at medium
   and expanded). An element can stay anchored to the start, end or centre of a growing parent; a button's
   icon and label stay together.
5. **Swap.** Replace a component only with a functional equivalent, and only for a real ergonomic or
   functional gain.

| Role | Compact | Medium | Expanded |
|---|---|---|---|
| Navigation | Navigation bar | Collapsed navigation rail | Collapsed navigation rail |
| Navigation | Modal expanded navigation rail | Modal expanded navigation rail | Standard expanded navigation rail |
| Communication | Basic or full-screen dialog | Basic dialog | Basic dialog |
| Supplemental selection | Bottom sheet | Menu | Menu |

At large and extra-large a collapsed rail can become an expanded one. Never swap non-equivalents (a
button for a chip, a button for a menu), and take care when switching between list items and cards.

## Panes

A pane is one destination: in a messaging app, the conversation list is one pane and the open thread is
another.

### How many panes

The Panes column of the [width-class table](#width-classes) is the rule: compact 1; medium 1 (2 only for
low-density content); expanded and large 2 recommended, 1 allowed; extra-large 2 recommended, 1 or 3
allowed; never more than 3.

Material disagrees with itself at extra-large: the panes page recommends 2, while the breakpoints
overview (May 2026) says to consider 3. Default to two panes at extra-large and add a third only as a
standard side sheet, the one third-pane form Material describes. Compose's pane scaffold allows three
horizontal panes from large up; follow the guidance (three only at extra-large) instead.

### Pane types

- **Fixed** keeps its width whatever the space; **flexible** grows and shrinks. Every layout needs at
  least one flexible pane.
- **Permanent** stays; **temporary** appears when needed and is dismissed, and the remaining panes resize
  around it. A fixed pane is often temporary (side sheets, light lists).

### Arrangements

| Arrangement | Classes | Widths |
|---|---|---|
| Single pane | Any (recommended at compact and medium) | One flexible pane filling the space between margins |
| Split pane | Medium (low density, 50/50), expanded and up | Two flexible panes; the spacer's centre stays at 50% of the window |
| Fixed + flexible | Expanded and up | Fixed pane 360px at expanded (`--m3e-fixed-pane-width-expanded`), 412px at large and extra-large (`--m3e-fixed-pane-width-large`); either order |
| Three panes | Extra-large only | Two panes plus a standard side sheet (max 400px, `--m3e-side-sheet-max-width`) |

- **Centred spacer.** With a navigation rail, the rail and the first pane together take 50% of the window
  and the second pane takes the other 50%; without a rail, each pane is 50%. The rail therefore shrinks
  only the leading pane, and the divider stays at the window's centre. Material names foldables and
  dynamic layouts as where the split works best: a centred divider can line up with a hinge, and (our
  reading) it does not move when the rail expands or collapses.
- **412 vs 400.** Fixed panes at large and extra-large are 412px, but a standard side sheet tops out at
  400px. Material points out the mismatch itself. When the third pane is a side sheet, size it with
  `--m3e-side-sheet-max-width` (400px), not the fixed-pane helper.

### Spacer and margins around panes

- The spacer between side-by-side panes is **24px** at every class that has two panes
  (`--m3e-pane-spacer`). Compact has one pane and no spacer.
- **A navigation rail replaces the leading margin.** Material's two-pane diagrams label the spacer and
  the trailing margin 24dp when a rail is present and start the first pane at the rail's edge; without a
  rail, all three (leading margin, spacer, trailing margin) are 24dp. The text never says this outright,
  so treat it as a diagram reading. The shipped token file follows the same reading.
- The spacer can hold the drag handle; the handle's touch area extends slightly into both panes.

### Display modes

- **Co-planar:** panes side by side on the same plane. Keep persistent tools (tool panels, inspectors)
  co-planar with the content so they stay reachable.
- **Floating:** a smaller pane above larger ones. Temporary tasks such as dialogs float at every size.
  Floating panes can be draggable or resizable; those controls must be accessible.
- **Docked:** a small pane pinned to a window edge with one side running past the screen edge, like a
  bottom sheet.

### Drag handle

Current guidance:
- A handle adjusts the width of flexible panes, and fully collapses or restores a fixed pane (switching
  between one and two panes).
- In a split layout, panes resize freely or snap. Optional snap points at expanded and wider: **360px,
  412px, or the centred split**. At medium, only 50/50 or one pane expanded to full width.
- Selecting the handle (tap, double tap or long press) toggles between layout sizes.
- **Persistent resizing** remembers the chosen width after the app closes and across breakpoint changes;
  a layout collapsed to one pane stays collapsed at every size. Use it for most resizable layouts.
- **Temporary resizing** resets to the default when the pane or app is closed and reopened. Use it mainly
  for supporting panes, which people rarely resize.

Legacy guidance (pre-2026 text, not contradicted, still worth following):
- In a two-pane layout the handle sits in the spacer; when one pane is expanded to full width, it sits at
  that pane's edge. Its touch region wins over the system back gesture. In list-detail it appears only
  once an item is selected.
- Keyboard: Tab focuses the handle; Enter or Space resizes to a preset or lets the arrow keys move between
  presets. Screen readers get a label such as "Resize layout" and a state (for example "left pane
  expanded", "panes equally sized"). Products that can't offer a handle can offer a layout toggle button
  or setting instead.
- Don't restyle the handle; give it a hover state (for example a size change).

How it looks, stated as foundation rules. The exact bar size is a component spec: take it from
[Material's component pages](https://m3.material.io/components), not from this file.
- A slim pill (`--md-sys-shape-corner-full`) centred in the 24px spacer, coloured
  `--md-sys-color-outline` at rest so it stays quiet next to content.
- On hover, press and drag it grows; while pressed or dragged it also turns `--md-sys-color-on-surface`
  so the person can see it is held. Size is a spatial change, so animate it with
  `--m3e-motion-spring-fast-spatial`; animate the colour with `--m3e-motion-spring-fast-effects`.
- Its hit area is at least `--m3e-min-target-size` (48px) wide, so it reaches into both panes.
- Illustrative (component value): Compose's handle is a 4×48px bar at rest and 12×52px while pressed.

### Pane focus and accessibility

- Co-planar panes: focus order follows the visual order (mirrored in RTL).
- Modal floating pane: everything behind it is unusable; focus moves to its first element when it opens
  and returns to the trigger when it closes. If it opened by itself, focus still moves in, and on close
  goes to the next logical element. Interacting outside it dismisses it.
- Non-modal floating pane: the rest of the product stays usable; focus can move in and out, and the pane
  sits at a sensible point in the reading order.
- Docked panes follow the modal or non-modal rules, with focus order matching their visual position.

## Margins and layout helpers

These are documented Material values exposed as web helpers in the shipped token file. They are not
Material tokens (Material has no breakpoint, margin, pane or target-size tokens). Read them with `var()`
instead of retyping the numbers, so layout code and the token file can't drift apart.

| Constant | CSS custom property | Value | Use |
|---|---|---|---|
| Window margin, compact | `--m3e-window-margin-compact` | 16px | Leading and trailing window edges below 600px. Same value as `space200`. |
| Window margin, medium | `--m3e-window-margin-medium` | 24px | 600–839px. Same value as `space300`. |
| Window margin, expanded | `--m3e-window-margin-expanded` | 24px | 840–1199px. |
| Window margin, large | `--m3e-window-margin-large` | 24px | 1200–1599px. |
| Window margin, extra-large | `--m3e-window-margin-extra-large` | 24px | 1600px and up. |
| Responsive window margin | `--m3e-window-margin` | 16px, then 24px from 600px | The one to use in layout code: the token file switches it with a media query on `:root`, so no rule of yours has to. The per-class helpers above are for `calc()` and JS. |
| Pane spacer | `--m3e-pane-spacer` | 24px | Gap between side-by-side panes (medium and wider). |
| Fixed pane, expanded | `--m3e-fixed-pane-width-expanded` | 360px | Fixed pane in fixed + flexible layouts and supporting panes at 840–1199px; also a snap width. |
| Fixed pane, large and XL | `--m3e-fixed-pane-width-large` | 412px | Fixed pane from 1200px; also a snap width. |
| Side sheet, maximum | `--m3e-side-sheet-max-width` | 400px | The third pane at extra-large, which is a standard side sheet. Not the 412px fixed-pane width. |
| Minimum target | `--m3e-min-target-size` | 48px | Smallest hit area for any interactive element, at every density: `min-block-size` of rows, the drag handle's hit area. It is a size, so don't substitute `space600`. Rules in [interaction-states.md](interaction-states.md#touch-targets). |
| Width breakpoints | `--m3e-breakpoint-medium` / `-expanded` / `-large` / `-extra-large` | 600px / 840px / 1200px / 1600px | For `calc()` and JS; `var()` cannot appear in `@media`/`@container` conditions. |
| Height breakpoints | `--m3e-breakpoint-height-medium` / `-height-expanded` | 480px / 900px | Same limits as above. |

- Margins may be tightened or loosened on purpose with margin rulers (see
  [Grids and rulers](#grids-and-rulers)), for example a photo grid running full width while search keeps
  its margins.
- Where a navigation rail sits, it takes that side's margin.

## Spacing system

Spacing is the room left around and between elements. Material applies it as three kinds:
**padding** (inside an element), **gap** (between elements in a container) and **margin** (outside an
element). Page layouts use margins, top padding, horizontal padding, the spacer and vertical gaps; panes,
spacers and margins shape the page, while padding and gaps organise content inside panes.

### 4dp or 8dp?

- The current system is an **8dp scale**: `space100` = 8dp, and a token's number is its multiplier × 100
  (`space50` = 0.5 × 8 = 4dp, `space450` = 4.5 × 8 = 36dp).
- **Main units** are whole multiples of 8 (plus 0). **Nested units** are the in-between values that
  components and layouts need: 2, 4, 6, 10, 12, 14, 20 and 36dp. Material defines only nested units that
  are actually used.
- It is neither a pure 8dp grid (nested units exist) nor a pure 4dp grid (2, 6, 10 and 14 are off it).
  The smallest step is 2dp.
- The old guidance measured padding in 4dp increments; that text is no longer published. Treat "4dp grid"
  as legacy framing and choose from the token scale.
- Products may extend the scale with the same naming rule (Material's example: `space225` = 18dp). Do
  that as an app-level custom property (for example `--app-space225: 18px`), not by adding `--md-*` names.

### Tokens

All 18 tokens have one value for every platform, audience and theme. Material lists them as Compose-only;
the shipped CSS exposes them for web use. Material gives no per-token usage rules: entries marked
"Material example" come from its spacing pages, and the rest of the Use column is this skill's
suggestion.

| Token | CSS custom property | Value | Kind | Use |
|---|---|---|---|---|
| `md.sys.measurement.space0` | `--md-sys-measurement-space0` | 0px | main | No space: full-bleed media, flush edges, removing a gap in one context. |
| `md.sys.measurement.space25` | `--md-sys-measurement-space25` | 2px | nested 0.25× | Smallest nudge; the per-side density step in this skill's density recipe. |
| `md.sys.measurement.space50` | `--md-sys-measurement-space50` | 4px | nested 0.5× | Tight pairs inside small components, such as two stacked label lines. Equals one density step of height. |
| `md.sys.measurement.space75` | `--md-sys-measurement-space75` | 6px | nested 0.75× | Internal padding where 4px is cramped and 8px loose. |
| `md.sys.measurement.space100` | `--md-sys-measurement-space100` | 8px | main 1× (base) | The base unit. Material example: search uses 8px block padding and 8px gaps. A good default gap in rows of chips or buttons. |
| `md.sys.measurement.space125` | `--md-sys-measurement-space125` | 10px | nested 1.25× | Material example: the default button top padding. |
| `md.sys.measurement.space150` | `--md-sys-measurement-space150` | 12px | nested 1.5× | Search horizontal margins when focused (Material example); compact internal padding. |
| `md.sys.measurement.space175` | `--md-sys-measurement-space175` | 14px | nested 1.75× | Rare fine-tuning inside components. |
| `md.sys.measurement.space200` | `--md-sys-measurement-space200` | 16px | main 2× | Same value as the compact window margin. Content padding for cards, sheets and list rows. Material example: a taller button remaps its top padding to it. |
| `md.sys.measurement.space250` | `--md-sys-measurement-space250` | 20px | nested 2.5× | Between 16 and 24 when neither fits. |
| `md.sys.measurement.space300` | `--md-sys-measurement-space300` | 24px | main 3× | Same value as the medium-and-up margin and the pane spacer; search default horizontal margins (Material example). |
| `md.sys.measurement.space400` | `--md-sys-measurement-space400` | 32px | main 4× | Separating sections inside a pane. |
| `md.sys.measurement.space450` | `--md-sys-measurement-space450` | 36px | nested 4.5× | The only nested unit above 20px; rare. |
| `md.sys.measurement.space500` | `--md-sys-measurement-space500` | 40px | main 5× | Larger section breaks; roomier desktop layouts. |
| `md.sys.measurement.space600` | `--md-sys-measurement-space600` | 48px | main 6× | Large-button leading padding (Material example). Same number as the 48px target, but a target is a size, not spacing: use `--m3e-min-target-size` for it. |
| `md.sys.measurement.space700` | `--md-sys-measurement-space700` | 56px | main 7× | Generous negative space around hero or display content. |
| `md.sys.measurement.space800` | `--md-sys-measurement-space800` | 64px | main 8× | As above, for large windows. |
| `md.sys.measurement.space900` | `--md-sys-measurement-space900` | 72px | main 9× | Top of the scale; the largest spacing value Material defines. |

There are no tokens for 18, 28 or 44px, or above 72px. The window margins and spacer equal `space200` and
`space300` by value, but Material does not link them, so the token file keeps them as separate helpers.

### Choosing and applying spacing

- **Put spacing on the parent.** Use padding and `gap` on containers rather than margins on children.
  Child margins tend to be uneven and need more values; Material rarely uses margins inside components.
  Keep margins for space beyond a parent's padding, or for layout.
- **Name gaps by what they separate.** Simple components need one horizontal and one vertical gap;
  complex ones name each gap after its neighbours (for example an icon-label gap).
- **Group, direct, express.** Use outlines, dividers or shadows to group explicitly, or proximity and
  open space to group implicitly. Keep spacing between related items consistent (rhythm), give similar
  elements the same size and spacing and align their leading elements (similarity), put actions next to
  what they affect (proximity), and keep related items in one row, column or container (continuity).
  Give the most important content the most space.
- **Tone.** Tighter spacing reads serious and focused; looser spacing reads calm and open. Desktop
  layouts can afford more room than mobile ones.
- **Adapt the mapping, not the token.** To change spacing by device or density, switch which token a
  component attribute points to (for example button top padding `space125` → `space200` for a taller
  button). Never redefine `--md-sys-measurement-space200` itself. Shared pattern values (Material's
  example: a "surface content horizontal padding" used by cards and sheets) are a good home for that
  switch.
- **Text scaling.** By default, spacing stays the same when text is enlarged to 200%. On the web, keep
  spacing in px, not rem or em, so it does not grow with the user's font size.

## Density

Information density is how much content fits in a space. It can be raised through layout spacing
(margins, spacers, padding) alone; components do not have to shrink.

- **When:** high density helps scanning and comparing (data tables, dashboards, finance, news). Low
  density suits focused, calm or easy-to-navigate products. Some people gain nothing from density.
- **Who decides:** the person. Density is opt-in, may differ between their desktop and mobile use, and
  must not change on its own with breakpoint or orientation.
- **Component scale:** 0 is the default; −1, −2 and −3 are progressively denser (some Material examples
  go to −4). Each step removes **4px of component height**, split as 2px from the top and 2px from the
  bottom; horizontal padding and text size stay the same, and content stays centred. (The current page
  describes a 4dp cut to vertical padding or height without saying it applies per step; Material's 2020
  density-on-the-web post states the per-step height rule explicitly.)
- **Exclusions:** don't densify focused tasks such as menu selection, or alerting components such as
  snackbars and dialogs. The density setting's own controls stay at default size so the change can be
  undone.
- **Targets:** every interactive element keeps a 48×48px target (`--m3e-min-target-size`) even when it
  looks smaller (a 24px icon gets a 48px target; a 36px-tall button gets a 48px target). Denser rows can
  sit flush against each other: targets that tile a container without overlapping don't need the usual
  8px between them, but each row still has to reach 48px (see
  [interaction-states.md](interaction-states.md#touch-targets)).
- The 2020 post (M2-era advice, not repeated on the current page) adds: as components get denser, loosen
  horizontal layout spacing to keep things legible.
- **dp and pixel density:** dp = px × 160 ÷ dpi, so 1dp is one physical pixel at 160dpi. A 1.5-inch-wide
  screen is 180px at 120dpi, 240px at 160dpi and 360px at 240dpi; all three are 240dp.

## Grids and rulers

- **Columns:** 4 at compact, 8 at medium and expanded, 12 at large and extra-large. Material states 4 and
  8 in image descriptions (a tablet at 8 columns with each of two panes spanning 4) and shows 12 only in a
  mockup. Fewer columns keep compact layouts focused; more appear as the window grows.
- **Gutters and column widths are not published.** Any gutter is your choice; label it as such. This
  skill's default is 16px at compact and 24px from 600px, which matches the margins and makes the
  column boundary between two 4-column panes equal the 24px spacer.
- **Uses:** grouping related content, consistent spacing, focal points for primary actions, and aligning
  bars, rails and panes. The grid's structure and spacing also carry personality.
- **Rulers** are shared alignment lines, with no numeric positions published:
  - bar and safety rulers keep app bars clear of the status bar and gesture area;
  - title rulers align the app-bar title, icons and controls;
  - content rulers: the first anchors major blocks (hero image, headline, key components), secondary ones
    mark where supporting text or actions start;
  - margin rulers can shift inward or outward to tighten or loosen a layout, for example full-bleed photos
    beside a search field that keeps wider margins.
- On the web, rulers are consistent `padding-inline` values, named grid lines or `subgrid`.

## Canonical layout examples and adaptive strategies

The three examples demonstrate the scaffold; extend one or layer scaffold elements to build a custom
layout. All three mirror in RTL.

### List-detail

For parent-child pairs: messages and a conversation, folders and files, artists and albums, settings and
a category, an inbox and an email.

| Class | Visible panes |
|---|---|
| Compact | 1 (list or detail) |
| Medium | 1 recommended (dense content, deep focus); 2 for browsing and fast switching, with a bottom navigation bar or modal rail to free width |
| Expanded, large, extra-large | 2 |

- The back button appears only in the single-pane detail view; the selected highlight appears only in the
  two-pane list.
- Nothing selected: one pane shows the list; two panes show a placeholder or empty state in the detail
  pane. With multi-select, keep the most recently used pane when collapsing to one.
- Item selected: going from one pane to two shows both, with that item's detail. Going from two to one
  usually shows the detail, which gains an app bar; when selecting doesn't navigate deeper (for example
  multi-select), show the list with the item selected. If the single-pane view was the list
  before, return to the list.
- Keep state: read/unread and similar, and each detail view's scroll position, across item switches and
  across folding and unfolding.

### Supporting pane

A primary area (most of the window, roughly two-thirds) and a secondary area whose content only makes
sense next to the primary one: document editing with comments, productivity tools, media browsing.

- Compact and medium: the supporting pane sits below the primary pane at flexible width; at compact a
  bottom sheet can carry it instead.
- Expanded: leading or trailing, fixed at 360px. Material's page stops at expanded; 412px at large and
  wider is this skill's inference from the fixed-pane rule.
- "Two-thirds" is loose: 360px is 43% of an 840px window. Treat the fixed width as the rule.
- For parent-child content, use list-detail instead.

### Feed

A grid of cards or list items for browsing lots of content (news, photos, social).

- Items can vary in size to show relationships; reading order follows position.
- Compact: one column, each item at full pane width. Medium: several columns of mixed widths. Expanded
  and wider: usually more columns, which can also widen.
- Items reflow on rotation, unfolding and entering multi-window.

### Adaptive strategies

- **Show and hide:** panes enter, exit or appear side by side as the class or orientation changes.
- **Levitate:** a pane rises above content as a floating or docked pane near its trigger. On large
  screens, floating is the default and the scrim is optional. Docked panes can become floating or
  co-planar at medium and expanded, and on large screens Material suggests considering co-planar. Its
  "large screens" example is a tablet, so decide by available space, not by the Large breakpoint.
- **Reflow:** panes rearrange; in portrait a supporting pane moves below the primary one, and panes stack
  when horizontal space runs out.
- **Layering** (custom layouts): float a pane over content for a focused task such as reviewing a basket,
  replying to a comment or creating an event.

### Adaptive design beyond panes

- Components adapt by **resizing** (a button either fills its container or hugs its label and keeps its
  alignment), **showing and hiding** (list items reveal descriptions on a tablet) and **presentation
  changes** (a FAB becomes an extended FAB; a rail expands at larger sizes).
- Components respond to their own container and pane boundaries, not only to the window. On the web that
  is what container queries are for (this skill's mapping, not Material's wording).
- Support touch, pointer and keyboard on every device: a tablet with a keyboard or a phone on an external
  display behaves like a desktop.
- Window modes: mobile has full screen, split screen and bubbles; desktop adds floating and free-form
  windows. Start from mobile and make sure the product scales up to desktop and spatial.

## Foldables, hardware and multi-window

Material no longer publishes this section; the guidance below is the legacy text plus platform behaviour.

- **Display cutouts** (camera or sensor areas) can hide UI. Draw edge to edge if you like, but keep
  controls and text in the safe area.
- **Folds:** a seamless flexible fold lets content flow across it; a physical hinge splits the screen into
  two areas, so treat each side as its own pane and line the spacer up with the hinge.
- **Postures:** folded (front screen, often compact); open flat (usually medium or expanded); tabletop
  (half open, around 90°), where controls near the fold are hard to reach and text across it is hard to
  read. Android's Compose guidance for tabletop splits the layout at the hinge with content in the top
  half and controls in the bottom half; follow it on the web too.
- **Continuity:** after folding or unfolding, resume in the same state and position.
- **Scrolling:** with several panes, let each scroll on its own; decide deliberately whether a newly
  widened layout scrolls as a whole or per pane.
- **Multi-window** is not multiple panes. Split screen starts 50/50 and can be adjusted (the legacy
  illustration shows one-third / two-thirds); the app often drops to compact and must adapt smoothly.

## Line length

- Keep body text at **40–60 characters per line** at every class, using margins, pane widths and type
  styles. Large and extra-large windows need the most care, since one wide pane stretches lines well past
  60.
- Cap body text with **`max-inline-size: 50ch`**, the skill's one recommended value. A `ch` is the width
  of the digit "0", and a column fits more real characters than its `ch` count suggests: in
  [typography.md](typography.md#readability), body-large Roboto with its tracking measured 53–59
  characters per line at 50ch. The measurement and its caveats live there; this file only applies the
  cap. Other fonts and scripts fit a different number, so check the cap with the real font.
- The lower end matters in narrow panes and multi-column text. When a column drops well below 40
  characters, remove a column or give the pane more width rather than shrinking the type.
- Give the width the cap saves to margins, columns or a second pane, never to longer lines.

## Bidirectionality and RTL

More than 2 billion people read right-to-left scripts (Arabic, Hebrew, Persian, Urdu). Material names
positions leading and trailing so layouts can mirror, though some cases need extra work.

- **Mirror the layout:** navigation moves to the right, reading starts top right, list-detail, supporting
  pane and feed all mirror, and leading/trailing spacing swaps sides.
- **Text:** alignment (where the box edges sit) and direction (how text flows inside) are separate. RTL
  text is normally right-aligned and flows right to left. Typing, caret placement, punctuation, URLs and
  phone numbers are where bidirectional bugs show up. Keep an email address's parts in order (domain to
  the right of the username), and never force LTR direction onto RTL text.
- **Icons:** mirror icons that point somewhere (back, forward, send). The help icon mirrors in some
  languages (Urdu, Persian). Don't mirror clocks, circular refresh arrows or clockwise progress.
- **Time:** linear progress usually fills right to left, but stays LTR in Hebrew; circular progress stays
  clockwise; media controls are always LTR; clocks run clockwise with AM/PM on the left.
- **Exceptions that stay LTR:** charts and graphs in Persian and Urdu; timelines and media controls in
  Hebrew.
- **Components:** badges move to the top left; toolbars reverse tool order; app bars mirror and flip
  directional icons; navigation rails sit on the right; text fields swap leading and trailing icons; a
  chip's trailing icon stays at the end.
- **Gestures:** swipe actions and predictive back mirror.

## Applying it on the web

### Units and query rules

- **dp = CSS px, 1:1** for spacing, breakpoints, pane widths and margins. Both are density-independent;
  on Android, Chrome's default `devicePixelRatio` is normally screen density ÷ 160.
- **Query the viewport or a container, never the device.** No user-agent or `screen.width` branching; use
  media queries, container queries and `matchMedia` so layout follows resizing, split screen and folding.
- **Use px breakpoints, not em.** `em` in media queries resolves against the browser's initial font size,
  so em breakpoints move for people with a larger default font and no longer match Material's
  window-size definition. Some teams choose em on purpose; treat that as a documented deviation.
- **`var()` cannot appear in `@media` or `@container` conditions**, and `@custom-media` has not shipped
  by default in any browser. Write the numbers literally (or generate them); use the `--m3e-breakpoint-*`
  helpers in values, `calc()` and JS. Custom properties *can* be set inside `@media` blocks, which is how
  `--m3e-window-margin` switches from 16px to 24px.
- **Range syntax** (`width >= 840px`) needs Chrome 104, Firefox 102, Safari 16.4. For older engines use
  `min-width`/`max-width` with `.98` upper bounds: widths can be fractional when zoomed, and
  `max-width: 839px` would leave a gap between 839 and 840.

### Media queries for each class

```css
/* Mobile-first: compact is the base style; each query adds the next class up.
   Mirrors Android's "width is at least X" checks. */
@media (width >= 600px)  { /* medium and wider */ }
@media (width >= 840px)  { /* expanded and wider */ }
@media (width >= 1200px) { /* large and wider */ }
@media (width >= 1600px) { /* extra-large */ }

/* Exactly one class */
@media (width < 600px)            { /* compact */ }
@media (600px <= width < 840px)   { /* medium */ }
@media (840px <= width < 1200px)  { /* expanded */ }
@media (1200px <= width < 1600px) { /* large */ }
@media (width >= 1600px)          { /* extra-large */ }

/* The same ranges without range syntax (.98 closes the gap at fractional widths) */
@media (max-width: 599.98px)                          { /* compact */ }
@media (min-width: 600px) and (max-width: 839.98px)   { /* medium */ }
@media (min-width: 840px) and (max-width: 1199.98px)  { /* expanded */ }
@media (min-width: 1200px) and (max-width: 1599.98px) { /* large */ }
@media (min-width: 1600px)                            { /* extra-large */ }

/* Height classes (Android values; rarely needed) */
@media (height < 480px)          { /* compact height: one pane, slim bars */ }
@media (480px <= height < 900px) { /* medium height */ }
@media (height >= 900px)         { /* expanded height */ }
```

### Container queries for each class

Use media queries for scaffold decisions (pane count, navigation type, window margins), because Material
defines those against the window. Use container queries for components inside panes, because a pane in a
two-pane layout can be much narrower than the window. Width queries need `container-type: inline-size`
(size queries: Chrome 105, Firefox 110, Safari 16). For height classes, query the viewport
(`@media (height < 480px)`) rather than a pane: a height query needs `container-type: size`, which makes
the container ignore its content's height and collapses content-sized panes such as a stacked supporting
pane.

```css
/* Every pane is a width container; components respond to the pane, not the window */
.pane { container: pane / inline-size; }

@container pane (width < 600px)            { /* compact-width pane */ }
@container pane (600px <= width < 840px)   { /* medium-width pane */ }
@container pane (840px <= width < 1200px)  { /* expanded-width pane */ }
@container pane (1200px <= width < 1600px) { /* large-width pane */ }
@container pane (width >= 1600px)          { /* extra-large-width pane */ }

/* Example: a feed adds columns as its pane widens (the counts are illustrative;
   Material only says the count should usually grow from expanded up) */
.feed { display: grid; gap: var(--md-sys-measurement-space200); }
@container pane (width >= 600px)  { .feed { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@container pane (width >= 840px)  { .feed { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@container pane (width >= 1200px) { .feed { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

/* Window-sized container: same thresholds as the media queries, but measured without a
   classic scrollbar (and without body's default 8px margins, hence margin: 0), so the two
   can still disagree by about 15px near a breakpoint */
body { margin: 0; container: window / inline-size; }
@container window (width >= 840px) { .toolbar { flex-direction: column; } }

/* Optional: name the class once, then query it anywhere with a style query
   (custom-property style queries: Chrome 111, Safari 18, Firefox 151) */
:root { --window-class: compact; }
@media (width >= 600px)  { :root { --window-class: medium; } }
@media (width >= 840px)  { :root { --window-class: expanded; } }
@media (width >= 1200px) { :root { --window-class: large; } }
@media (width >= 1600px) { :root { --window-class: extra-large; } }
@container style(--window-class: extra-large) { .side-sheet { display: block; } }
```

### Classifying in JavaScript

`matchMedia` sees the same viewport as the CSS (fractional widths, scrollbar handling), so JS and CSS
agree at the thresholds. For pane-level logic, a `ResizeObserver` on the pane is the JS counterpart of a
container query.

```js
// Reads the helper properties from the token file (with the same numbers as fallbacks in case
// the stylesheet has not loaded yet); checks the largest class first.
const rootStyle = getComputedStyle(document.documentElement);
const px = (name, fallback) => parseFloat(rootStyle.getPropertyValue(name)) || fallback;
const WIDTH = [
  ['extra-large', px('--m3e-breakpoint-extra-large', 1600)],
  ['large', px('--m3e-breakpoint-large', 1200)],
  ['expanded', px('--m3e-breakpoint-expanded', 840)],
  ['medium', px('--m3e-breakpoint-medium', 600)],
  ['compact', 0],
];
const HEIGHT = [
  ['expanded', px('--m3e-breakpoint-height-expanded', 900)],
  ['medium', px('--m3e-breakpoint-height-medium', 480)],
  ['compact', 0],
];
const watch = (list, dim) => list.map(([name, min]) => [name, matchMedia(`(min-${dim}: ${min}px)`)]);
const widthMQ = watch(WIDTH, 'width');
const heightMQ = watch(HEIGHT, 'height');
const current = (mqs) => mqs.find(([, mq]) => mq.matches)[0];

function applyWindowClass() {
  document.documentElement.dataset.widthClass = current(widthMQ);   // e.g. data-width-class="expanded"
  document.documentElement.dataset.heightClass = current(heightMQ);
}
[...widthMQ, ...heightMQ].forEach(([, mq]) => mq.addEventListener('change', applyWindowClass));
applyWindowClass();
```

### Scaffold and safety regions

Add `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` so the page
can draw edge to edge, then keep content out of the safety regions with `env(safe-area-inset-*)`. The
insets are physical (a camera cutout does not move when text direction flips), so they are the one place
where `left`/`right` are correct in mirrored UI.

```html
<div class="scaffold">
  <div class="panes panes--split">
    <nav class="nav-rail" aria-label="Main">…</nav>
    <section class="pane" id="list-pane" aria-label="Inbox">…</section>
    <div class="drag-handle" role="separator" tabindex="0" aria-orientation="vertical"
         aria-controls="list-pane" aria-label="Resize panes"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>
    <section class="pane" aria-label="Message">…</section>
  </div>
  <nav class="nav-bar" aria-label="Main">…</nav>
</div>
```

```css
.scaffold {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;          /* pane region, then the bottom bar row */
  box-sizing: border-box;                           /* the inset padding stays inside 100dvh */
  block-size: 100dvh;
  padding-top: env(safe-area-inset-top, 0px);       /* safety regions: physical on purpose */
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}
.scaffold > .nav-bar { padding-bottom: env(safe-area-inset-bottom, 0px); }
.nav-rail { display: none; }

/* Medium and up: navigation moves from the bottom bar to a leading rail.
   (A medium two-pane layout keeps the bar instead, so both panes get the full width.) */
@media (width >= 600px) {
  .scaffold            { padding-bottom: env(safe-area-inset-bottom, 0px); }
  .scaffold > .nav-bar { display: none; }
  .nav-rail            { display: flex; flex-direction: column; }
}
```

Top app bars live inside each pane (for example `position: sticky` at the pane's top), or span the
window above `.panes` when one bar serves both panes; for that, add an `auto` row before the pane row
(`grid-template-rows: auto minmax(0, 1fr) auto`).

**Scrolled app bars in pane layouts.** In this scaffold the panes scroll and the window does not, so
`window.scrollY` stays at 0 and a scroll listener on `window` never fires. Watch the element that
actually scrolls: each pane in these layouts, or `.panes` itself in the stacked supporting-pane layout
below 840px. The usual tool is a zero-height sentinel at the top of the scroller, observed by an
`IntersectionObserver` whose `root` is that scroller (the single-bar recipe and the bar's colours are in
[elevation.md](elevation.md#1-separate-by-tone-first)). A bar inside a pane follows its own pane. A bar
spanning several panes has to know which pane scrolled. Material doesn't say; this skill's default is
to raise it while any visible pane under it is scrolled, as below. If only one pane's content passes
under the bar, observe just that pane.

```css
.pane { position: relative; }              /* containing block for the sentinel */
.scroll-sentinel {                         /* <div class="scroll-sentinel" aria-hidden="true"> in each pane */
  position: absolute;                      /* at the very top of the scrolled content, above any padding */
  inset-block-start: 0;
  inset-inline: 0;
}
```

```js
// One bar across several panes: data-scrolled while any visible pane under it is scrolled.
// checkVisibility(): Chrome 105, Firefox 106, Safari 17.4.
const bar = document.querySelector('.scaffold > .app-bar');
const scrollers = [...document.querySelectorAll('.panes > .pane')];
const atTop = new Map(scrollers.map((pane) => [pane, true]));
const update = () =>
  bar.toggleAttribute('data-scrolled', scrollers.some((pane) => !atTop.get(pane) && pane.checkVisibility()));
for (const pane of scrollers) {
  new IntersectionObserver(([entry]) => { atTop.set(pane, entry.isIntersecting); update(); }, { root: pane })
    .observe(pane.querySelector(':scope > .scroll-sentinel'));
}
const shown = new ResizeObserver(update);   // a pane hidden or shown at a breakpoint changes size
scrollers.forEach((pane) => shown.observe(pane));
```

### Pane layouts

The pane region is a grid of `[leading margin or rail] [pane A] [spacer] [pane B] [trailing margin]`.
Every child is placed explicitly: without placement, grid auto-placement drops the first pane into the
margin column and the second into the spacer. The block below was tested in Chromium at 400, 700, 900,
1300 and 1700px wide, with rails of 0, 96, 220 and 360px, in LTR and RTL: from 840px the spacer's centre
sits exactly at 50% of the region and fixed panes are 360px (412px from 1200px).

```css
/* Pane region: [leading margin | rail] [pane A] ([spacer] [pane B]) [trailing margin] */
.panes {
  /* Leading track: the window margin (16px compact, 24px from 600px) while it is empty, the
     rail's own width while a rail is shown there, since the rail takes the margin's place */
  --leading: minmax(var(--m3e-window-margin), auto);
  display: grid;
  grid-template-columns: var(--leading) minmax(0, 1fr) var(--m3e-window-margin);
  grid-template-rows: minmax(0, 1fr);                   /* fill the body row */
  min-block-size: 0;
}
.panes > *            { grid-row: 1; }
.panes > .nav-rail    { grid-column: 1; }
.panes > .pane        { grid-column: 2; overflow-y: auto; }   /* each pane scrolls on its own */
.panes > .pane ~ .pane,
.panes > .drag-handle { display: none; }                      /* one pane below the two-pane threshold */

@media (width >= 840px) {
  .panes--split,
  .panes--fixed-flex {
    grid-template-columns: var(--leading) var(--pane-a) var(--m3e-pane-spacer) var(--pane-b) var(--m3e-window-margin);
  }
  /* Split: pane B = half the region minus half the spacer and the trailing margin, so the
     spacer's centre lands on 50% whatever the rail width; pane A absorbs the rail */
  .panes--split {
    --pane-a: minmax(0, 1fr);
    --pane-b: calc(50% - var(--m3e-pane-spacer) / 2 - var(--m3e-window-margin));
  }
  /* Fixed + flexible: fixed pane leading by default, trailing with .fixed-end */
  .panes--fixed-flex           { --pane-a: var(--m3e-fixed-pane-width-expanded); --pane-b: minmax(0, 1fr); }
  .panes--fixed-flex.fixed-end { --pane-a: minmax(0, 1fr); --pane-b: var(--m3e-fixed-pane-width-expanded); }
  :is(.panes--split, .panes--fixed-flex) > .drag-handle  { display: grid; grid-column: 3; }  /* in the spacer */
  :is(.panes--split, .panes--fixed-flex) > .pane ~ .pane { display: block; grid-column: 4; }
}
@media (width >= 1200px) {
  .panes--fixed-flex           { --pane-a: var(--m3e-fixed-pane-width-large); }
  .panes--fixed-flex.fixed-end { --pane-b: var(--m3e-fixed-pane-width-large); }
}

/* Three panes, extra-large only: <div class="panes panes--fixed-flex panes--three"> whose last
   child is <aside class="pane side-sheet">. Below 1600px it stays a fixed + flexible layout and the
   side sheet leaves the grid (open it as a modal or floating pane instead). */
.panes--three > .pane.side-sheet { display: none; }
@media (width >= 1600px) {
  .panes--three {
    grid-template-columns:
      var(--leading) var(--m3e-fixed-pane-width-large) var(--m3e-pane-spacer)
      minmax(0, 1fr) var(--m3e-pane-spacer) var(--m3e-side-sheet-max-width)   /* side sheet: 400px */
      var(--m3e-window-margin);
  }
  .panes--three > .pane.side-sheet { display: block; grid-column: 6; }
}
```

- The `50%` resolves against the pane region's content box, so the region must span the usable window
  width and carry no inline padding of its own (safe-area padding on `.scaffold` is fine; the spacer is
  then centred in the usable area).
- For low-density content at medium, apply the `.panes--split` rules from 600px instead of 840px, 50/50
  only, and swap the rail for the bottom navigation bar; the leading track falls back to the 24px margin
  once the rail is hidden.
- The side-sheet rules come after the two-pane block on purpose: at equal specificity the later
  `display: none` beats the two-pane rule that shows every second pane.

List-detail and supporting-pane behaviour on top of those layouts:

```css
/* List-detail: <div class="panes panes--fixed-flex panes--list-detail" data-selected> with
   .list-pane and .detail-pane children. Below 840px one pane shows, chosen by selection. */
@media (width < 840px) {
  .panes--list-detail[data-selected] > .list-pane   { display: none; }
  .panes--list-detail[data-selected] > .detail-pane { display: block; }
}
@media (width >= 840px) {
  .panes--list-detail .back-button { display: none; }   /* back only in the single-pane detail view */
}

/* Supporting pane: <div class="panes panes--fixed-flex fixed-end panes--supporting">.
   Below 840px it reflows under the primary pane and the region scrolls as one. */
@media (width < 840px) {
  .panes--supporting {
    grid-template-rows: none;
    row-gap: var(--m3e-pane-spacer);                    /* 24px stacked gap: this skill's choice */
    overflow-y: auto;
  }
  .panes--supporting > .pane           { overflow-y: visible; }
  .panes--supporting > .pane ~ .pane   { display: block; grid-row: 2; }
  .panes--supporting > .nav-rail       { grid-row: 1 / span 2; position: sticky; inset-block-start: 0; align-self: start; }
}
```

- Hide panes with CSS or the `hidden` attribute rather than unmounting them, so selection and scroll
  position survive class changes (Chromium keeps `scrollTop` across `display: none`).
- Keep the selected item in the URL or app state, set `data-selected` when there is one, and render a
  placeholder in the detail pane when two panes show and nothing is selected.
- Keep DOM order equal to visual order. Don't reorder panes with `order` or `grid-template-areas` unless
  you also fix the tab order.

### Drag handle

```css
.drag-handle {
  /* Bar sizes are illustrative component values (Compose's handle); take exact ones from
     Material's component pages. Only these four lines are component-specific. */
  --handle-bar-inline-size: 4px;
  --handle-bar-block-size: 48px;
  --handle-bar-active-inline-size: 12px;
  --handle-bar-active-block-size: 52px;
  position: relative;
  z-index: 1;
  place-items: center;
  cursor: col-resize;                      /* legacy M3 asked for a hand cursor; col-resize is the web norm */
  touch-action: none;                      /* pointer events drive the drag on touch screens */
}
.drag-handle::before {                     /* 48px hit area that reaches into both panes */
  content: "";
  position: absolute;
  inset-block: 0;
  inset-inline: calc((var(--m3e-min-target-size) - var(--m3e-pane-spacer)) / -2);
}
.drag-handle::after {                      /* the visible bar */
  content: "";
  inline-size: var(--handle-bar-inline-size);
  block-size: var(--handle-bar-block-size);
  border-radius: var(--md-sys-shape-corner-full);
  background-color: var(--md-sys-color-outline);
  transition:
    inline-size var(--m3e-motion-spring-fast-spatial),
    block-size var(--m3e-motion-spring-fast-spatial),
    background-color var(--m3e-motion-spring-fast-effects);
}
@media (hover: hover) {                    /* hover grows the bar (the size change the guidance asks for) */
  .drag-handle:not([aria-disabled="true"]):hover::after {
    inline-size: var(--handle-bar-active-inline-size);
    block-size: var(--handle-bar-active-block-size);
  }
}
.drag-handle:is(:active, [data-dragging])::after {
  inline-size: var(--handle-bar-active-inline-size);
  block-size: var(--handle-bar-active-block-size);
  background-color: var(--md-sys-color-on-surface);
}
.drag-handle:focus-visible {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-inner-offset);
}

/* Collapsed: pane A hidden, pane B takes the width; the handle stays in the spacer to restore it */
@media (width >= 840px) {
  .panes--split[data-collapsed]                             { --pane-a: 0px; --pane-b: minmax(0, 1fr); }
  .panes--split[data-collapsed] > .pane:not(.pane ~ .pane)  { display: none; }
}
```

The script below uses the WAI-ARIA window-splitter pattern (`role="separator"`, value = the leading pane's
share of the width). Arrow keys step through the snap points, Enter or Space collapses and restores, a
drag snaps on release, and the result persists (persistent resizing). For a supporting pane with
temporary resizing, drop `save()` so the width resets on reopen. If the handle only toggles (no
dragging), use a plain `<button>` with a state label instead.

```js
const panes = document.querySelector('.panes--split');
const handle = panes.querySelector('.drag-handle');
const paneA = document.getElementById(handle.getAttribute('aria-controls'));
const KEY = 'layout:list-pane';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? 'split'; } catch { return 'split'; } };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
let state = load();                 // 'split' | 'collapsed' | width of pane A in px
let restore = 'split';
// Snap widths come from the fixed-pane helpers (fallbacks in case the token file hasn't loaded)
const helperPx = (name, fallback) =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || fallback;
const FIXED_WIDTHS = [helperPx('--m3e-fixed-pane-width-expanded', 360), helperPx('--m3e-fixed-pane-width-large', 412)];

function apply(s = state) {
  const isPx = typeof s === 'number';
  panes.toggleAttribute('data-collapsed', s === 'collapsed');
  panes.style.setProperty('--pane-a', isPx ? `${s}px` : '');
  panes.style.setProperty('--pane-b', isPx ? 'minmax(0, 1fr)' : '');
  handle.setAttribute('aria-valuenow', String(Math.round((paneA.offsetWidth / panes.clientWidth) * 100)));
}
// Snap points: collapsed, 360px, 412px and the centred split (measured: a rail changes it).
// Below 840px (a low-density split at medium) Material allows only 50/50 or one pane.
function snapPoints() {
  apply('split');
  const split = paneA.offsetWidth;
  apply();
  const pts = matchMedia('(width < 840px)').matches
    ? [['collapsed', 0], ['split', split]]
    : [['collapsed', 0], ...FIXED_WIDTHS.map((w) => [w, w]), ['split', split]];
  return pts.sort((a, b) => a[1] - b[1]);
}
const nearest = (w, pts = snapPoints()) =>
  pts.reduce((best, p) => (Math.abs(p[1] - w) < Math.abs(best[1] - w) ? p : best))[0];
const rtl = () => getComputedStyle(panes).direction === 'rtl';
const toggle = () => { if (state === 'collapsed') state = restore; else { restore = state; state = 'collapsed'; } };

let startX = 0, startW = 0, moved = false;
handle.addEventListener('pointerdown', (e) => {
  handle.setPointerCapture(e.pointerId);
  handle.dataset.dragging = '';
  startX = e.clientX; startW = paneA.offsetWidth; moved = false;
});
handle.addEventListener('pointermove', (e) => {
  if (!handle.hasPointerCapture(e.pointerId)) return;
  const dx = (e.clientX - startX) * (rtl() ? -1 : 1);
  if (Math.abs(dx) < 3 && !moved) return;
  moved = true;
  state = Math.max(0, startW + dx);
  apply();
});
function endDrag(e) {
  if (!('dragging' in handle.dataset)) return;         // only a press that started on the handle
  delete handle.dataset.dragging;
  if (moved) state = nearest(state);                   // snap on release
  else if (e.type === 'pointerup') toggle();           // a tap toggles; a cancelled press does not
  apply(); save();
}
handle.addEventListener('pointerup', endDrag);
handle.addEventListener('pointercancel', endDrag);    // e.g. the browser took over the touch
handle.addEventListener('keydown', (e) => {
  const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  if (e.key === 'Enter' || e.key === ' ') {
    toggle();
  } else if (step) {
    const pts = snapPoints();
    const i = pts.findIndex(([s]) => s === nearest(paneA.offsetWidth, pts));
    state = pts[Math.min(pts.length - 1, Math.max(0, i + step * (rtl() ? -1 : 1)))][0];
  } else return;
  e.preventDefault(); apply(); save();
});
new ResizeObserver(() => apply()).observe(panes);   // keeps aria-valuenow current
apply();
```

### Levitating panes

- **Modal floating pane:** `<dialog>` with `showModal()`. The rest of the page becomes inert, focus moves
  in, Esc closes it, and current browsers return focus to the previously focused element; confirm that in
  your target browsers. `::backdrop` is the scrim, optional on large screens (use `--m3e-scrim`).
  Material also dismisses the pane when the person interacts outside it: add `closedby="any"` (Chrome 134,
  Firefox 141; not yet in Safari) and, for other browsers, close it from a click on the backdrop.
- **Non-modal floating pane:** `dialog.show()` or `popover` (Chrome 114, Firefox 125, Safari 17). Place it
  in a sensible reading order.
- **Docked → co-planar:** render the same content as a bottom sheet below the two-pane threshold and as a
  pane column once two panes fit (840px), rather than tying the switch to the 1200px Large breakpoint.
- Add `inert` to any pane that is covered or off screen so it leaves the tab order (Chrome 102,
  Firefox 112, Safari 15.5).

### Spacing tokens in CSS

```css
/* Spacing lives on parents: padding inside, gap between; children carry no margins */
.pane-body {
  display: grid;
  align-content: start;
  row-gap: var(--md-sys-measurement-space400);          /* 32px between sections */
  padding-block: var(--md-sys-measurement-space300);    /* 24px */
}
.chip-row { display: flex; flex-wrap: wrap; gap: var(--md-sys-measurement-space100); }  /* 8px */

/* Material's search example: 8px block padding, 8px gaps, 24px inline margins (12px when focused) */
.search {
  display: flex;
  align-items: center;
  column-gap: var(--md-sys-measurement-space100);
  padding-block: var(--md-sys-measurement-space100);
  margin-inline: var(--md-sys-measurement-space300);
}
.search:focus-within { margin-inline: var(--md-sys-measurement-space150); }

/* Adapt by context by switching the mapping, never the system token itself.
   An app-level pattern value shared by cards and sheets: */
:root { --app-surface-content-padding-inline: var(--md-sys-measurement-space200); }   /* 16px */
@media (width >= 840px) {
  :root { --app-surface-content-padding-inline: var(--md-sys-measurement-space300); } /* 24px */
}
.card, .sheet { padding-inline: var(--app-surface-content-padding-inline); }
```

### Density

```css
/* Opt-in density: <html data-density="-1">. Each step removes 4px of height (2px per side);
   inline padding and font size stay the same. */
:root { --density: 0; }
[data-density="-1"] { --density: -1; }
[data-density="-2"] { --density: -2; }
[data-density="-3"] { --density: -3; }

.list-row {
  /* Illustrative 12px base: 12px, 10px, 8px, 6px per side at 0, -1, -2, -3 */
  padding-block: calc(var(--md-sys-measurement-space150) + var(--density) * var(--md-sys-measurement-space25));
  padding-inline: var(--md-sys-measurement-space200);
  min-block-size: var(--m3e-min-target-size);          /* never below the 48px target */
}
/* Menus, snackbars, dialogs and the density control itself stay at default density */
:is(.menu, .snackbar, dialog, .density-setting) { --density: 0; }
```

An equivalent approach maps each level to a token (`space150` → `space125` → `space100` → `space75`),
which gives the same 12/10/8/6px here.

### Grid and rulers

```css
/* Window grid: 4 / 8 / 12 columns. Material publishes no gutters; 16px then 24px is this skill's default. */
.page-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: var(--md-sys-measurement-space200);
  padding-inline: var(--m3e-window-margin);
}
@media (width >= 600px) {
  .page-grid { grid-template-columns: repeat(8, minmax(0, 1fr)); column-gap: var(--md-sys-measurement-space300); }
}
@media (width >= 1200px) {
  .page-grid { grid-template-columns: repeat(12, minmax(0, 1fr)); }
}
/* Nested content keeps the page's columns (content rulers).
   subgrid: Chrome 117, Firefox 71, Safari 16 */
.page-grid > .section { grid-column: 1 / -1; display: grid; grid-template-columns: subgrid; }
/* Full-bleed media escapes the margin ruler */
.page-grid > .full-bleed { grid-column: 1 / -1; margin-inline: calc(var(--m3e-window-margin) * -1); }

/* Line length: the skill's body-text cap (measured in typography.md, Readability) */
.prose { max-inline-size: 50ch; }
```

At large and extra-large, cap the measure and give the spare width to margins, columns or a second pane
rather than to longer lines.

### Logical properties and RTL

Set `dir="rtl"` on `<html>` (or `dir="auto"` on user-generated content). Grid and flex layouts mirror by
themselves; write every horizontal offset with logical properties. The shipped token file also swaps
`--md-sys-shape-corner-large-start`/`-end` under `[dir="rtl"]`.

```css
.list-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;     /* leading icon | text | trailing meta */
  column-gap: var(--md-sys-measurement-space200);
  padding-inline: var(--md-sys-measurement-space200) var(--md-sys-measurement-space300);  /* start, end */
  text-align: start;
}
.avatar { position: relative; }
.badge  { position: absolute; inset-block-start: 0; inset-inline-end: 0; }   /* top left in RTL */
.sheet  { border-start-start-radius: var(--md-sys-shape-corner-large); border-end-start-radius: var(--md-sys-shape-corner-large); }

/* Flip only icons that point somewhere (:dir(): Chrome 120, Firefox 49, Safari 16.4) */
.icon--directional:dir(rtl) { transform: scaleX(-1); }
```

- Mark content that must stay LTR in HTML: `dir="ltr"` on media controls and their progress, on Hebrew
  timelines and linear progress, and on charts for Persian and Urdu.
- Wrap LTR fragments inside RTL text (email addresses, URLs, phone numbers) in `<bdi>` or `dir="ltr"`
  spans so their parts keep their order.
- Mirror swipe directions in gesture code.

### Foldables

The Viewport Segments API (Chrome 138+ only) reports the areas on either side of a hinge; the Device
Posture API (`@media (device-posture: folded)`, Chrome 132+ only) reports a half-open posture. Treat both
as progressive enhancement and fall back to the plain breakpoints; never guess hinge positions. The
snippet below parses in Chromium but has not been tested on a folded device; verify it on hardware or in
DevTools foldable emulation.

```css
/* Side-by-side segments: line the spacer up with the hinge.
   Assumes the pane region starts at x = 0 with no rail. */
@media (horizontal-viewport-segments: 2) {
  .panes--split {
    grid-template-columns:
      0px
      env(viewport-segment-width 0 0)
      calc(env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0))   /* hinge */
      env(viewport-segment-width 1 0)
      0px;
  }
  .panes--split > .pane ~ .pane    { display: block; grid-column: 4; }
  .panes--split > .pane            { padding-inline: var(--m3e-window-margin); }  /* margins move inside each side */
}

/* Top and bottom segments (tabletop): content above the fold, controls below */
@media (vertical-viewport-segments: 2) {
  .player {
    display: grid;
    grid-template-rows:
      env(viewport-segment-height 0 0)
      calc(env(viewport-segment-top 0 1) - env(viewport-segment-bottom 0 0))
      env(viewport-segment-height 0 1);
  }
  .player > .stage    { grid-row: 1; }
  .player > .controls { grid-row: 3; }
}
```

On a seamless fold the hinge width is 0, so the pane padding provides the separation. In JS,
`window.viewport.segments` lists the segments (one entry when unfolded).

## Screen patterns from product reviews

Patterns that held up when a product owner reviewed an M3 Expressive redesign, and the alternatives they rejected.
They follow from Material's guidance (filter chips, FAB placement, emphasis) but are our synthesis, not stated rules.

**Filters sit on the list.** Show filter chips in a row directly above the list they filter, one tap each, scrolling
sideways on a narrow window rather than wrapping. A filter button that reveals the chips spends a whole row on one
icon and adds a tap. Keep the button only when the filters are many, or are fields rather than choices.

```css
.list-filters .chip-row { display: flex; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
```

**A list and its main action, not tabs, on a phone.** When a compact layout shows a list (call history, messages) and
the action that makes a new item (a dialpad, compose), don't put them in tabs side by side. Open on the list, with the
action as a FAB at the bottom end; the action's screen gets a way back. Tabs make the two look like equals and make the
action a tab switch away. On wider windows the same pair is list-detail, both visible.

- Keep the FAB clear of content: give the scrolling list bottom padding of the FAB's height plus its margin, so the
  last item can scroll out from under it.
- Put the way back where the way in was. If the FAB sat at the bottom end, put the action screen's "back to the list"
  control near that corner too, so the two toggle under the same thumb.

**Secondary actions stay quiet.** Next to a screen's primary action (a Call button), a secondary one (Call history,
Add contact) is a plain icon button with a tooltip: no container, standard size, square state layer. Giving it a FAB or
a filled container competes with the primary action, and stretching an icon button to fill a slot makes its state
layer an oval. Keep a matching empty slot on the other side if the primary action has to stay centered.

## Do and don't

- **Do** switch layouts at 600, 840, 1200 and 1600px. **Don't** use device-named breakpoints (768px
  "tablet", 1024px "desktop") for scaffold decisions: they don't match Material's classes, and devices
  change class with orientation and windowing.
- **Do** decide pane count, navigation and margins with viewport queries, and style components with
  container queries. **Don't** size components by the window: a pane in a two-pane layout is much
  narrower than the window.
- **Do** use extra width to reveal a second pane, an expanded rail or more columns. **Don't** simply scale
  up the compact layout, which wastes space and stretches lines.
- **Do** keep side-by-side panes 24px apart with the spacer centred in split layouts. **Don't** give
  medium two-pane layouts custom widths; keep them 50/50.
- **Do** let a navigation rail stand in for the leading margin. **Don't** stack a 24px margin after the
  rail; Material's diagrams start the first pane at the rail's edge.
- **Do** keep one pane flexible and fixed panes at 360px (expanded) or 412px (large and wider).
  **Don't** use more than three panes, or three anywhere below extra-large.
- **Do** take spacing from `--md-sys-measurement-space*` and put it on parents as padding and gap.
  **Don't** use off-scale values such as 18, 28 or 30px, or child margins, without a documented reason:
  they break rhythm and multiply special cases.
- **Do** switch which token a component maps to when adapting spacing. **Don't** redefine
  `--md-sys-measurement-space*`, which would silently change every component using it.
- **Do** make density a setting, 4px of height per step, with 48px targets intact. **Don't** densify on
  small screens automatically, or densify menus, snackbars or dialogs.
- **Do** cap body text at `max-inline-size: 50ch` to stay within 40–60 characters. **Don't** let prose
  span a wide pane on large windows.
- **Do** write horizontal spacing and positions with logical properties and mirror directional icons.
  **Don't** use `left`/`right`/`margin-left` in mirrored UI; the only exception is `env(safe-area-inset-*)`,
  which is physical.
- **Do** keep pane state (selection, scroll, drafts) when the class changes by hiding panes rather than
  unmounting them. **Don't** pick the layout once at load or from the user agent.

## Auditing

The consolidated checklist lives in `references/audit-checklist.md`: for a full audit, start from its
Quick audit and use the [layout and spacing checks (LAY-01 to LAY-18)](audit-checklist.md#layout-and-spacing-lay),
which carry IDs, severities, verification steps and the report format. The checks below are the short
layout pass.

Resize across 599/600, 839/840, 1199/1200 and 1599/1600px of width (and 479/480, 899/900px of height),
in LTR and RTL.

1. Do scaffold changes (pane count, navigation type, margins) happen exactly at 600/840/1200/1600px, with
   no device-named breakpoints? Pass/fail.
2. Is the pane count within limits (compact 1; medium 1, or 2 for low-density content at 50/50; expanded
   and large 1–2; extra-large 1–3, the third a side sheet ≤ 400px)? Pass/fail.
3. Are window side margins 16px below 600px and 24px from 600px, with a leading rail replacing the leading
   margin? Pass/fail.
4. In two-pane layouts, is the gap between panes 24px, and in split layouts is the spacer's centre at 50%
   of the window (±1px) with and without the rail? Pass/fail.
5. Are fixed panes 360px at expanded and 412px at large and wider, with at least one flexible pane?
   Pass/fail.
6. Do spacing values in custom layouts and components come from the 18-value scale (preferably via
   `--md-sys-measurement-space*`), applied as parent padding and gap? Pass/fail.
7. Is density opt-in, unchanged by breakpoint or orientation, about 4px of height per step, and are all
   targets still at least 48×48px? Pass/fail.
8. Does body text stay within roughly 40–60 characters per line at every width, capped at
   `max-inline-size: 50ch` or an equivalent checked against the real font? Pass/fail.
9. Under `dir="rtl"`, does the whole layout mirror (rail on the right, panes and leading/trailing spacing
   swapped, directional icons flipped) while media controls, clocks and circular progress stay unmirrored?
   Pass/fail.
10. Does selection, scroll position and input survive a live resize, rotation or fold across a breakpoint,
    and does a drag handle (if present) sit in the spacer, work from the keyboard and expose a name and
    value? Pass/fail.

## Sources

- Layout overview: https://m3.material.io/foundations/layout/layout-overview/overview
- Parts of layout: https://m3.material.io/foundations/layout/layout-overview/parts-of-layout
- Adaptive design: https://m3.material.io/foundations/layout/layout-overview/adaptive-design
- Scaffold: https://m3.material.io/foundations/layout/scaffold/overview ,
  https://m3.material.io/foundations/layout/scaffold/bars ,
  https://m3.material.io/foundations/layout/scaffold/rails ,
  https://m3.material.io/foundations/layout/scaffold/panes
- Breakpoints: https://m3.material.io/foundations/layout/breakpoints/overview ,
  https://m3.material.io/foundations/layout/breakpoints/compact ,
  https://m3.material.io/foundations/layout/breakpoints/medium ,
  https://m3.material.io/foundations/layout/breakpoints/expanded ,
  https://m3.material.io/foundations/layout/breakpoints/large-extra-large
- Grids and spacing: https://m3.material.io/foundations/layout/grids-spacing/overview ,
  https://m3.material.io/foundations/layout/grids-spacing/grids ,
  https://m3.material.io/foundations/layout/grids-spacing/spacing ,
  https://m3.material.io/foundations/layout/grids-spacing/density
- Canonical layout examples: https://m3.material.io/foundations/layout/canonical-examples/overview ,
  https://m3.material.io/foundations/layout/canonical-examples/list-detail ,
  https://m3.material.io/foundations/layout/canonical-examples/supporting-pane ,
  https://m3.material.io/foundations/layout/canonical-examples/feed
- Bidirectionality and RTL: https://m3.material.io/foundations/layout/bidirectionality-rtl
- Spacing system: https://m3.material.io/styles/spacing/overview ,
  https://m3.material.io/styles/spacing/applying-spacing , https://m3.material.io/styles/spacing/tokens
- XR layout: https://m3.material.io/foundations/xr/design/layout
- I/O 2026 announcement: https://m3.material.io/blog/whats-new-at-io26
- Density on the web (2020): https://m3.material.io/blog/material-density-web
- Legacy pages (now redirect to the pages above):
  https://m3.material.io/foundations/layout/understanding-layout/overview ,
  https://m3.material.io/foundations/layout/applying-layout/window-size-classes ,
  https://m3.material.io/foundations/layout/applying-layout/pane-layouts
- Android window size classes: https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
- androidx.window releases: https://developer.android.com/jetpack/androidx/releases/window
- Compose Material3 Adaptive releases: https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive
- Material component pages (exact component specs, such as the drag handle's size): https://m3.material.io/components
- androidx source (WindowSizeClass, PaneScaffoldDirective, DragHandleTokens): https://github.com/androidx/androidx
- Viewport Segments API: https://developer.mozilla.org/en-US/docs/Web/API/Viewport_segments_API ,
  https://developer.chrome.com/blog/viewport-segments-api-shipped
- CSS `env()`: https://developer.mozilla.org/en-US/docs/Web/CSS/env
- Window splitter pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- Browser support data: https://github.com/mdn/browser-compat-data
