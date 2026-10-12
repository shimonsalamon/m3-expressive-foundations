# Elevation

Elevation is how far one surface sits above another on the z-axis. It tells people what floats, what
scrolls underneath, and what deserves attention right now. Material 3 shows elevation mainly through
tone, meaning different surface color roles. Shadows are held back for protection over busy
backgrounds and for interactive lift, and scrims dim everything behind a modal surface. M3 Expressive
did not change the six levels or their values. Only the example table of component resting levels
was rewritten to cover the new components.

## Contents

- [Key ideas](#key-ideas)
- [What M3 Expressive changed](#what-m3-expressive-changed)
- [The six levels](#the-six-levels)
- [Resting and interaction levels](#resting-and-interaction-levels)
- [Depicting elevation](#depicting-elevation): tone (default), shadows, scrims, choosing a method
- [Component resting levels (examples only)](#component-resting-levels-examples-only)
- [Surface tint is deprecated](#surface-tint-is-deprecated)
- [Where sources disagree](#where-sources-disagree)
- [Applying it on the web](#applying-it-on-the-web): tone and the scrolled app bar, shadow helpers
  and state changes, transitions, scrims, stacking and z-index, dark theme, forced colors, re-theming,
  Material Web and clipped shapes (drop-shadow helpers)
- [Do and don't](#do-and-dont)
- [Auditing](#auditing)
- [Sources](#sources)

## Key ideas

- **Elevation is a relative distance, not a paint style.** A level token records only how far a
  surface sits above the base plane (in dp, which is px on the web). It carries no shadow and no color.
  Each platform decides how to render a level, so on the web you choose a tone, a shadow, a scrim, or
  a combination.
- **Six levels, and only four of them for resting.** Levels 0 to 3 (0, 1, 3, 6px) are resting
  positions. Levels 4 and 5 (8, 12px) exist only while someone interacts, for example on hover or
  while dragging. A small, fixed set of levels keeps the depth story readable. Each extra level
  weakens the meaning of the others.
- **Tone is the default separator.** Two overlapping containment areas should use different surface
  roles (`surface`, `surface-container-lowest` … `-highest`) so their edges read without any shadow.
  Surface roles describe containment, not height, so pick them by what contains what.
- **Shadows are for two jobs only.** Use them to protect an element on a patterned or busy background,
  where a thin outline or a tonal step gets lost, and to show a temporary lift during interaction.
  Everything else separates by tone. A FAB's resting shadow falls under protection: it floats over
  whatever content scrolls beneath it, and Material's own example shows it poorly separated without one.
- **Scrims focus attention on a modal layer.** Use the `scrim` role at 32% opacity beneath modal
  dialogs, modal sheets and drawers, and expanded navigation.
- **Components have a default resting level. Keep it.** Material asks you to avoid changing default
  elevations, because the levels encode the relationships between components. Change elevation only
  in response to interaction or a system event, and change it the same way on every similar element:
  +1 level on hover is the standard move.
- **Surface tint overlays are gone.** The old technique of tinting `surface` with primary, more at
  each level, is deprecated. Never combine it with the surface-container roles.

## What M3 Expressive changed

| Area | Status | Detail |
|---|---|---|
| Levels 0–5 and their values (0/1/3/6/8/12dp) | Unchanged | The token database last revised the values in 2021. Compose and Material Components for Android ship the same numbers. No elevation page mentions M3 Expressive. |
| Guidance on tone, shadows and scrims | Unchanged by Expressive | The rules below predate May 2025. |
| Component resting-level table (Tokens tab) | Rewritten in the content update of 2025-05-27, the Expressive launch window | Added: toolbar (level 2), FAB menu close button (3), and at level 0 button groups, split button, FAB menu list items, FAB and extended FAB placed in a navigation rail, icon buttons, segmented button and outlined buttons. Dropped: bottom app bar (was 2), lowered FAB and lowered extended FAB (were 1), slider handle (was 1). Names became generic ("App bar (scrolled)" instead of "Top App Bar (Scrolled)"). The page does not say why entries were dropped, so check the component pages. |
| Surface tint deprecation | Earlier, not Expressive | Tone-based surface roles replaced tinted surfaces in February–March 2023. The Tokens-tab sentence calling surface tint deprecated appeared on 2025-04-15. |
| "+1 level on hover" and "avoid changing default elevation" | Earlier, not Expressive | Added in the 2025-01-07 and 2025-04-15 content updates. |
| Legacy "surface tint overlays" section | Removed 2026-06-04 | The applying page carried it from at least 2023. The migration advice is kept [below](#surface-tint-is-deprecated). |

**Material 3 compared with Material 2** (still current on the overview page): M2 painted a shadow at
every level. M3 communicates elevation mostly with color and adds shadows only for protection or
interaction. M3 also introduced new color mappings that work with dynamic color, and it names
elevation by level (0 to +5); each level still has a dp value.

## The six levels

| Level (display name) | Token | CSS custom property | Value | Shadow helpers (web): `box-shadow`, then `filter` | Use |
|---|---|---|---|---|---|
| 0 ("0") | `md.sys.elevation.level0` | `--md-sys-elevation-level0` | `0px` | `--m3e-elevation-shadow-level0`, `--m3e-elevation-drop-shadow-level0` (both `none`) | Resting. Flat content and most controls: filled, tonal and outlined buttons, filled and outlined cards, lists, tabs, the unscrolled app bar. |
| 1 ("+1") | `md.sys.elevation.level1` | `--md-sys-elevation-level1` | `1px` | `--m3e-elevation-shadow-level1`, `--m3e-elevation-drop-shadow-level1` | Resting. Elevated variants (button, card, chips), banner, modal bottom sheet, modal drawer, modal side sheet. |
| 2 ("+2") | `md.sys.elevation.level2` | `--md-sys-elevation-level2` | `3px` | `--m3e-elevation-shadow-level2`, `--m3e-elevation-drop-shadow-level2` | Resting. Scrolled app bar, menu, navigation bar, rich tooltip, toolbar. Also the hover level for elements that rest at 1. |
| 3 ("+3") | `md.sys.elevation.level3` | `--md-sys-elevation-level3` | `6px` | `--m3e-elevation-shadow-level3`, `--m3e-elevation-drop-shadow-level3` | Highest resting level. FAB, extended FAB, modal dialogs, search, date and time pickers. Also the drag level for filled and outlined cards (0 → 3). |
| 4 ("+4") | `md.sys.elevation.level4` | `--md-sys-elevation-level4` | `8px` | `--m3e-elevation-shadow-level4`, `--m3e-elevation-drop-shadow-level4` | Interaction only. Hover on a level-3 element (FAB 3 → 4); drag on an elevated card (1 → 4), a chip or a list item. |
| 5 ("+5") | `md.sys.elevation.level5` | `--md-sys-elevation-level5` | `12px` | `--m3e-elevation-shadow-level5`, `--m3e-elevation-drop-shadow-level5` | Interaction only, reserved for hover and drag like level 4. None of the platform tokens checked use it. Under this skill's drag rule (+3, capped at 5), only an item resting at 2 or 3 reaches it. |

- The "+N" display names count levels above the base surface. The values are distances: a surface at
  1px and one at 8px are 7px apart.
- `--md-sys-elevation-level*` hold distances, not paint. Use them to document or sort layers. Paint
  with a tonal role, a `--m3e-elevation-shadow-level*` helper (`box-shadow`), its
  `--m3e-elevation-drop-shadow-level*` twin (`filter`, for clipped shapes), or `--m3e-scrim`.
- Both shadow helper families are web helpers shipped with this skill, not Material tokens. See
  [Shadows](#shadows) for their source.

## Resting and interaction levels

**Resting.** Material components have a default resting level between 0 and 3. Leave it alone:
the levels encode how components relate (a FAB floats above a card list, a dialog above everything),
and moving one component misstates its relationship to every other. No component rests at 4 or 5.

**Interaction.** Change elevation in response to user input or a system event, never at random, and
apply the same change to every element of the same kind. What the specs and platform tokens actually
do:

| State | Change | Evidence and notes |
|---|---|---|
| Hover | +1 level | Stated rule: all Material buttons rise one level on hover; the FAB goes 3 → 4. Compose filled and tonal buttons go 0 → 1, and Material Web's elevated button and card go 1 → 2. |
| Focus | Usually stays at the resting level | The Tokens tab says hover *or focus* "usually" adds one level, but every platform token set checked keeps focus at rest. Treat a focus lift as optional and never rely on it: the focus ring does that job. |
| Pressed | Stays at the resting level | The states guidance allows buttons and cards to take on elevation when pressed. The platform tokens don't. |
| Dragged | +3 levels, capped at 5; chips and list items go to level 4 | Per the component tokens: filled card 0 → 3, elevated card 1 → 4, and chips and list items at level 4 while dragged (+4 for those that rest at 0). The applying page reserves levels 4 and 5 for hover and drag. |
| Disabled | Usually drops | The states guidance pairs the disabled colors with reduced elevation. Platform tokens differ by component (see [Where sources disagree](#where-sources-disagree)). |
| Scrolled under | Rises to the component's scrolled level | The app bar is 0 at rest and 2 when content scrolls beneath it. |

Other rules:

- An element can lift briefly while focused, selected or swiped, then settle back.
- A raised element may lower when something higher appears, so only one thing claims the top.
- Elements with fixed placement, such as app bars, take no drag state and no drag lift.

## Depicting elevation

A surface only reads as elevated when three things are visible: an edge that contrasts with what
surrounds it, overlap with other surfaces (at rest or while moving), and some sense of distance from
them. M3 offers three ways to show this: tonal difference (the default), shadows, and scrims.

### Tone (default)

Tone shows where one surface ends and the next begins, and suggests the material has a physical edge.
For example, the tonal step at the bottom of a scrolled app bar tells people the grid under it scrolls
on its own. Rules:

- **Overlapping areas get different roles.** Any containment area or component that overlaps another
  must use a different surface role, or the boundary disappears.
- **Roles are not levels.** The surface and surface-container roles are for defining containment areas
  and do not map one-to-one to elevation levels. Choose a role by nesting and emphasis, then check that
  neighbors differ.
- **Edges of interactive surfaces need contrast.** A floating element must stand out clearly from what
  is under it. If the tonal step is too weak for an interactive surface, add an outline or use the
  elevated variant.

| Role | CSS custom property | Light | Dark | Typical elevation pairing (examples, not rules) |
|---|---|---|---|---|
| surface | `--md-sys-color-surface` | `#FEF7FF` | `#141218` | Level 0 page background and flat content |
| surface-dim | `--md-sys-color-surface-dim` | `#DED8E1` | `#141218` | Dimmest base surface. A migration alternative for old +4/+5 tinted surfaces |
| surface-bright | `--md-sys-color-surface-bright` | `#FEF7FF` | `#3B383E` | Brightest base surface (see `color.md`) |
| surface-container-lowest | `--md-sys-color-surface-container-lowest` | `#FFFFFF` | `#0F0D13` | Lowest-emphasis container (added with tone-based surfaces in 2023) |
| surface-container-low | `--md-sys-color-surface-container-low` | `#F7F2FA` | `#1D1B20` | Level 1: elevated button, elevated card |
| surface-container | `--md-sys-color-surface-container` | `#F3EDF7` | `#211F26` | Level 2: top and bottom bars, scrolled app bar |
| surface-container-high | `--md-sys-color-surface-container-high` | `#ECE6F0` | `#2B2930` | Level 3: surface-colored FAB, basic dialog |
| surface-container-highest | `--md-sys-color-surface-container-highest` | `#E6E0E9` | `#36343B` | Highest-emphasis container: input field, switch in the off state |

Values are the baseline scheme and are the same at every contrast level in the shipped file. A
generated brand scheme may shift them. Notice that the direction flips between themes: in light theme
the higher containers get darker than `surface`, in dark theme they get lighter. In both themes,
`-high` and `-highest` stand out most from `surface`. Full color-role guidance is in `color.md`.

### Shadows

Shadows show the *amount* of separation in a way tone cannot. A small, crisp shadow puts a surface
close to what is below it, and a larger, softer one puts it farther away. That power is the reason to
use them sparingly. The fewer levels a UI uses, the more each one directs attention and action.

Use a visible shadow when:

1. **The background is busy.** On a photo, map, pattern or other noisy background, a thin outline or a
   tonal step does not separate an element well enough. Give cards, chips or buttons there their
   elevated treatment.
2. **You want to invite interaction.** A short-lived lift on focus, selection, drag or swipe shows the
   element is responding and can be moved or acted on.

The shipped helpers use Material Web's two-layer recipe: a tight *key* shadow at 30% of the shadow
color plus a wider *ambient* shadow at 15%. They are an implementation choice, not Material tokens.
Native Android renders shadows from a dp value, so its shadows won't match these pixel for pixel.

| Helper | Key layer (x y blur spread) at 30% | Ambient layer at 15% |
|---|---|---|
| `--m3e-elevation-shadow-level0` | none | none |
| `--m3e-elevation-shadow-level1` | `0 1px 2px 0` | `0 1px 3px 1px` |
| `--m3e-elevation-shadow-level2` | `0 1px 2px 0` | `0 2px 6px 2px` |
| `--m3e-elevation-shadow-level3` | `0 1px 3px 0` | `0 4px 8px 3px` |
| `--m3e-elevation-shadow-level4` | `0 2px 3px 0` | `0 6px 10px 4px` |
| `--m3e-elevation-shadow-level5` | `0 4px 4px 0` | `0 8px 12px 6px` |

Both layers take their color from `--md-sys-color-shadow` (`#000000` in both themes, at every
contrast level) through `color-mix(in srgb, var(--md-sys-color-shadow) 30%|15%, transparent)`.

Each level also has a `filter` form, `--m3e-elevation-drop-shadow-level0` to `-level5`: the same key
and ambient layers written as two `drop-shadow()` functions (`none` at level 0). Use it where
`clip-path` or a mask gives the element its outline, since a clip cuts `box-shadow` away (see
[section 9](#9-material-web-and-clipped-shapes)). `drop-shadow()` accepts no spread value, so the
ambient layer comes out slightly tighter than in the `box-shadow` form. It still counts as the same
level.

"Elevated" component variants combine both methods: Material Web's elevated button and elevated card
use a `surface-container-low` fill *and* a level-1 shadow.

### Scrims

A scrim is a translucent layer that dims everything behind a modal surface. It raises contrast
between the layer that needs attention and the rest of the UI.

| Role or helper | CSS custom property | Value | Use |
|---|---|---|---|
| `md.sys.color.scrim` | `--md-sys-color-scrim` | `#000000` (both themes, all contrasts) | The scrim color. Never use it at full strength. |
| Scrim opacity (helper) | `--m3e-scrim-opacity` | `0.32` | For an element filled with the scrim color whose `opacity` you animate. |
| Ready-made scrim (helper) | `--m3e-scrim` | `color-mix(in srgb, var(--md-sys-color-scrim) 32%, transparent)` | A background value, for example on `::backdrop`. |

- Put a scrim behind modal dialogs, modal bottom and side sheets, modal navigation drawers and
  expanded navigation menus.
- Behind a floating pane on a large screen the scrim is optional. Skip it when the content behind
  should stay readable.
- The 32% is guidance text plus a Compose component token (`ScrimTokens.ContainerOpacity = 0.32`).
  No web system token exists for it, which is why the skill ships `--m3e-scrim-opacity` as a helper.
- **Not in a see-through window.** A desktop pop-up drawn as a card on a transparent window (an Electron
  notification card, a widget) has nothing of its own behind the card: a scrim there dims the window's
  transparent margin and shows as a dark box around the card. Open dialogs in such a window without a
  scrim and let them cover the card, or grow the window to fit them.

### Choosing a method

| Situation | Method | Why |
|---|---|---|
| Cards, bars, panes and sheets on a plain background | Tone: a different surface-container role from the parent | Default M3 separation. Adds no visual noise and works in both themes. |
| Element over a photo, map or pattern | Elevated variant: tonal fill plus a shadow helper, usually level 1 | Tone alone blends into a busy background. |
| Hover, drag or a temporary lift | Step the shadow helper up: +1 for hover; for drag +3 (capped at 5), or level 4 for chips and list items | Lift is a sign that the element responds. |
| Floating element at rest (FAB, menu, extended FAB) | Its component's resting level: tone plus the matching shadow | Floating elements overlap scrolling content, so the edge must survive any background. |
| Modal layer (dialog, modal sheet, drawer) | Scrim behind it; the surface itself uses a container role | Raises contrast between the modal layer and everything behind it. |
| App bar with content scrolling under it | Swap to a higher surface-container role, no shadow | The tonal step marks the independent scroll. |

## Component resting levels (examples only)

This table comes from the current Tokens tab, which has not changed since its 2025-05-27 rewrite
apart from capitalization. It illustrates the foundation. Component specs may change, so check a
component's own page before relying on a number. A component level places the component relative to
others. It does not by itself mean a visible shadow: a navigation bar at level 2 is painted with tone.

| Level | Components |
|---|---|
| 3 (6px) | Date pickers, modal dialogs, extended FAB, FAB, FAB menu close button, search, time pickers |
| 2 (3px) | App bar (scrolled), menu, navigation bar, rich tooltip, toolbar |
| 1 (1px) | Banner, modal bottom sheet, elevated button, elevated card, elevated chips, modal navigation drawer, modal side sheet |
| 0 (0px) | App bar (not scrolled), filled/tonal/outlined buttons, button groups, filled and outlined cards, carousel, chips, full-screen dialog, FAB and extended FAB in a navigation rail, FAB menu list items, icon buttons, list, navigation rail, segmented button, docked side sheet, slider, split button, tabs |
| 4, 5 | Not a resting level for any component |

## Surface tint is deprecated

**History.** From its 2021 launch until early 2023, M3 showed elevation by laying a primary-colored
tint over `surface`, stronger at each level. In February–March 2023 Material replaced that with the
tone-based surface-container roles. The token database now marks `md.sys.color.surface-tint` as
deprecated because its job moved to the tonal surface colors, and the older aliases
(`md.sys.elevation.surface-tint-color`, `md.sys.color.surface-tint-color`) are deprecated too. The
Tokens tab adds that you should use the level tokens instead. Read together, the level tokens describe
position and the container roles describe fill. Until the applying page dropped its legacy section in
June 2026, it stated that Material no longer supports the overlays and that they must not be combined
with the new roles.

**In the shipped file.** `--md-sys-color-surface-tint` still exists as an alias of
`--md-sys-color-primary` (`#6750A4` light / `#D0BCFF` dark at standard contrast) so old code keeps
working. Don't use it in new work. The two deprecated aliases are not exported.

**Migration.** Replace each tinted surface with a container role:

| Legacy surface | Replacement role | CSS custom property |
|---|---|---|
| (none, new role) | surface-container-lowest | `--md-sys-color-surface-container-lowest` |
| Surface at +1 | surface-container-low | `--md-sys-color-surface-container-low` |
| Surface at +2 | surface-container | `--md-sys-color-surface-container` |
| Surface at +3 | surface-container-high | `--md-sys-color-surface-container-high` |
| Surface at +4 or +5 (deprecated) | surface-container-highest by default; surface-container-high or surface-dim when the context suits them better | `--md-sys-color-surface-container-highest` |
| surface-variant used as a container | surface-container-highest | `--md-sys-color-surface-container-highest` |

**Recognizing legacy code.** Compose's `surfaceColorAtElevation` mixes `surfaceTint` into `surface` at
alpha = (4.5 × ln(dp + 1) + 2) / 100, which works out to 5.12% (level 1), 8.24% (2), 10.76% (3),
11.89% (4) and 13.54% (5). CSS that mixes primary into surface at about 5, 8, 11, 12 or 14% is a
port of this. Replace it with the table above. Compose still applies it automatically when a container
color equals `surface` and `LocalTonalElevationEnabled` is true, and the Android developers "Material
Design 3 in Compose" page still describes elevation as tonal overlays. Both lag behind
m3.material.io, so don't copy them into web work.

## Where sources disagree

- **Focus and press lift.** The Tokens tab says hover or focus usually adds a level, and the states page
  allows a pressed lift. Every platform token set checked leaves focus and press at the resting level.
  This skill's default: +1 on hover, with focus and press staying at rest.
- **Disabled level.** The states page ties disabled to reduced elevation. Material Web's elevated button
  drops 1 → 0, but its elevated card stays at 1. Skill default: follow the component spec; a custom
  elevated surface drops to level 0 when disabled.
- **Dragged level.** The applying page reserves levels 4–5 for hover and drag, yet Compose lifts a
  dragged filled card 0 → 3. Cards on both platforms add three levels (Compose filled card 0 → 3,
  Material Web elevated card 1 → 4), while the chip and list-item tokens name level 4 as the dragged
  level, which is +4 for the flat ones. Skill rule: dragged elements rise 3 levels, capped at 5; chips
  and list items go to level 4 per their component tokens.
- **Level index vs distance on the web.** The token database, Compose and Android use distances
  (0/1/3/6/8/12). Material Web overrides its system tokens to the level *index* 0–5 for its shadow
  formula. The shipped file follows the token database (px).
- **Shadow recipe.** The two-layer shadow comes from Material Web, which is in maintenance mode, and is
  not a Material token or page text. Whether the Figma kit uses the same layers could not be verified.
- **Page slips.** The applying page's hero image alt text says five levels (the text says six). An
  overview image alt says the FAB goes 5dp → 8dp (level 3 is 6dp). The overview says "all"
  components have a default elevation, while the Tokens tab says "most". Trust the text and the tokens.

## Applying it on the web

Load `assets/m3-expressive-tokens.css` first. All snippets use its custom properties.

### 1. Separate by tone first

Nest surfaces so each overlapping area uses a different role, and pick roles whose tone step is large
enough to see. Here, a list pane on `surface` holds cards on `surface-container-highest` (the role
Material's filled cards use: 1.23:1 against `surface` in light, 1.52:1 in dark), and a side panel sits on
`surface-container`. No shadows are needed. `surface-container-low` would sit only 1.05:1 from `surface`
in light, too faint to read as an edge without an outline.

```css
body {
  background: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
}
.card {
  background: var(--md-sys-color-surface-container-highest);
  border-radius: var(--md-sys-shape-corner-medium);
}
.side-panel {
  background: var(--md-sys-color-surface-container);
  border-radius: var(--md-sys-shape-corner-large);
}
/* A nested area inside the panel must differ from the panel itself. */
.side-panel .field {
  background: var(--md-sys-color-surface-container-highest);
}
```

An app bar that sits flat at rest and rises to level 2 (tone only) when content scrolls under it.
Watch the element that actually scrolls. In a pane layout that is the pane, and the window never
scrolls, so `window.scrollY` stays at 0 and a scroll listener on `window` never fires. Put a
zero-height sentinel at the very top of the scroller and observe it with an `IntersectionObserver`
whose `root` is the scroller: the sentinel leaves the scroller's box as soon as the content moves, and
no scroll handler runs on every frame. The same code covers a page where the document scrolls
(`root: null`).

```html
<main class="pane">
  <div class="scroll-sentinel" aria-hidden="true"></div>
  <header class="app-bar">…</header>
  …content…
</main>
```

```css
.pane {
  position: relative; /* containing block for the sentinel */
  overflow-y: auto;
}
.scroll-sentinel {
  position: absolute; /* zero height, at the top of the scrolled content, above any padding */
  inset-block-start: 0;
  inset-inline: 0;
}
.app-bar {
  position: sticky;
  inset-block-start: 0;
  background-color: var(--md-sys-color-surface);
  transition: background-color var(--m3e-motion-spring-default-effects);
}
.app-bar[data-scrolled] {
  background-color: var(--md-sys-color-surface-container);
}
```

```js
// scroller: the element that scrolls, or null when the document scrolls.
function watchScrolled(bar, scroller) {
  const sentinel = (scroller ?? document.body).querySelector(':scope > .scroll-sentinel');
  const observer = new IntersectionObserver(
    ([entry]) => bar.toggleAttribute('data-scrolled', !entry.isIntersecting),
    { root: scroller },
  );
  observer.observe(sentinel);
  return observer; // call disconnect() when the bar goes away
}
const pane = document.querySelector('.pane');
watchScrolled(pane.querySelector(':scope > .app-bar'), pane);
```

- A bar inside a pane follows its own pane. A bar that spans several panes has to know which pane
  scrolled; [layout.md](layout.md#scaffold-and-safety-regions) gives that version.
- The bar needs a different role from whatever scrolls under it. On a screen whose scrolling region is
  itself `surface-container` (a grouped settings list, for example), `surface-container` is no step at
  all; the grouped list screen recipe in [color.md](color.md) gives the roles for that case.

### 2. Shadows with the helpers

Use a helper for every shadow. Never write ad-hoc shadow sizes, because each one invents a level
that doesn't exist. The same goes for a zero-blur `box-shadow` used to paint a surface's background
past its edge (for example below a sheet whose spring overshoots): draw that extension with an
`::after` block or extra padding in the surface color, as motion.md's
[sheet example](motion.md#2-component-transitions-with-the-shorthands) does, so that every
`box-shadow` in the product is one of the six levels.

The example below is an elevated card over a busy background: tone plus a level-1 shadow, +1 on
hover, and +3 while dragged (1 → 4).

```css
.elevated-card {
  background: var(--md-sys-color-surface-container-low);
  border-radius: var(--md-sys-shape-corner-medium);
  box-shadow: var(--m3e-elevation-shadow-level1);
  transition: box-shadow var(--m3e-motion-spring-fast-effects);
}
/* Hover lift only where a real pointer can hover, so touch taps don't leave it stuck raised;
   the :where() guard keeps a disabled card flat. */
@media (hover: hover) {
  .elevated-card:where(:not([aria-disabled="true"])):hover {
    box-shadow: var(--m3e-elevation-shadow-level2);
  }
}
/* Declared after the hover rule, with equal specificity, so dragging wins over hover. */
.elevated-card[data-dragging] {
  box-shadow: var(--m3e-elevation-shadow-level4);
}
```

A disabled elevated button drops to level 0 along with its disabled colors (see
`interaction-states.md`). `:hover` still matches a disabled button, so guard the hover rule and
declare the disabled rule after it.

```css
.elevated-button {
  background: var(--md-sys-color-surface-container-low);
  color: var(--md-sys-color-primary);
  border-radius: var(--md-sys-shape-corner-full);
  box-shadow: var(--m3e-elevation-shadow-level1);
  transition: box-shadow var(--m3e-motion-spring-fast-effects);
}
@media (hover: hover) {
  .elevated-button:where(:not(:disabled, [aria-disabled="true"])):hover {
    box-shadow: var(--m3e-elevation-shadow-level2);
  }
}
.elevated-button:is(:disabled, [aria-disabled="true"]) {
  box-shadow: var(--m3e-elevation-shadow-level0);
}
```

The same pattern for a FAB, which rests at 3 and hovers at 4. Focus and press keep level 3, and the
focus ring shows focus.

```css
.fab {
  background: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-radius: var(--md-sys-shape-corner-large);
  box-shadow: var(--m3e-elevation-shadow-level3);
  transition: box-shadow var(--m3e-motion-spring-fast-effects);
}
@media (hover: hover) {
  .fab:where(:not(:disabled, [aria-disabled="true"])):hover {
    box-shadow: var(--m3e-elevation-shadow-level4);
  }
}
.fab:focus-visible {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}
```

A hovered element also gets its state layer, which is separate from elevation (see
`interaction-states.md`).

### 3. Transitions

Material defines no motion token specifically for elevation, and the platforms use short tweens:

- Compose animates into an interaction state's elevation in 120ms with `cubic-bezier(0.4, 0, 0.2, 1)`
  and back out in 150ms with `cubic-bezier(0.4, 0, 0.6, 1)` (120ms when the state being left is hover).
- Material Web buttons and FABs use 280ms with `cubic-bezier(0.2, 0, 0, 1)`, marked in the source as a
  placeholder until motion tokens exist.

Skill default (our choice, not Material text): transition `box-shadow` (or `filter`, when a
drop-shadow helper carries the shadow) with `--m3e-motion-spring-fast-effects` (150ms
`cubic-bezier(0.31, 0.94, 0.34, 1)`). A shadow change alters
neither shape nor bounds, so it counts as an effect. Effects springs never overshoot, and 150ms sits
inside the 120–280ms range the platforms use. Use `--m3e-motion-spring-default-effects` for tonal
background changes on larger surfaces, such as the app bar above. Under reduced motion the effects
helpers keep their curves, which is right for a fade-like change.

- `box-shadow` interpolates between `none` and a two-layer list. The browser pads `none` with
  transparent zero-size shadows, so level 0 needs no special value.
- Show lift with the shadow step only. Don't add `translateY` or `scale` to fake height (our rule): a
  translate reads as travel, not lift. Material's Android-style transitions avoid scale and z-axis
  motion for a related reason, since they imply an elevation change the reduced M3 model doesn't use.
  See `motion.md` for enter and exit patterns.
- `box-shadow` repaints on every frame. That is fine for a handful of elements. For large grids where
  profiling shows paint cost, cross-fade the `opacity` of two pseudo-elements that carry the two
  levels' shadows (`inset: 0; border-radius: inherit`).

### 4. Scrims

For a modal `<dialog>`, style the built-in `::backdrop`:

```html
<dialog id="confirm" class="dialog">…</dialog>
<script>document.getElementById('confirm').showModal();</script>
```

```css
.dialog {
  background: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface);
  border: 1px solid transparent; /* shows only in forced colors, see section 7 */
  border-radius: var(--md-sys-shape-corner-extra-large);
}
/* ::backdrop inherits custom properties from its dialog in Chrome 122+, Firefox 120+ and
   Safari 17.4+. */
.dialog::backdrop {
  background: var(--m3e-scrim);
}
```

Older engines don't pass custom properties to `::backdrop`, so the variable is undefined there and
the page behind the dialog isn't dimmed. If you still support them, add the scrim's literal value as a
`var()` fallback and record it as a known exception to the literal-color check (COL-01).

Prefer a `<dialog>` opened with `showModal()` for modal drawers and sheets too, so the browser supplies
the top layer, `::backdrop` and inertness. When a custom scrim is unavoidable, animate `opacity` up to
`--m3e-scrim-opacity` and give it a z-index above every in-flow layer (see section 5):

```css
.scrim {
  position: fixed;
  inset: 0;
  background: var(--md-sys-color-scrim);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--m3e-motion-spring-default-effects);
}
.scrim[data-open] {
  opacity: var(--m3e-scrim-opacity);
  pointer-events: auto;
}
```

A scrim that blocks the page should also make the page inert (`showModal()` does that for you; for a
custom drawer, set the `inert` attribute on the content behind it) and close the layer when clicked.

### 5. Stacking and z-index

Elevation tokens say nothing about stacking order, and a shadow does not put an element on top. What
follows is our guidance, not Material text:

- Modal dialogs (`showModal()`) and popovers render in the browser's *top layer*, above every
  `z-index`. Use them for dialogs, menus and tooltips instead of competing z-index values.
- For in-flow overlap only (a sticky app bar over scrolling content, a FAB over a list, a dragged card
  over its siblings, a custom scrim and drawer), keep a short, named ladder. Order it by what must
  cover what. That mostly follows resting levels, with one exception: a dragged item (level 4 in the
  card example above) only needs to clear its siblings, so it stays under the app bar it scrolls
  beneath.

```css
:root {
  --app-z-raised: 1;   /* dragged item, above its siblings only */
  --app-z-sticky: 2;   /* app bar, navigation bar */
  --app-z-floating: 3; /* FAB, floating toolbar */
  --app-z-scrim: 4;    /* custom scrim, when a modal <dialog> is not an option */
  --app-z-modal: 5;    /* custom modal drawer or sheet above its scrim */
}
.app-bar {
  z-index: var(--app-z-sticky);
}
.fab {
  position: fixed;
  z-index: var(--app-z-floating);
}
.elevated-card[data-dragging] {
  position: relative;
  z-index: var(--app-z-raised);
}
.scrim {
  z-index: var(--app-z-scrim);
}
.drawer {
  position: fixed;
  z-index: var(--app-z-modal);
}
```

### 6. Dark theme

The shipped file switches themes by `data-theme` or the OS setting. Elevation needs no extra code, but
design for it:

- Tone carries separation in dark theme. The container roles get lighter as emphasis rises (`#141218`
  surface up to `#36343B` for highest), which is what makes stacked surfaces readable.
- The shadow color stays `#000000` in dark theme. A black shadow on a near-black surface shows little
  (our observation, not Material text), so never let a shadow be the only thing separating two
  surfaces in dark theme. Pair it with a container role, as the elevated variants do.
- Test every elevated element in both themes. A card that separates by shadow alone in light theme
  can disappear in dark theme.

### 7. Forced colors (Windows High Contrast)

This is web platform behavior, not Material guidance. With `forced-colors: active` the browser sets
`box-shadow` to `none` and replaces author background colors with system colors. Tonal steps and
shadows both vanish, so floating surfaces lose their edges. Give each floating or overlapping surface
a transparent border. It stays invisible normally, and forced-colors mode paints it in a system color:

```css
.elevated-card,
.elevated-button,
.fab,
.dialog,
.drawer,
.menu {
  border: 1px solid transparent;
}
/* Or draw the edge only in forced-colors mode, when a border would disturb the layout. */
@media (forced-colors: active) {
  .side-panel {
    outline: 1px solid CanvasText;
  }
}
```

The forced background color keeps the author's alpha (CSS Color Adjustment spec), and `opacity` is not
forced, so a scrim still shows as a translucent system color. The modal surface in front of it still
needs its own border. Don't set `forced-color-adjust: none` just to keep shadows. It overrides the
user's chosen palette.

### 8. Re-theming the shadow color on a subtree

Both shadow helper families, `--m3e-elevation-shadow-level*` and
`--m3e-elevation-drop-shadow-level*`, are declared on `:root`, so their `var(--md-sys-color-shadow)`
resolves there and descendants inherit the finished value. If a subtree overrides
`--md-sys-color-shadow`, redeclare every helper of either family that the subtree uses, on the same
element (the same selector). Overriding the color alone changes nothing. The override itself belongs
in the subtree's scheme; the redeclarations copy the helpers' values from the token file unchanged.

```css
/* .brand-zone's own scheme sets --md-sys-color-shadow; rebuild the helpers the zone uses. */
.brand-zone {
  --m3e-elevation-shadow-level1: 0 1px 2px 0 color-mix(in srgb, var(--md-sys-color-shadow) 30%, transparent), 0 1px 3px 1px color-mix(in srgb, var(--md-sys-color-shadow) 15%, transparent);
  --m3e-elevation-shadow-level2: 0 1px 2px 0 color-mix(in srgb, var(--md-sys-color-shadow) 30%, transparent), 0 2px 6px 2px color-mix(in srgb, var(--md-sys-color-shadow) 15%, transparent);
  --m3e-elevation-drop-shadow-level1: drop-shadow(0 1px 2px color-mix(in srgb, var(--md-sys-color-shadow) 30%, transparent)) drop-shadow(0 1px 3px color-mix(in srgb, var(--md-sys-color-shadow) 15%, transparent));
}
```

The same applies to `--m3e-scrim` if you override `--md-sys-color-scrim` below `:root`, and to
`--m3e-focus-indicator-color` if the subtree changes `--md-sys-color-secondary`.

### 9. Material Web and clipped shapes

- Material Web's `<md-elevation>` takes `--md-elevation-level` as a level *index* (0–5). Never pass
  `--md-sys-elevation-level*` (px distances) to it. To match its look on your own elements, use the
  `--m3e-elevation-shadow-level*` helpers, which use the same recipe.
- `clip-path` and masks cut off `box-shadow`. For a shape-library element, put
  `filter: var(--m3e-elevation-drop-shadow-levelN)` on an unclipped parent; the filter traces the
  clipped outline of its children (full pattern in [shape.md](shape.md#clipping-caveats)). These
  helpers hold the same two layers as the `box-shadow` helpers, minus the spread that `drop-shadow()`
  can't express, so use the level you would have used for a box shadow. Don't hand-write
  `drop-shadow()` values: a hand-built chain drifts from the levels just as an ad-hoc `box-shadow`
  does.
- A `filter` other than `none` starts a stacking context and becomes the containing block for
  fixed-position descendants, so keep fixed children (a menu, a snackbar) outside the filtered parent,
  or render them in the top layer.

```css
/* A clipped FAB-like shape: level 3 at rest, level 4 on hover. */
.shape-fab {
  filter: var(--m3e-elevation-drop-shadow-level3);
  transition: filter var(--m3e-motion-spring-fast-effects);
}
@media (hover: hover) {
  .shape-fab:where(:not(:disabled, [aria-disabled="true"])):hover {
    filter: var(--m3e-elevation-drop-shadow-level4);
  }
}
```

## Do and don't

| Do | Don't | Why |
|---|---|---|
| Separate overlapping areas with different surface-container roles. | Give every card and bar a shadow. | Tone is the M3 default. Shadows everywhere flatten the hierarchy and add noise. |
| Use one of the six levels, painted with a `--m3e-elevation-shadow-level*` helper, or with its `--m3e-elevation-drop-shadow-level*` twin on a clipped shape. | Write custom `box-shadow` or `drop-shadow()` sizes, or extend a background with a zero-blur `box-shadow`. | Ad-hoc shadows imply levels that don't exist and drift across the product. A background extension belongs in an `::after` block or padding, where it can't be mistaken for a level. |
| Keep resting levels at 0–3. | Rest anything at level 4 or 5. | Those levels signal interaction. Using them at rest leaves nothing higher for a lift. |
| Keep each component's default resting level. | Raise a component to make it "pop". | Levels encode relationships. Use color, size or position for emphasis. |
| Lift +1 on hover, the same way on every similar element. | Lift some cards and not others, or jump several levels on hover. | Inconsistent lift reads as a bug and breaks the depth model. |
| Add a shadow over photos, maps and patterns, or during interactive lift. | Rely on tone or a hairline outline over a busy image. | Thin edges and subtle tones get lost in visual noise. |
| Use the `scrim` role at 32% behind modal layers. | Use a solid or opaque scrim, or a colored one. | The dimmed page must stay recognizable. Black at 32% dims without hiding it. |
| Migrate tinted surfaces to container roles. | Use `surface-tint`, or mix primary into surfaces by level. | The overlays are deprecated and clash with the container roles. |
| Transition `box-shadow` (or a drop-shadow `filter`) with an effects helper. | Use a spatial (bouncy) spring, or add `translateY` or `scale` for lift. | A shadow change alters neither shape nor bounds, which is what effects springs are for. A translate or scale reads as travel, not lift. |
| Give floating surfaces a transparent border for forced colors. | Assume shadows or tones survive High Contrast. | Forced colors removes both and leaves surfaces edgeless. |
| Pair shadows with tone in dark theme. | Separate dark surfaces with a black shadow alone. | Black on near-black barely shows. |

## Auditing

Each check passes or fails. The consolidated list is in `references/audit-checklist.md`.

1. **Levels only**: every computed `box-shadow` on the page is `none` or equals the computed value of a
   probe element styled with one of the six `--m3e-elevation-shadow-level*` helpers (Chromium
   serializes level 1 as `color(srgb 0 0 0 / 0.3) 0px 1px 2px 0px, color(srgb 0 0 0 / 0.15) 0px 1px
   3px 1px`). Grep component CSS for `box-shadow:` values that don't use a helper; a zero-blur
   `box-shadow` that extends a background fails too. A clipped shape may carry its level as
   `filter: var(--m3e-elevation-drop-shadow-levelN)` instead (section 9 of "Applying it on the web"),
   and a hand-written `drop-shadow()` chain passes only if it equals a level's two layers exactly (the
   audit checklist's SHP-13); any other chain fails like an ad-hoc `box-shadow`.
2. **Resting range**: with no pointer over the page and nothing being dragged, no element shows the
   level-4 or level-5 shadow.
3. **Tone separates**: every pair of overlapping containment areas (card on pane, panel on page, field
   in panel) resolves to different background colors. Compare `getComputedStyle(el).backgroundColor`
   of each surface with its nearest painted ancestor. A scrolled app bar changes role when its own
   scroll container scrolls (scroll the pane, not only the window) and then differs from the region
   under it.
4. **Shadows are justified**: each element with a resting shadow is a floating component (FAB, menu,
   dialog, extended FAB), an elevated variant, or sits over an image, map or pattern. Plain cards and
   bars on plain backgrounds have none.
5. **Consistent hover lift**: hovering any element of a type raises its shadow exactly one level, and
   all elements of that type behave the same. Focus and press keep the resting level unless the
   product documents otherwise. The lift sits inside `@media (hover: hover)` and skips disabled
   elements. A dragged item rises three levels, capped at 5; chips and list items go to level 4.
6. **Scrim**: every modal layer has a scrim whose computed background is black at alpha 0.32 (Chromium:
   `color(srgb 0 0 0 / 0.32)`), or `#000000` with `opacity: 0.32`. It sits directly behind the modal
   layer and no other tint is layered on it.
7. **No surface tint**: grep finds no `--md-sys-color-surface-tint`, no `surfaceColorAtElevation`
   port, and no primary mixed into surface colors by level.
8. **Dark theme**: with `data-theme="dark"`, every elevated element still separates from its
   background by tone. Temporarily setting `--m3e-elevation-shadow-level1` … `level5` and
   `--m3e-elevation-drop-shadow-level1` … `level5` to `none` must not make any surface disappear.
9. **Forced colors**: in Chrome DevTools, Rendering → "Emulate CSS media feature forced-colors:
   active". Dialogs, menus, FABs and elevated cards still show an edge.
10. **Motion**: elevation changes transition `box-shadow` (or a tonal background, or `filter` on a
    clipped shape) with an effects curve, and don't move or scale the element.

## Sources

- Material Design 3, Elevation overview: https://m3.material.io/styles/elevation/overview
- Material Design 3, Applying elevation: https://m3.material.io/styles/elevation/applying-elevation
- Material Design 3, Elevation tokens: https://m3.material.io/styles/elevation/tokens
- Material Design 3 blog, Introducing tone-based surfaces in Material 3 (March 2023):
  https://m3.material.io/blog/tone-based-surface-color-m3
- Material Design 3, Color system overview (change log): https://m3.material.io/styles/color/system/overview
- Material Design 3, Color roles: https://m3.material.io/styles/color/roles
- Material Design 3, Applying states: https://m3.material.io/foundations/interaction/states/applying-states
- Material Design 3, Panes: https://m3.material.io/foundations/layout/scaffold/panes
- Material Design 3, Transition patterns: https://m3.material.io/styles/motion/transitions/transition-patterns
- Internet Archive captures of the elevation pages (content history): https://web.archive.org/web/*/m3.material.io/styles/elevation*
- Material Web elevation docs and source:
  https://github.com/material-components/material-web/blob/main/docs/components/elevation.md,
  https://github.com/material-components/material-web/blob/main/elevation/internal/_elevation.scss,
  https://github.com/material-components/material-web/blob/main/tokens/_md-sys-elevation.scss
- Material Web README (maintenance mode): https://github.com/material-components/material-web
- AndroidX Compose Material 3 source (`ElevationTokens`, `Elevation.kt`, `ScrimTokens`,
  `ColorScheme.kt`, component tokens): https://github.com/androidx/androidx
- Material Components for Android: https://github.com/material-components/material-components-android
- Android Developers, Material Design 3 in Compose:
  https://developer.android.com/develop/ui/compose/designsystems/material3
- Microsoft Edge blog, Styling for Windows high contrast with forced colors:
  https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/
- MDN, `forced-colors`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
- CSS Color Adjustment Level 1 (forced colors): https://drafts.csswg.org/css-color-adjust-1/
- CSS Backgrounds and Borders Level 3 (`box-shadow` interpolation): https://drafts.csswg.org/css-backgrounds-3/
- MDN, `::backdrop`: https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop
- MDN, Top layer: https://developer.mozilla.org/en-US/docs/Glossary/Top_layer
