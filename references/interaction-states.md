# Interaction states

States are the feedback a UI gives while someone uses it: what can be acted on, where keyboard input
will land, that a press registered, what is being carried, and what is unavailable. Material expresses
them with one mechanism, a translucent layer tinted with the content color, plus a focus ring, elevation
changes and a few selection cues. M3 Expressive did not rewrite this foundation. The six states, the layer
model and the opacities are the same as before the May 2025 launch. What Expressive adds is a practice in
its components: state is also shown by corners that morph on press and selection, driven by springs.

## Contents

- [Key ideas](#key-ideas)
- [What M3 Expressive changed](#what-m3-expressive-changed)
- [The six states](#the-six-states)
- [State layers](#state-layers): color, order, opacities, size
- [Which elements take which states](#which-elements-take-which-states)
- [Disabled](#disabled): content 38%, container 10-12%, and why the tokens disagree
- [Focus indicator](#focus-indicator): ring geometry, color, keyboard only, focus order
- [Combining states](#combining-states)
- [Press, ripple, drag and elevation](#press-ripple-drag-and-elevation)
- [Selection](#selection): indicators, active indicators, touch and desktop patterns, semantics
- [Expressing state with shape and springs](#expressing-state-with-shape-and-springs)
- [Touch targets](#touch-targets)
- [Applying it on the web](#applying-it-on-the-web): state layer, focus ring, ripple, disabled, drag and
  elevation, selection and morph, targets, nesting, forced colors, JS helpers, native inputs, browser notes
- [Do and don't](#do-and-dont)
- [Auditing](#auditing)
- [Sources](#sources)

## Key ideas

- **A state is a message.** Hover says "you can act on this", focus says "keys go here", pressed says "got
  it", dragged says "you are holding this", disabled says "not now". If a change on screen doesn't carry
  one of those messages, it isn't a state treatment.
- **One mechanism covers most states.** A state layer is a sheet of the content ("on") color, laid between
  the container and its content at a fixed opacity. Because the tint comes from the content color, it
  works on every container, in light and dark themes and at every contrast level, with no extra color
  roles.
- **Four fixed opacities.** Hover 8%, focus 10%, pressed 10%, dragged 16%. Only one layer shows at a
  time, so an element that is hovered and focused shows one tint, not two stacked.
- **Focus needs a ring, not just a tint.** A 10% tint is too faint to find by keyboard. Material pairs it
  with a ring (3px in the tokens, colored secondary in Compose and Material Web), shown only for
  keyboard-style focus.
- **Disabled is the absence of states.** Dim the content to 38%, dim or drop the container, flatten the
  elevation, and give no hover, focus, press or drag feedback at all.
- **Actionable things take states; containers don't.** App bars, navigation bars, sheets and dialogs do not
  light up as a whole. The buttons and items inside them do.
- **Never let one channel carry a state alone.** The states overview says states carry two visual
  indicators for accessibility and doesn't elaborate. Our reading: pair the tint or color with a ring,
  elevation, icon, shape or label, and expose the state to assistive tech.
- **Expressive adds shape and motion as a second channel.** Round buttons get less round when pressed;
  toggles swap between round and square when selected. A corner change is spatial motion, so press and
  selection morphs run on spatial springs (fast spatial on small and medium controls). Tints and color
  changes run on effects springs, which never overshoot.

## What M3 Expressive changed

| Change | Status | Detail |
|---|---|---|
| Six states, state-layer model, four overlay opacities | Unchanged | The states and selection pages carry no Expressive note. On launch day (content update 2025-05-13) the only change to the states pages was a new "State opacities" token table on the state-layers page. The Selection page is unchanged since 2024-12-18. |
| `md.sys.state.disabled.state-layer-opacity` = 0.38 | New, after launch | Created in the token database on 2025-11-13. MDC-Android ships it from token version 31.0.0 (January 2026). Compose's `StateTokens` does not have it yet. |
| Focus-indicator tokens (thickness 3, outer offset 2, inner offset -3) | Not new | The token set dates from 2023-10-19. The states pages never mention it; only Material Web's 2026 experimental "labs" CSS consumes it. |
| Focus and pressed layers 12% → 10% | Pre-Expressive | Changed 2023-09-20 to improve contrast on tonal surfaces. Stable Material Web components still ship 0.12 for both. |
| "Activated" state and the "38% of enabled" disabled rule | Removed from the page before Expressive | Both were hidden or deleted by the 2025-02-19 content update. Navigation now uses the Selection page's "active indicator" language. |
| Disabled container 12% → 10% | Component level, Expressive era | Compose button tokens (generator v0_11_0), filled/tonal icon buttons (14_1_0) and Material Web labs components use on-surface at 10%; older components used 12%. |
| State shown through shape morph and springs | New component practice | Button groups morph when pressed and selected; round buttons get less round on press; toggles change shape when selected. Material presents this through components and the usability pages, not as a states-page rule. |

## The six states

| State | What it tells the person | Starts when | Visual treatment | Combines with | How many at once |
|---|---|---|---|---|---|
| Enabled | This is interactive and ready | Default | The component's normal styling, no layer | n/a: the base the other states modify | Any number |
| Disabled | This exists but can't be used now | The product sets it | Dimmed color, lower (level 0) elevation, no layer | Not listed by Material; component tokens define disabled + selected colors | Any number |
| Hover | The pointer is over something actionable | A cursor rests on the element | 8% layer, faded in and out; +1 elevation level on elements that lift | Focused, selected, pressed | One (it follows the cursor) |
| Focused | Keyboard or voice input will act here | Tab, arrow keys or an equivalent | 10% layer plus the focus ring | Hovered, selected | One |
| Pressed | Your input registered | Tap, click, stylus, Enter/Space, voice | 10% layer, usually as a ripple from the touch point | Hovered, focused, selected | One |
| Dragged | You are holding and moving this | Press and hold, then move | 16% layer plus a raised elevation | Not listed by Material | One |

Notes that change decisions:

- **Pressed is not touch-only.** Material's definitions include clicks, keyboard and voice activation, and
  the Inputs page asks that a mouse click or stylus tap give the same feedback as a finger. On the web,
  make Enter and Space show the pressed layer too.
- **Hover also opens tooltips.** The Inputs page wants a cursor or stylus resting on an element to show
  its tooltip where it has one, in addition to the hover layer.
- **Dragged is called low emphasis yet has the strongest layer (16%).** Material doesn't explain the
  mismatch. Keep 16%: the lift and the moving item carry most of the signal anyway.
- **Selected is not one of the six.** It is a separate condition (see [Selection](#selection)) that the six
  combine with. A selected item changes its container and content colors; the state layer then uses the
  selected content color.
- **"Activated" is legacy vocabulary.** The page still mentions it in a few lists (hover combines with
  "activated"), but its section is hidden. It meant the current destination in a set (a tab or nav item),
  which is today's selected / active-indicator treatment. Don't implement it as a seventh state.

## State layers

A state layer is a translucent sheet that sits over the container and under the content. Adding it is how
an element moves from its enabled look to a stateful look.

```text
  content (label, icon)        top: stays at full strength, never tinted
  state layer                  middle: content color at 8 / 10 / 10 / 16 %
  container (fill, outline)    bottom
```

**Color.** By default the layer takes the content color: the icon color, or the label color when there is
no icon. That is normally the container's "on" role.

| Container | Content | State layer color |
|---|---|---|
| `primary` | `on-primary` | `on-primary` |
| `secondary-container` | `on-secondary-container` | `on-secondary-container` |
| `surface` (text button, list row) | `primary` or `on-surface` | the same as the content |
| `surface-container` (unselected toggle) | `on-surface-variant` | `on-surface-variant` |

Why the content color: the "on" role already contrasts with its container, so a few percent of it shifts
the container in a visible direction (darker on light fills, lighter on dark fills), and it keeps working
when dynamic color or contrast levels change the roles.

**Coverage and shape.** A layer can cover the whole element (buttons, chips, cards, list items) or be a
circle over part of it (checkboxes, radio buttons, switch handles). The page gives a 40dp layer inside a
48dp target without saying which elements it means. Compose defines a 40dp `StateLayerSize` only for the
checkbox, radio button and switch, with a fully round layer, so read the 40/48 rule as applying to
circular layers on small controls. Full-element layers match the element's shape. The token file carries
both sizes as helpers: `--m3e-state-layer-size` (40px) and `--m3e-min-target-size` (48px).

**One at a time.** An element never shows two state layers stacked. When several states apply, show the
highest-emphasis one (see [Combining states](#combining-states)). The one exception in practice is the
press ripple, which Material Web draws over the hover tint for the length of the press (see
[Press, ripple, drag and elevation](#press-ripple-drag-and-elevation)).

### State tokens

| Token | CSS custom property | Value | Use |
|---|---|---|---|
| md.sys.state.hover.state-layer-opacity | `--md-sys-state-hover-state-layer-opacity` | `0.08` | Hover layer |
| md.sys.state.focus.state-layer-opacity | `--md-sys-state-focus-state-layer-opacity` | `0.1` | Focus layer (with the ring) |
| md.sys.state.pressed.state-layer-opacity | `--md-sys-state-pressed-state-layer-opacity` | `0.1` | Pressed layer or ripple |
| md.sys.state.dragged.state-layer-opacity | `--md-sys-state-dragged-state-layer-opacity` | `0.16` | Dragged layer |
| md.sys.state.disabled.state-layer-opacity | `--md-sys-state-disabled-state-layer-opacity` | `0.38` | Disabled content opacity (see [Disabled](#disabled)); not a layer |
| md.sys.state.focus-indicator.thickness | `--md-sys-state-focus-indicator-thickness` | `3px` | Ring width |
| md.sys.state.focus-indicator.outer-offset | `--md-sys-state-focus-indicator-outer-offset` | `2px` | `outline-offset` for a ring outside the edge |
| md.sys.state.focus-indicator.inner-offset | `--md-sys-state-focus-indicator-inner-offset` | `-3px` | `outline-offset` for a ring fully inside the edge |
| (web helper, not a Material token) | `--m3e-focus-indicator-color` | `var(--md-sys-color-secondary)` | Ring color |
| (web helper, not a Material token) | `--m3e-state-disabled-container-opacity` | `0.1` | Disabled filled container: on-surface at this opacity (see [Disabled](#disabled)) |
| (web helper, not a Material token) | `--m3e-state-layer-size` | `40px` | Diameter of the circular layer on small controls |
| (web helper, not a Material token) | `--m3e-min-target-size` | `48px` | Minimum target size (see [Touch targets](#touch-targets)) |

All eight Material tokens have a single default value (no platform, theme or audience variants). The
opacities, the disabled-container helper included, are unitless numbers: multiply by 100% where CSS wants
a percentage, e.g. `calc(var(--m3e-state-disabled-container-opacity) * 100%)` in `color-mix()`.

Watch for 0.12. Stable Material Web's state tokens (behind its `md-*` web components) still carry 0.12
for focus and pressed, the values from before September 2023. Don't copy opacities from it; use the
tokens above.

## Which elements take which states

The rule behind Material's per-state lists: **components that act, select or accept input take states;
containers that hold them (communication, containment and navigation surfaces) don't, but their
actionable children do.** A top app bar never shows hover; its icon buttons do.

| State | Taken by (Material's examples) | Not taken as a whole (Material's examples) |
|---|---|---|
| Disabled | Buttons, cards, checkboxes, chips, list items, radio buttons, switches, text fields | App bars, badges, dialogs, FABs, menus, navigation bar/drawer/rail, sheets, tabs, tooltips |
| Hover | Buttons, cards, checkbox, chips, date and time pickers, list items, slider, switch, text fields | App bars, badges, dialogs, menus, navigation bar/drawer/rail, sheets, tabs |
| Focus | Buttons, cards, checkbox, chips, date and time pickers, list items, selection controls, text fields | App bars, badges, banner, dialogs, navigation bar/drawer/rail, sheets |
| Pressed | Buttons, cards, checkbox, chips, list items, text fields | App bars, badges, bottom navigation, dialogs, menus, sheets, tabs |
| Dragged | Cards, chips, list items, sliders | App bars, badges, buttons, dialogs, menus, navigation bar/drawer/rail |

Read the right column as "the container itself". Tabs, menus and navigation bars still have items that
hover, focus and press. Material's focus list also names "card" in the right column while listing cards on
the left; the likely meaning is a card used as a plain container for focusable children.

Two specific rules:

- **Elements with a fixed position never take the dragged state** (app bars and anything else people rely
  on finding in the same place).
- **Don't show a disabled FAB.** If its action isn't available, remove the FAB. A disabled primary action
  floating over content is a promise the screen can't keep.

## Disabled

What Material asks for:

- Show disabled with **color changes and reduced elevation**. Disabled elements don't have to meet
  contrast requirements (the color-contrast page says so too).
- A disabled element **can't be focused, pressed or dragged**, and **tapping or hovering changes nothing**:
  no state layer of any kind.
- Any number of elements can be disabled at once.

### The numbers, and why the tokens disagree

Material gives no single system rule for the disabled container, and the tokens have drifted across
generations. The table is the honest picture.

| Where the value lives | Content | Container |
|---|---|---|
| States page, through at least March 2024 (gone by the February 2025 update) | 38% of the enabled style (sentence since deleted) | Not stated |
| System token `md.sys.state.disabled.state-layer-opacity` (2025-11-13) | 0.38 | No system token exists |
| Compose, pre-Expressive components (e.g. tonal button v0_103, chips) | on-surface at 38% | on-surface at 12% (flat chips: outline on-surface at 12%) |
| Compose, Expressive-era buttons (v0_11_0 filled, tonal, elevated, outlined, text) | on-surface-variant at 38% (all five styles) | on-surface at 10% where there is a fill; outlined keeps an outline-variant outline |
| Compose, Expressive icon buttons (14_1_0); Material Web labs buttons, icon buttons, lists | on-surface at 38% | on-surface at 10% |
| Cards | Not set by the card tokens | The card's own surface role at 38%: surface-variant (Compose filled), surface-container-highest (labs filled), surface (Compose and labs elevated) |
| Filled text field | on-surface at 38% (input, label, icons, indicator) | on-surface at 4% |
| Any component | Elevation level 0 | |

How to read it:

- **The 0.38 token's name is misleading.** It is called a state-layer opacity, but disabled elements get
  no state layer, and every component token uses 0.38 for disabled *content* (label, icon). Use it for
  content, which is how the shipped token file comments it. Material doesn't document how to consume it.
- **Container: 10% in current components, 12% in older ones.** The shift came with the Expressive-era
  button tokens. Material has no system token for it; the token file carries the current value as the
  helper `--m3e-state-disabled-container-opacity` (0.1). A product that must match an older component
  set can set that helper to 0.12 on `:root` instead of writing a literal in each rule.
- **Content color: on-surface is the safer default.** It is what Compose icon buttons, chips, lists and
  menus and every Material Web labs component use. Compose's v0_11_0 buttons (all five styles) use
  on-surface-variant; either reads as disabled, but pick one per product.

Recommended default (this skill): content `on-surface` at 38%
(`--md-sys-state-disabled-state-layer-opacity`), filled containers `on-surface` at 10%
(`--m3e-state-disabled-container-opacity`), elevation level 0, no state layers, no pointer or keyboard
activation. Use 12% only to match an existing older component set. Apply opacity per part with
`color-mix()`, not `opacity` on the whole element, which would fade the container, content and focus ring
by the same factor.

## Focus indicator

Material's pages say only that keyboard focus shows a "ring-like" indicator in addition to the focused
state layer. The numbers come from the token database and Material Web:

| Property | Token / helper | Value | Result |
|---|---|---|---|
| Width | `--md-sys-state-focus-indicator-thickness` | `3px` | A 3px ring |
| Outside placement | `--md-sys-state-focus-indicator-outer-offset` | `2px` | Ring occupies 2px to 5px outside the element's edge |
| Inside placement | `--md-sys-state-focus-indicator-inner-offset` | `-3px` | Ring occupies 0px to 3px inside the edge |
| Color | `--m3e-focus-indicator-color` (helper) | `secondary` | Every Compose component that sets a focus-indicator color (15 of them) and Material Web's ring use secondary |
| Shape | none | follows `border-radius` | Outlines follow rounded corners in current browsers |

Choosing outside or inside:

- **Default to the outer ring.** It sits on the surrounding surface. Against every baseline surface role
  and `background`, secondary measures at least 4.61:1 in all six baseline schemes (light and dark at
  three contrast levels; the lowest pair is light-theme `surface-dim`). That is comfortably above the 3:1
  non-text minimum.
- **Use the inner ring only where the outside is clipped** (full-bleed list rows, items inside an
  `overflow` scroller, tightly packed grids). Material Web recommends inward rings for list items.
- **Never put an inner ring on a primary or secondary fill.** Baseline primary and secondary have the same
  tone, so the ring measures about 1:1 against the fill and disappears. Use the outer ring there.
- **Draw the ring on the part people look at.** With some native inputs the focused element is not the
  visible one: a range input's thumb, a switch inside a whole-row label, a radio hidden inside a segment.
  The ring moves to the thumb, row or segment; [section 11](#11-native-inputs-ring-on-the-visible-part)
  of the web part has the patterns.

Keyboard only: show the ring for keyboard-style focus (`:focus-visible` on the web), not after a mouse
click or tap. Material Web's rings follow the same heuristic. Show the 10% focus layer with it, as the
page describes. Material Web (stable and labs) shows the ring alone, which is acceptable but a looser
reading of the page.

Optional motion: Material Web grows the ring from 0 to 8px in 150ms, then settles to 3px over 450ms, both
on `cubic-bezier(0.2, 0, 0, 1)`, and skips it under reduced motion. No Material token or page text
specifies this; treat it as a nicety.

### Focus order and keyboard

These rules come from Material's Inputs and Flow pages and apply to focus as a whole:

- Tab order follows reading order (usually left to right, top to bottom). On the web that is DOM order;
  don't fight it with positive `tabindex`.
- Give every screen, and every multi-part component (a complex card, a dialog), a defined initial focus.
  Opening a dialog moves focus into it; closing or cancelling returns focus to whatever opened it.
- Tab and Shift+Tab move between components; arrow keys move within one (menu items, form cells; on the
  web also radio groups and grids). A group can be a single tab stop whose parts are reached with arrows.
- Enter activates links and buttons and submits forms. Space plays or pauses media (and, on the web,
  also activates buttons and checkboxes).
- Escape closes visible modal elements (menus, dialogs, bottom sheets), clears a visible focus indicator
  and takes the text caret out of a field without deleting what was typed.

## Combining states

- **Several states can be true together, one layer shows.** Hover + focus, focus + selected, pressed +
  hovered are all normal. Because only one layer is allowed, show the highest-emphasis one. The order this
  skill uses (our implementation choice; Material doesn't rank them): dragged, then pressed, then focused,
  then hovered.
- **Selected changes the base, not the layer count.** A selected chip switches to its selected container
  and content colors, and hover then tints with the selected content color.
- **The ring is not a layer.** Focus ring + hover layer (or ring + pressed layer) can show together.
- **Elevation and shape changes stack with the layer.** Hover can add +1 elevation level while the 8%
  layer shows; pressed can morph corners while the 10% layer shows.
- **Disabled overrides everything interactive.** A disabled element shows no hover, focus, press or drag,
  but can still be selected (a checked, disabled checkbox keeps its check in disabled colors).
- **Only one element per state.** At most one hovered, one focused, one pressed and one dragged element on
  the screen. On the web, nested interactive elements break this (hovering a button inside a clickable
  card matches `:hover` on both); see the nesting snippet in [Applying it on the web](#applying-it-on-the-web).

## Press, ripple, drag and elevation

**Press.** Material treats pressed as a high-emphasis change: the composition visibly responds. The usual
signal is a ripple, a circular 10% layer that spreads from the touch point across the element. A flat 10%
layer over the whole element also satisfies the model. Material Web's two ripple implementations, as
reference timings:

| | Stable `md-ripple` | Labs ripple (2026, experimental) |
|---|---|---|
| Layer color | on-surface by default, configurable | `currentColor` |
| Hover | 8%, 15ms linear fade | 8%, 15ms linear fade |
| Press | 12% (old value), fades in over 105ms, out over 375ms | 10%, fades in over 100ms, out over 375ms linear |
| Growth | from 20% of the larger side to full over 450ms, `cubic-bezier(0.2, 0, 0, 1)`; held visible at least 225ms; 150ms touch delay | 20% to 100% over 450ms, `cubic-bezier(0.2, 0, 0, 1)` |
| Focus | ring only, no focus layer | ring only, no focus layer |
| Disabled, forced colors | hidden | removed when disabled |

Both Material Web ripples draw the press over the hover tint instead of replacing it (stable: hover on
`::before`, press on `::after`; labs: two stacked gradients), so a hovered element briefly shows two
tints while pressed. Our reading: Material's one-layer rule covers the steady states, and the brief
ripple is the one tolerated overlap. Section 3 of the web part follows that model.

**Drag.** Picking something up (long press, then move) gives it the 16% layer and lifts it. Material names
list items, chips and cards as draggable and says movement should track the finger in real time. Where
long press + drag already moves items (cards, reorderable lists), it can't also mean range selection.

**Elevation per state.** The elevation pages say similar elements should change elevation consistently in
response to interaction, and reserve levels 4 and 5 for interaction (nothing rests there). The component
tokens show the pattern:

| State | Elevation change | Examples (Compose tokens) |
|---|---|---|
| Hover | +1 level | Filled and tonal buttons 0 → 1, elevated button 1 → 2, FAB 3 → 4, filled card 0 → 1, elevated card 1 → 2 |
| Focus | None (stays at rest) | All of the above |
| Pressed | None (stays at rest) | All of the above |
| Dragged | +3 levels, capped at 5 | Filled and outlined cards 0 → 3, elevated card 1 → 4; chips and list items go to 4, as their component tokens set |
| Disabled | To level 0 | All components |

The applying-states page says buttons and cards "can" lift when pressed, but no component token does.
Follow the tokens: hover lifts one level, pressed stays at rest.

| Level | Token | Value | Shadow helper (web, not a Material token) |
|---|---|---|---|
| 0 | `--md-sys-elevation-level0` | `0px` | `--m3e-elevation-shadow-level0` (`none`) |
| 1 | `--md-sys-elevation-level1` | `1px` | `--m3e-elevation-shadow-level1` |
| 2 | `--md-sys-elevation-level2` | `3px` | `--m3e-elevation-shadow-level2` |
| 3 | `--md-sys-elevation-level3` | `6px` | `--m3e-elevation-shadow-level3` |
| 4 | `--md-sys-elevation-level4` | `8px` | `--m3e-elevation-shadow-level4` |
| 5 | `--md-sys-elevation-level5` | `12px` | `--m3e-elevation-shadow-level5` |

## Selection

**Indicators.** Material shows selection with a check mark, a checkbox, a change of container color, or a
mix of these. A whole component or part of it can be selectable, by tap, cursor, keyboard or voice.
Material lists these as selectable: checkboxes, radio buttons, switches, chips, icon buttons, segmented
buttons, list items, menu items, cards, data tables, pickers and sliders.

**Active indicators.** Navigation (bar, rail, drawer) and tabs mark the current destination with an active
indicator instead, a shape behind or under the item whose color and form depend on the component. Exactly
one destination is active per set. Compose's navigation bar and drawer tokens paint the indicator in
`secondary-container` with an `on-secondary-container` icon.

**Color-only selection.** Material allows a container-color change on its own. WCAG is stricter: 1.4.1
(Use of Color) and 1.4.11 (Non-text Contrast) require the state to be perceivable without relying on hue,
and forced-colors mode strips the color anyway. Prefer pairing color with a check mark, an active
indicator, a shape change or a bolder label.

**Touch patterns.**

- Enter selection mode with a long press, a two-finger touch, or whatever shortcut the screen offers (an
  item's avatar is the usual one). After that, single taps add or remove items.
- Leave selection mode by deselecting every item or through an action in the toolbar.
- Long press + drag can select a range. Don't use it where that gesture already picks items up to move
  them.

**Pointer (desktop) patterns.**

- When selecting is the main job of the screen, keep checkboxes visible all the time.
- When it is a side task, reveal an item's checkbox on hover, and reveal all checkboxes once any item is
  selected. On the web, reveal on `:focus-within` as well, so keyboard users get the same affordance.

**Semantics on the web.**

| Meaning | Attribute | Typical elements |
|---|---|---|
| Chosen item in a set | `aria-selected="true"` | `role="option"`, `role="tab"`, grid rows and cells |
| Toggle button on/off | `aria-pressed="true"` | `<button>` used as a toggle (icon toggles, toggle buttons, filter chips built as buttons) |
| Checked control | `aria-checked="true"` or native `checked` | Checkbox, radio, switch, `menuitemcheckbox`, `menuitemradio` |
| Current destination | `aria-current="page"` (or `"step"`, `"location"`) | Links in navigation bar, rail, drawer, breadcrumbs |

Style from these attributes rather than from a parallel `.selected` class, so visuals and semantics can't
drift apart.

## Expressing state with shape and springs

Expressive components use shape as a second state channel. Material's usability guidance lists selected,
tap, swipe, scroll, release and long press among the interactions a shape morph can communicate, and
button groups morph when pressed and selected. Material states no rule for the direction, but the
component tokens share one pattern (our summary): **a state moves the shape along the corner scale, away
from where it started.** Round things get squarer; squarish things get rounder.

- **Pressed is momentary.** A round control steps down the corner scale while it is held and springs back
  on release. Larger controls press to a larger step, so the change stays in proportion.
- **Selected persists.** A round toggle settles on a squarer step and a square toggle turns fully round,
  and the new shape holds for as long as the item stays selected.
- **Near-square items round up.** Items that rest at a small step (list items, items in a grouped list)
  move a few steps up the scale when pressed, focused, dragged or selected.
- **Joined groups keep their silhouette.** Only the inner corners, where items meet, move; the outer
  corners stay put.

shape.md states the same pattern as a table in [State through shape](shape.md#state-through-shape), and
its [Inner corners](shape.md#inner-corners-asymmetric-shapes) section covers joined groups.

Illustrative (component value): a small round toggle button 40px tall rests at full (written as 20px),
presses to 8px (`--md-sys-shape-corner-small`) and selects to 12px (`--md-sys-shape-corner-medium`).
Section 6 of the web part builds it. The exact per-size values for buttons, icon buttons, toggles, list
items and button groups are component specs; take them from Material's component pages
(https://m3.material.io/components) rather than from this file.

Which spring:

| Change | Motion type | Helper | Expressive value |
|---|---|---|---|
| State-layer fade, container or content color change | Effects (no overshoot) | `--m3e-motion-spring-fast-effects` | `150ms cubic-bezier(0.31, 0.94, 0.34, 1)` |
| Press or selection morph on a small or medium control (button, icon button, toggle, chip, list item, joined group) | Spatial | `--m3e-motion-spring-fast-spatial` | `350ms cubic-bezier(0.42, 1.67, 0.21, 0.9)` |
| Shape change on a larger element (a card, a pane) | Spatial, speed by size ([motion.md](motion.md#speed-fast-default-slow)) | `--m3e-motion-spring-default-spatial` | `500ms cubic-bezier(0.38, 1.21, 0.22, 1)` |
| Shadow change on hover or drag | Effects (our recommendation) | `--m3e-motion-spring-fast-effects` | `150ms cubic-bezier(0.31, 0.94, 0.34, 1)` |

Why presses are spatial too: a corner radius is geometry, and Material's motion guidance counts corner
rounding among the properties spatial springs move ([motion.md](motion.md#spatial-and-effects-springs)).
Material Web labs also animates every button radius change on the fast spatial curve.
Compose makes a calmer choice for plain (non-toggle) button presses: it drives them with the default
effects spring (`--m3e-motion-spring-default-effects`, `200ms cubic-bezier(0.34, 0.8, 0.34, 1)`), which
doesn't bounce. That is acceptable if the product uses it for every plain press; mixing the two across
one product reads as inconsistency, not variety. Toggle and selection morphs stay spatial either way. With
`data-motion-scheme="standard"` the spatial helpers switch to the standard scheme's curves, which
overshoot only slightly.

Rules that keep morphs working:

- Pair shape with another cue (color, icon, `aria-pressed`). Shape alone is easy to miss and invisible to
  assistive tech.
- Animate between real lengths. "Full" is `9999px` in the token file; animating from or to it jumps or
  (with an overshooting curve) flashes square. Write the half-height length instead (20px on a 40px
  button).
- Under `prefers-reduced-motion: reduce` the token file turns spatial helpers into `1ms linear`, so press
  and selection morphs become instant with no extra CSS. Effects helpers keep their curves: if you chose
  the Compose-style effects spring for plain presses, drop `border-radius` from that transition under
  reduced motion yourself.

## Touch targets

- **Every interactive element needs a 48×48px target** (`--m3e-min-target-size`), even when it looks
  smaller. A 24px icon or a compact button keeps a 48px hit area. Material phrases this as a
  recommendation for most platforms (48dp is about 9mm physically). WCAG 2.2's AA floor (2.5.8) is only
  24×24px; treat 48 as the target and 24 as the hard minimum for dense exceptions.
- **Pointer-only targets** (mouse, stylus) can go down to 44×44px. Material notes that iOS recommends
  44×44 targets.
- **Leave at least 8px between separate targets** in most layouts, so a finger that lands between two
  of them doesn't hit the wrong one.
- **Targets that tile a container are exempt from the gap.** List rows, the segments of a segmented
  control and the buttons of a connected button group sit edge to edge without overlapping, so every
  point in the strip belongs to exactly one target and the visible edge is the boundary. They need no 8px
  between them, but each one still meets the 48×48px size. WCAG agrees: 2.5.8 asks for spacing only around
  targets smaller than 24×24px (its spacing exception), so touching full-size targets pass. The 2px gap
  between items in a grouped list is decoration, not target spacing.
- **The state layer can be smaller than the target.** Small controls show a 40px circular layer
  (`--m3e-state-layer-size`) centered in the 48px target. Full-element layers match the element, not the
  target.

Write targets with the `--m3e-min-target-size` helper (a web helper in the token file, not a Material
token). Don't reach for the spacing token `--md-sys-measurement-space600`: it has the same 48px value, but
it names a gap, and a target is a size.

## Applying it on the web

The CSS below uses only the shipped token file (`assets/m3-expressive-tokens.css`). Class names (`.state`,
`.ripple`, `.lift`) are examples. In React, Vue, Svelte or any other framework the same CSS applies; set
the `data-*` and `aria-*` attributes from component state.

### 1. State layer

`::before` carries the layer. `currentColor` makes it the content color automatically, which is Material's
default rule. `z-index: -1` inside an `isolation: isolate` element paints the layer above the element's own
background but under its text and icons.

```css
.state {
  position: relative;
  isolation: isolate;
}
.state::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;              /* follows the container, including morphs */
  background-color: currentColor;      /* the content ("on") color */
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  transition: opacity var(--m3e-motion-spring-fast-effects);
}

/* Hover only where a real hover exists, so touch screens don't keep a stuck tint.
   The guards also cover a wrapper <label class="state"> whose checkbox or radio is disabled (section 11). */
@media (hover: hover) {
  .state:where(:not(:disabled, [aria-disabled="true"], :has(> :is([type="checkbox"], [type="radio"]):disabled))):hover::before {
    opacity: var(--md-sys-state-hover-state-layer-opacity);
  }
}
/* A wrapper takes focus from the checkbox or radio inside it; :where() keeps both selectors at the same weight. */
.state:where(:not(:disabled, [aria-disabled="true"])):focus-visible::before,
.state:has(> :where([type="checkbox"], [type="radio"]):focus-visible)::before {
  opacity: var(--md-sys-state-focus-state-layer-opacity);
}
/* .ripple elements draw a ripple instead (section 3) and keep their hover/focus tint here. */
.state:where(:not(:disabled, [aria-disabled="true"], :has(> :is([type="checkbox"], [type="radio"]):disabled), .ripple)):is(:active, [data-pressed])::before {
  opacity: var(--md-sys-state-pressed-state-layer-opacity);
}
.state[data-dragging]::before {
  opacity: var(--md-sys-state-dragged-state-layer-opacity);
}

/* Small controls (checkbox, radio, switch handle): a 40px circle centered in the 48px target.
   Put .state-circle on the target-sized wrapper (a <label> or <span>), because native inputs can't reliably host ::before. */
.state.state-circle::before {
  inset: 50% auto auto 50%;
  inline-size: var(--m3e-state-layer-size);
  block-size: var(--m3e-state-layer-size);
  translate: -50% -50%;
  border-radius: var(--md-sys-shape-corner-full);
}
```

Details that matter:

- The four rules have equal specificity, so source order ranks them: dragged beats pressed beats focus
  beats hover, which gives "one layer at a time".
- The `:not(:disabled, [aria-disabled="true"])` guard is required: browsers match `:hover` on disabled
  buttons, and Material says disabled elements get no layer.
- If the content color is set on a child (a label `<span>`) rather than on the element, set `color` on the
  element too, or give `::before` an explicit `background-color`.
- A wrapper (a `.state-circle` label, a whole-row label, a segment) never matches `:focus-visible` or
  `:disabled` itself; the checkbox or radio inside does. The `:has(> …)` parts above read the state from
  that direct child. They are limited to checkboxes and radios because a text field matches
  `:focus-visible` after a click too, which would tint its label while someone types. The focus
  selector's `:where()` keeps it at the same weight as the other three, so source order still ranks them.
- Fade timing is our choice. Material only says hover fades in and out gently and gives no duration;
  the fast effects spring (150ms, no overshoot) fits that. Material Web uses a 15ms linear hover fade.
- Cursor: Material reserves the hand cursor for links and linked images and uses the arrow elsewhere;
  many web systems, Material Web labs included, put `cursor: pointer` on every clickable control. Either
  is defensible; be consistent, and never show the hand on disabled elements.
- Alternative without a pseudo-element (Material Web labs' approach): paint the layer as an extra
  `background-image`, e.g. `linear-gradient(color-mix(in srgb, currentColor calc(var(--md-sys-state-hover-state-layer-opacity) * 100%), transparent) 0 0)`
  above the fill. It frees `::before` but repeats the gradient in every state rule.

### 2. Focus ring

```css
.state:focus-visible {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}

/* Inside ring, only where the outside is clipped and the fill is a surface role. */
.state.focus-inward:focus-visible {
  outline-offset: var(--md-sys-state-focus-indicator-inner-offset);
}

/* Optional: Material Web's grow-then-settle ring (implementation detail, not a token). */
@keyframes m3e-focus-ring {
  from { outline-width: 0px; }
  25% { outline-width: 8px; }
  to { outline-width: var(--md-sys-state-focus-indicator-thickness); }
}
@media (prefers-reduced-motion: no-preference) {
  .state:focus-visible {
    animation: m3e-focus-ring var(--md-sys-motion-duration-long4) var(--md-sys-motion-easing-standard);
  }
}
```

- Use `outline`, not `box-shadow`: forced-colors mode removes shadows but keeps outlines.
- Don't remove outlines globally (`*:focus { outline: none }`). Browsers already limit the default ring to
  `:focus-visible`, so there is nothing to suppress. The one accepted `outline: none` is on an input
  whose ring has moved to its visible part (a range thumb, a row, a segment); section 11 shows each case.
- `--m3e-focus-indicator-color` resolves where it is declared (`:root` and the contrast blocks). To change
  the ring color inside a re-themed subtree, set `--m3e-focus-indicator-color` on that subtree.
- The keyframes run 600ms (`--md-sys-motion-duration-long4`) with the 8px peak at 25%, which reproduces
  the 150ms + 450ms phases. If the element runs another `animation`, list both.

### 3. Press ripple (optional)

A flat pressed layer is enough. For a ripple, add the `ripple` class: section 1's pressed rule skips
`.ripple` elements, so `::before` keeps its hover or focus tint during the press and the ripple draws on
`::after` above it, the way Material Web layers them. JS sets the origin (section 10).

```css
.state.ripple {
  --ripple-x: 50%;
  --ripple-y: 50%;
}
.state.ripple::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: currentColor;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  transition: opacity var(--md-sys-motion-duration-medium3) linear;   /* 350ms release fade */
}
.state.ripple:where(:not(:disabled, [aria-disabled="true"])):is(:active, [data-pressed])::after {
  opacity: var(--md-sys-state-pressed-state-layer-opacity);
  transition-duration: var(--md-sys-motion-duration-short2);   /* 100ms fade in */
}
/* Growth only when motion is welcome; under reduced motion the ripple is a plain fade. */
@media (prefers-reduced-motion: no-preference) {
  .state.ripple:where(:not(:disabled, [aria-disabled="true"])):is(:active, [data-pressed])::after {
    animation: m3e-ripple var(--md-sys-motion-duration-long1) var(--md-sys-motion-easing-standard);
  }
}
@keyframes m3e-ripple {
  from { clip-path: circle(20% at var(--ripple-x) var(--ripple-y)); }
  to { clip-path: circle(150% at var(--ripple-x) var(--ripple-y)); }
}
```

A `circle()` radius of 150% always covers the box from any origin inside it (100% is the box diagonal
divided by √2). The growth uses the legacy duration and easing tokens (450ms, `cubic-bezier(0.2, 0, 0, 1)`),
which the token file's reduced-motion block doesn't touch, so the animation is declared only under
`prefers-reduced-motion: no-preference`. (An `animation: none` override in a `reduce` block would lose
to the more specific pressed selector.) On release the clip is dropped and the full-size layer fades
out over 350ms (`--md-sys-motion-duration-medium3`), the duration token nearest Material Web's 375ms
release fade, so no literal duration is needed.

### 4. Disabled and aria-disabled

```css
.state:disabled,
.state[aria-disabled="true"],
.state:has(> :where([type="checkbox"], [type="radio"]):disabled) {   /* a wrapper whose input is disabled */
  color: color-mix(in srgb, var(--md-sys-color-on-surface) calc(var(--md-sys-state-disabled-state-layer-opacity) * 100%), transparent);
  box-shadow: var(--m3e-elevation-shadow-level0);
  cursor: default;
}
/* Filled, tonal and elevated containers: on-surface at 10% (helper; Material has no system token). */
.state.filled:disabled,
.state.filled[aria-disabled="true"] {
  background-color: color-mix(in srgb, var(--md-sys-color-on-surface) calc(var(--m3e-state-disabled-container-opacity) * 100%), transparent);
}
```

- **Prefer native `disabled`** on `<button>`, `<input>`, `<select>`, `<textarea>` and `<fieldset>`: the
  element leaves the tab order and can't be activated, which is exactly Material's rule.
- **Use `aria-disabled="true"`** for elements without a native `disabled` (links, custom widgets), or
  when a disabled control must stay discoverable by keyboard, for instance to show a tooltip explaining
  why it is unavailable. Staying focusable is a deliberate exception to Material's "can't be focused"
  rule. Such an element keeps its focus ring (keyboard users must see where they are) but gets no focus
  layer, and JS must block activation (section 10).
- **Don't use `pointer-events: none`** to disable: it doesn't stop keyboard activation and it kills the
  hover tooltip that explains the disabled state.
- **Don't fade with `opacity`** on the element. It applies one factor to container, content and focus
  ring, while Material dims content (38%) and container (10%) by different amounts and an
  `aria-disabled` element's ring must stay fully visible.
- **Put these rules after component color rules, or guard those rules.** `.state:disabled` has the same
  specificity as a rule like `.toggle[aria-pressed="true"]`, so a later selected-color rule would
  repaint a disabled toggle. Section 6 shows the guard.

### 5. Elevation and drag

```css
.lift {
  box-shadow: var(--m3e-elevation-shadow-level1);        /* resting level 1 */
  transition: box-shadow var(--m3e-motion-spring-fast-effects);
}
@media (hover: hover) {
  .lift:where(:not(:disabled, [aria-disabled="true"])):hover {
    box-shadow: var(--m3e-elevation-shadow-level2);      /* +1 level; focus and press stay at rest */
  }
}
.drag-handle {
  touch-action: none;                                    /* pointer events drive the drag; the rest of the item still scrolls */
  cursor: grab;
}
.draggable[data-dragging],
.draggable[data-dragging] .drag-handle {
  cursor: grabbing;
}
/* Dragged: three levels above rest, capped at 5. */
.draggable[data-dragging] {
  box-shadow: var(--m3e-elevation-shadow-level3);        /* rests at 0 (filled, outlined cards): 0 + 3 */
}
.draggable:is(.lift, .chip, .list-item)[data-dragging] {
  box-shadow: var(--m3e-elevation-shadow-level4);        /* rests at 1 (elevated card): 1 + 3; chips and list items: 4 per their tokens */
}
```

- Put `touch-action: none` on a drag handle, never on items that fill a scrolling list, or the list
  can't be scrolled by touch. For Material's long-press pick-up on the whole item, leave `touch-action`
  alone and, once the long press has fired, call `preventDefault()` in a `touchmove` listener registered
  with `{ passive: false }` so the finger moves the item instead of the list.
- The dragged element also carries `.state`, so section 1's `[data-dragging]` rule adds the 16% layer.
- The drag level is the resting level plus three, never above 5: level 0 goes to 3 and a `.lift` element
  (resting at 1) goes to 4. Chips and list items are the named exception: their component tokens send
  them to 4. Match `.chip` and `.list-item` to whatever classes your components use.
- Don't use `aria-grabbed` or `aria-dropeffect`; ARIA 1.1 deprecated them. Announce pick-up, moves and
  drops through a live region, and offer a keyboard way to reorder (e.g. a menu with "Move up"/"Move
  down", or Space to pick up and arrows to move).

### 6. Selection and shape morph

The illustrative toggle from [Expressing state with shape and springs](#expressing-state-with-shape-and-springs),
`<button class="state filled toggle" aria-pressed="false">`: surface-container when off, primary when on
(Compose filled toggle colors); round at rest, 12px when selected, 8px while pressed. The 40px height
and the colors are component values used as an example; take real ones from the component pages.

```css
.toggle {
  --toggle-height: 40px;  /* illustrative (component value); a 40px visual needs a 48px hit area: see .hit-target under Touch targets */
  block-size: var(--toggle-height);
  border: 0;
  border-radius: calc(var(--toggle-height) / 2);         /* full, written as half the height so it can animate */
  background-color: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface-variant);
  transition:
    border-radius var(--m3e-motion-spring-fast-spatial),
    background-color var(--m3e-motion-spring-fast-effects),
    color var(--m3e-motion-spring-fast-effects);
}
.toggle[aria-pressed="true"] {
  border-radius: var(--md-sys-shape-corner-medium);      /* 12px; kept when disabled */
}
/* Selected colors skip disabled toggles, which keep section 4's disabled colors. */
.toggle[aria-pressed="true"]:where(:not(:disabled, [aria-disabled="true"])) {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.toggle:where(:not(:disabled, [aria-disabled="true"])):is(:active, [data-pressed]) {
  border-radius: var(--md-sys-shape-corner-small);       /* 8px */
}

/* Plain (non-toggle) button: the same press morph on the fast spatial spring, this skill's default.
   Reduced motion needs no extra rule: the token file already turns this helper into 1ms linear. */
.button-round {
  --button-height: 40px;  /* illustrative (component value); a 40px visual needs a 48px hit area: see .hit-target under Touch targets */
  block-size: var(--button-height);
  border-radius: calc(var(--button-height) / 2);
  transition: border-radius var(--m3e-motion-spring-fast-spatial);
}
.button-round:where(:not(:disabled, [aria-disabled="true"])):is(:active, [data-pressed]) {
  border-radius: var(--md-sys-shape-corner-small);
}

/* Navigation: one current destination, marked by an active indicator. */
.nav-item[aria-current="page"] .nav-indicator {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

/* Secondary-task selection on desktop: reveal checkboxes on hover or focus, and all once one is checked.
   Hiding happens only where hover exists, so touch screens always show them. opacity (not visibility
   or display) keeps a hidden checkbox reachable by Tab. */
@media (hover: hover) {
  .select-list .item-check {
    opacity: 0;
    transition: opacity var(--m3e-motion-spring-fast-effects);
  }
  .select-list .item:is(:hover, :focus-within) .item-check,
  .select-list:has(.item-check:checked) .item-check {
    opacity: 1;
  }
}
```

The `.state::before` layer inherits the morphing `border-radius` and the new content color, so hover and
press tints follow the toggle automatically.

For the calmer Compose-style press, swap the `.button-round` transition to
`border-radius var(--m3e-motion-spring-default-effects)` on every plain button in the product, and add
`@media (prefers-reduced-motion: reduce) { .button-round { transition: none; } }`, because the token file
leaves effects helpers untouched under reduced motion.

### 7. Touch targets

Make the element's box the target (`--m3e-min-target-size`, 48px) and paint a smaller visual inside it.
For a filled icon button whose visible circle is 40px (illustrative component value),
`<button class="state filled icon-button" aria-label="…">`:

```css
.icon-button {
  --icon-button-size: 40px;                              /* illustrative (component value): the visible circle */
  --target-inset: calc((var(--m3e-min-target-size) - var(--icon-button-size)) / 2);   /* 4px */
  box-sizing: border-box;                                /* the target size includes the padding */
  inline-size: var(--m3e-min-target-size);
  block-size: var(--m3e-min-target-size);
  padding: var(--target-inset);                          /* visible container inside the 48px target */
  border: 0;
  border-radius: var(--md-sys-shape-corner-full);
  background-clip: content-box;                          /* the fill stops at the visible circle */
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
.icon-button::before {
  inset: var(--target-inset);                            /* state layer matches the visible circle */
}
.icon-button:focus-visible {
  outline-offset: calc(var(--md-sys-state-focus-indicator-outer-offset) - var(--target-inset));  /* 2px outside the visible edge */
}

/* When the box can't grow (inline icons, dense rows), extend the hit area with a pseudo-element instead. */
.hit-target {
  position: relative;                                    /* the percentages below resolve against this box */
}
.hit-target::after {
  content: "";
  position: absolute;
  /* Negative by half the shortfall when the box is under 48px; 0 when it is already big enough. */
  inset-block: calc(min(100% - var(--m3e-min-target-size), 0%) / 2);
  inset-inline: calc(min(100% - var(--m3e-min-target-size), 0%) / 2);
}
```

The `.hit-target` form uses `::after`, so don't combine it with the `::after` ripple on the same element.
Neighboring separate targets still need 8px between their hit areas; targets that tile a row or group
are exempt ([Touch targets](#touch-targets)).

### 8. Nested interactive elements

A clickable card that contains buttons would otherwise tint the card and the button together.

```css
/* The inner element owns hover and press; the outer one keeps a focus or drag layer it already has. */
@media (hover: hover) {
  .state:has(.state:hover):not(:focus-visible, [data-dragging])::before {
    opacity: 0;
  }
}
.state:has(.state:active):not(:focus-visible, [data-dragging])::before {
  opacity: 0;
}
.state.ripple:has(.state:active)::after {
  opacity: 0;                                            /* no outer ripple either */
  animation: none;
}
```

The `:has()` and `:not()` arguments add specificity, so these rules beat the section 1 and section 3
rules wherever they sit in the stylesheet.

### 9. Forced colors

Windows high-contrast themes strip backgrounds and shadows, so state layers, tinted selection and
elevation vanish. Keep a non-color cue for each state.

```css
@media (forced-colors: active) {
  .state::before,
  .state.ripple::after {
    display: none;
  }
  .state:focus-visible {
    outline-color: Highlight;
  }
  .state:is([aria-selected="true"], [aria-pressed="true"], [aria-current="page"]) {
    forced-color-adjust: none;                           /* inherited: children should color icons with currentColor */
    background-color: Highlight;
    color: HighlightText;
  }
  .state:disabled,
  .state[aria-disabled="true"] {
    color: GrayText;
  }
}
```

A check mark icon or an outlined active indicator survives forced colors without special handling, one
more reason to pair color with a shape.

### 10. JS helpers

```js
// Ripple origin: where the pointer went down, relative to the element.
document.addEventListener('pointerdown', (event) => {
  const el = event.target.closest('.ripple');
  if (!el) return;
  const box = el.getBoundingClientRect();
  el.style.setProperty('--ripple-x', `${event.clientX - box.left}px`);
  el.style.setProperty('--ripple-y', `${event.clientY - box.top}px`);
});

// Keyboard presses (Enter, Space) show the pressed state, rippling from the center.
document.addEventListener('keydown', (event) => {
  const el = event.target;
  if (!(el instanceof Element) || !el.matches('.state') || !['Enter', ' '].includes(event.key)) return;
  // Typing a space or Enter in a text field is not a press.
  const textEntry = 'textarea, select, input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"], [type="reset"])';
  if (el.isContentEditable || el.matches(textEntry)) return;
  el.style.setProperty('--ripple-x', '50%');
  el.style.setProperty('--ripple-y', '50%');
  el.setAttribute('data-pressed', '');
});
const release = (event) => event.target instanceof Element && event.target.removeAttribute('data-pressed');
document.addEventListener('keyup', release);
document.addEventListener('focusout', release);

// aria-disabled: block activation (native disabled needs nothing).
document.addEventListener('click', (event) => {
  const el = event.target.closest('[aria-disabled="true"]');
  if (el) { event.preventDefault(); event.stopImmediatePropagation(); }
}, true);

// iOS Safari applies :active on touch only when a touchstart listener exists.
document.addEventListener('touchstart', () => {}, { passive: true });

// Drag: set the attribute for the whole gesture; announce in a live region.
function startDrag(el, liveRegion) {
  el.setAttribute('data-dragging', '');
  liveRegion.textContent = `Picked up ${el.textContent.trim()}.`;
}
function endDrag(el, liveRegion, position) {
  el.removeAttribute('data-dragging');
  liveRegion.textContent = `Dropped at position ${position}.`;
}
```

### 11. Native inputs: ring on the visible part

Build on native inputs where you can: they bring the semantics, the keyboard behavior and form support for
free. The catch is that the element holding focus is sometimes not the part people look at, so the ring
has to move to that part. Three builds come up again and again. Two of them set `outline: none` on the
input, which is acceptable only because the rule beside it draws the replacement ring; the audit's STA-04
passes it on that condition and fails an `outline: none` with no replacement.

```html
<!-- Whole-row label: the row is the target, the switch is its control. -->
<label class="state row">
  <span>Download over Wi-Fi only</span>
  <input type="checkbox" role="switch" class="switch">
</label>

<!-- Segmented control built from radios: one Tab stop; arrow keys move and select. -->
<fieldset class="segmented">
  <legend>Theme</legend>
  <label class="state segment"><input type="radio" name="theme" value="system" class="visually-hidden" checked>System</label>
  <label class="state segment"><input type="radio" name="theme" value="light" class="visually-hidden">Light</label>
  <label class="state segment"><input type="radio" name="theme" value="dark" class="visually-hidden">Dark</label>
</fieldset>

<!-- Range input, already restyled with appearance: none on the input and its thumb. -->
<input type="range" class="range" aria-label="Playback speed">
```

```css
/* Whole-row label around a switch or checkbox. Section 1 gives the row its focus layer;
   the ring sits inside the row's edge because rows touch their neighbors. */
.row:has(> input:focus-visible) {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-inner-offset);
}
.row > input:focus-visible {
  outline: none;                                         /* replaced by the row's ring above */
}

/* Visually hidden radio: still focusable and still in the accessibility tree. */
.visually-hidden {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);                                 /* also hides the radio's own ring; no outline override needed */
  white-space: nowrap;
}
/* Segment around a hidden radio: the outer ring, raised above the neighboring segments. */
.segment:has(> input:focus-visible) {
  z-index: 1;
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}
/* Selected segment: illustrative (component value) colors; disabled segments keep section 4's colors. */
.segment:has(> input:checked):where(:not(:has(> input:disabled))) {
  background-color: var(--md-sys-color-secondary-container);
  color: var(--md-sys-color-on-secondary-container);
}

/* Range input: the thumb is what people watch, so the thumb carries the ring. */
.range:focus-visible {
  outline: none;                                         /* replaced by the thumb's ring below */
}
.range:focus-visible::-webkit-slider-thumb {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}
/* A separate rule on purpose: a selector list containing one unknown pseudo-element is dropped whole. */
.range:focus-visible::-moz-range-thumb {
  outline: var(--md-sys-state-focus-indicator-thickness) solid var(--m3e-focus-indicator-color);
  outline-offset: var(--md-sys-state-focus-indicator-outer-offset);
}
```

- **Rows and segments lean on sections 1 and 4.** Section 1's `:has(> …)` selectors give the wrapper its
  focus layer and drop hover and press when the input inside is disabled; section 4 dims such a wrapper.
  Put `.state` on the label, never on the input.
- **Why the row carries the ring.** A tap anywhere on the row toggles the switch, so the row is the
  target, and the ring should outline what activation will hit. A ring around the small switch alone
  would pass WCAG but undersell the target.
- **Segments keep the outer ring**, which reads on any fill, a primary-filled selected segment included.
  Each `.state` segment is its own stacking context (`isolation: isolate`), so without `z-index: 1` the
  next segment would paint over the ring. If the group clips its children (`overflow: hidden` for rounded
  ends), use the inner offset instead, but not on a primary or secondary fill.
- **Radios sharing one `name` are a single Tab stop**, and the arrow keys move and select within the
  group with no script, which is the keyboard model a segmented choice needs. Name the group with a
  `<legend>` (hide it with `.visually-hidden` if the design shows no label), and pair the selected fill
  with a check icon or a bolder label so selection isn't carried by color alone.
- **Range thumbs take custom styles only after a reset.** Chromium and Safari apply
  `::-webkit-slider-thumb` styles only when the input and the thumb both have `appearance: none`; Firefox
  styles `::-moz-range-thumb` without it. Track and thumb geometry is a component spec (the slider page).
  Keep the input's block size at least `--m3e-min-target-size`, which the target rule asks for anyway and
  which leaves room for a ring drawn outside the thumb.

### Browser notes

- `:focus-visible`, `:has()`, `@media (hover: hover)`, `color-mix()`, `translate` and outlines that follow
  `border-radius` work in all current engines (Chrome, Edge, Firefox, Safari 16.4+).
- `light-dark()` colors in the token file need Chrome 123+, Firefox 120+ or Safari 17.5+; older browsers
  get the file's light/dark fallback, which the state layer inherits through `currentColor`.
- An ancestor with `overflow: hidden`, `overflow: auto` or `clip-path` clips the outer ring. Either give
  the clipping ancestor at least 5px of padding or switch those items to the inner ring.
- On hybrid devices (touch laptop), `(hover: hover)` follows the primary pointer. Use `(any-hover: hover)`
  instead if mouse users on touch-first devices must see hover.

## Do and don't

- **Do** tint with the content color at the token opacities. **Don't** invent per-component opacities or
  use black/white overlays; they break in dark theme and at higher contrast levels.
- **Do** keep text and icons above the layer. **Don't** put the overlay on top of the content; it washes out
  the label that the layer is supposed to leave readable.
- **Do** show focus with the 3px secondary ring on `:focus-visible`. **Don't** rely on the 10% tint alone;
  it is too faint to find by keyboard and fails non-text contrast.
- **Do** use the outer ring on filled (primary, secondary) elements. **Don't** use the inner ring there; the
  ring and fill share a tone and the ring disappears.
- **Do** show one layer per element and one hovered, focused, pressed and dragged element per screen.
  **Don't** let a card and the button inside it both light up.
- **Do** make disabled elements inert: dimmed, flat, no layers. **Don't** give them hover tints, press
  ripples or pointer cursors; feedback on something that won't respond is misleading.
- **Do** remove an unavailable FAB. **Don't** show it disabled.
- **Do** lift one level on hover and keep press at rest. **Don't** rest anything at level 4 or 5; those are
  for interaction.
- **Do** pair a selection color change with a check mark, active indicator, shape or label change, and
  set `aria-selected`, `aria-pressed`, `aria-checked` or `aria-current`. **Don't** signal selection with a
  hue shift alone.
- **Do** use effects springs for fades and color, and spatial springs for press and selection morphs
  (fast spatial on small and medium controls). **Don't** animate to or from `9999px`; the corner jumps or
  flashes square. Compose's calmer effects spring for plain-button presses is fine only if every plain
  press in the product uses it.
- **Do** keep 48×48px targets (`--m3e-min-target-size`) with 8px between separate targets; rows, segments
  and connected buttons that tile a group may touch. **Don't** shrink the hit area to match a small
  visual.
- **Do** move the focus ring to the visible part of a native input (thumb, row, segment). **Don't** write
  `outline: none` on an input without that replacement ring.
- **Do** gate hover behind `@media (hover: hover)`. **Don't** leave hover tints stuck on touch screens
  after a tap.

## Auditing

Each check passes or fails. The consolidated list is in `references/audit-checklist.md`.

1. **Every interactive element gives feedback**: hovering (with a mouse), tabbing to and pressing each
   control visibly changes it; disabled controls show none of the three. Check hover rules exclude
   `:disabled` and `[aria-disabled="true"]`.
2. **Layer color and opacity**: state layers use the element's content color at 8% hover, 10% focus, 10%
   pressed and 16% dragged, taken from `--md-sys-state-*` tokens; grep finds no literal 0.12 or other
   ad-hoc overlay opacities.
3. **Layer order and count**: the layer paints between container and content (label and icon colors are
   unchanged when hovered), and no element shows two stacked layers.
4. **Focus ring**: every focusable element shows a 3px ring in the secondary role on keyboard focus, 2px
   outside the edge (or fully inside where clipped), drawn with `outline`, following the corners; no ring
   after a mouse click on a button; the ring reaches at least 3:1 against what it sits on. Any
   `outline: none` sits next to a replacement ring on a range thumb, row or segment (section 11).
5. **Disabled treatment**: content at 38%, filled container on-surface at 10%
   (`--m3e-state-disabled-container-opacity`; 12% only to match an older component set), elevation 0, not
   focusable (unless deliberately `aria-disabled`), activation blocked; no disabled FAB exists.
6. **Containers stay quiet**: app bars, navigation containers, sheets, dialogs and menus don't tint as a
   whole on hover, focus or press; their items do. Nothing with a fixed position can be dragged.
7. **Elevation**: hoverable raised elements lift exactly one level on hover and stay at rest on focus and
   press; dragged items rise three levels, capped at 5 (chips and list items go to 4); nothing rests at
   level 4 or 5.
8. **Selection**: every selected or current item is marked by more than hue and exposes
   `aria-selected` / `aria-pressed` / `aria-checked` / `aria-current`; each navigation set has exactly one
   active item.
9. **Motion**: fades and color changes use effects timing; press and selection morphs use a spatial
   spring (fast spatial on small and medium controls), or plain presses use the effects spring across
   the whole product; nothing animates to or from `9999px`; with reduced motion on, morphs, ripple growth
   and ring animation don't play.
10. **Targets and forced colors**: every target is at least 48×48px (`--m3e-min-target-size`), with 8px
    between separate targets (tiling rows, segments and connected buttons may touch); in forced-colors
    mode the focus ring, selection and disabled states are all still visible.

## Sources

- Material Design 3, States overview: https://m3.material.io/foundations/interaction/states/overview
- Material Design 3, State layers: https://m3.material.io/foundations/interaction/states/state-layers
- Material Design 3, Applying states: https://m3.material.io/foundations/interaction/states/applying-states
- Material Design 3, Selection: https://m3.material.io/foundations/interaction/selection
- Material Design 3, Gestures: https://m3.material.io/foundations/interaction/gestures
- Material Design 3, Inputs: https://m3.material.io/foundations/interaction/inputs
- Material Design 3, Flow (focus order): https://m3.material.io/foundations/designing/flow
- Material Design 3, Structure (target sizes): https://m3.material.io/foundations/designing/structure
- Material Design 3, Color contrast: https://m3.material.io/foundations/designing/color-contrast
- Material Design 3, Elevation: https://m3.material.io/styles/elevation/overview,
  https://m3.material.io/styles/elevation/applying-elevation, https://m3.material.io/styles/elevation/tokens
- Material Design 3, Usability: https://m3.material.io/foundations/usability/overview
- Material Design 3, Components (exact per-component sizes and corners): https://m3.material.io/components
- Material Design 3, Button groups: https://m3.material.io/components/button-groups/overview
- Material Design 3, Shape morph: https://m3.material.io/styles/shape/shape-morph
- Internet Archive snapshots of the pages above (content history 2023-2026): https://web.archive.org/
- AndroidX, Compose Material 3 tokens (`StateTokens`, button, icon button, card, chip, list, checkbox,
  switch tokens) and `Button.kt`: https://github.com/androidx/androidx
- Material Components for Android, `tokens.xml` and history:
  https://github.com/material-components/material-components-android
- Material Web (focus ring, ripple, state tokens, labs components): https://github.com/material-components/material-web
- Material Web focus ring docs: https://github.com/material-components/material-web/blob/main/docs/components/focus-ring.md
- WCAG 2.2 (1.4.1 Use of Color, 1.4.11 Non-text Contrast, 2.4.7 Focus Visible, 2.5.8 Target Size):
  https://www.w3.org/TR/WCAG22/
- WAI-ARIA 1.2 (`aria-selected`, `aria-pressed`, `aria-current`; deprecated `aria-grabbed`):
  https://www.w3.org/TR/wai-aria-1.2/
- CSS Color Adjustment (forced colors): https://www.w3.org/TR/css-color-adjust-1/
- MDN, `:focus-visible`: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
- MDN, `hover` media feature: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover
- MDN, `:active` (iOS Safari note): https://developer.mozilla.org/en-US/docs/Web/CSS/:active
- MDN, `::-webkit-slider-thumb` and `::-moz-range-thumb`:
  https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-slider-thumb,
  https://developer.mozilla.org/en-US/docs/Web/CSS/::-moz-range-thumb
- WAI-ARIA Authoring Practices, Radio Group pattern (one Tab stop, arrow keys):
  https://www.w3.org/WAI/ARIA/apg/patterns/radio/
