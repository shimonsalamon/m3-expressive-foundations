# Angular Material

How to bring M3 Expressive to an app built on Angular Material, which implements baseline Material 3 only. Everything
here was worked out on a production Angular 22 app with Angular Material 22.0.5; class names, keyframe names and
internal selectors are Material's implementation details, so re-check them after an upgrade (the grep at the end of
[Checking after an upgrade](#checking-after-an-upgrade) finds them).

## Contents

- [Key ideas](#key-ideas)
- [Tokens: Material's names and this skill's](#tokens-materials-names-and-this-skills)
- [Restyling a component: tokens first](#restyling-a-component-tokens-first)
- [Shape: the press morph on Material's buttons](#shape-the-press-morph-on-materials-buttons)
- [Motion: retiming Material's own animations](#motion-retiming-materials-own-animations)
- [Motion in Angular itself](#motion-in-angular-itself)
- [Menus: Expressive vertical menus, selects, and a menu with a search](#menus-expressive-vertical-menus-selects-and-a-menu-with-a-search)
- [Gotchas](#gotchas)
- [Checking after an upgrade](#checking-after-an-upgrade)

## Key ideas

- **Keep Material's components, change them through their tokens.** Angular Material themes every component through
  system tokens (`--mat-sys-*`) and component tokens (`--mat-<component>-*`). Override those first; reach for
  selectors only for what no token covers (motion, press shapes, Expressive-only states).
- **One token vocabulary per app.** In an Angular Material app, component CSS reads `--mat-sys-*`, which the theme
  already defines and switches for light, dark and contrast. Don't load this skill's whole token file beside it: two
  sets of roles drift apart. Take from the skill what Material lacks (the spring helpers, the motion scheme, the
  shape library) and alias any `--md-sys-*` name you need to its `--mat-sys-*` twin.
- **Add Expressive behavior once, globally.** Press morphs, spring timing and selected states are global rules keyed
  on Material's stable classes, in the shared stylesheet every window loads, not per-component copies.
- **Retime, don't replace.** Material's code listens for its own keyframe names and waits on its own timers. Change a
  component's duration and easing; keep its keyframes and leave its closing timing alone.

## Tokens: Material's names and this skill's

| This skill | Angular Material | Notes |
|---|---|---|
| `--md-sys-color-<role>` | `--mat-sys-<role>` | Same role names: `--mat-sys-primary`, `--mat-sys-on-surface-variant`, `--mat-sys-surface-container-high`... |
| `--md-sys-typescale-<style>-<part>` | `--mat-sys-<style>-<part>` | Parts: `font`, `size`, `line-height`, `weight`, `tracking` (`--mat-sys-label-large-size`) |
| `--md-sys-shape-corner-<step>` | `--mat-sys-corner-<step>` | `--mat-sys-corner-full` is a large literal, not a half-height: see the press morph |
| `--md-sys-state-<state>-state-layer-opacity` | `--mat-sys-<state>-state-layer-opacity` | `--mat-sys-hover-state-layer-opacity` |
| `--m3e-elevation-shadow-level<n>` | `--mat-sys-level<n>` | Material's are box-shadow values too |
| `--m3e-motion-spring-*` | none | Material has no spring tokens: copy the helpers (below) |

The spring helpers, as an Angular app's shared stylesheet can carry them (the expressive scheme's official web curves;
with reduced motion the spatial ones end at once and the effects ones still ease):

```css
:root {
  --m3e-motion-spring-fast-spatial-duration: 350ms;
  --m3e-motion-spring-fast-spatial-easing: cubic-bezier(0.42, 1.67, 0.21, 0.9);
  --m3e-motion-spring-fast-spatial: 350ms cubic-bezier(0.42, 1.67, 0.21, 0.9);
  /* ...default (500ms) and slow (650ms) spatial, fast (150ms), default (200ms) and slow (300ms) effects:
     values in assets/m3-expressive-tokens.css */
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --m3e-motion-spring-fast-spatial: 1ms linear; /* and every other spatial helper and its parts */
  }
}

/* An in-app "Reduce motion" setting sets the same values (motion.md, An in-app setting). */
:root[data-reduce-motion] {
  --m3e-motion-spring-fast-spatial: 1ms linear;
}
```

A Tailwind app can expose them as utilities, so templates don't hand-pick durations:

```js
// tailwind.config.js, plugins: tw-motion-fast-spatial, tw-motion-default-effects, ...
require('tailwindcss/plugin')(({ addUtilities }) => {
  const springs = {};
  for (const speed of ['fast', 'default', 'slow']) {
    for (const type of ['spatial', 'effects']) {
      springs[`.motion-${speed}-${type}`] = {
        'transition-duration': `var(--m3e-motion-spring-${speed}-${type}-duration)`,
        'transition-timing-function': `var(--m3e-motion-spring-${speed}-${type}-easing)`,
      };
    }
  }
  addUtilities(springs);
});
```

## Restyling a component: tokens first

Component tokens are custom properties set on the component or an ancestor class. They keep Material's hover, focus,
pressed, disabled and ripple behavior intact, which a hand-written `background` does not.

```css
/* A fixed end-call red on a filled button: container, label, state layer and ripple in one place. */
.hangup-action {
  --mat-button-filled-container-height: 64px;
  --mat-button-filled-container-color: var(--app-color-end-call);
  --mat-button-filled-label-text-color: var(--app-color-on-end-call);
  --mat-button-filled-state-layer-color: var(--app-color-on-end-call);
  --mat-button-filled-ripple-color: color-mix(in srgb, var(--app-color-on-end-call) 12%, transparent);
  --mat-button-filled-icon-spacing: 0; /* icon only: no gap reserved for a label */
  --mat-button-filled-icon-offset: 0;
}
```

The button variants and their token prefixes and host classes:

| `matButton=` | Host class | Token prefix |
|---|---|---|
| (text) | `.mat-mdc-button` | `--mat-button-text-*` |
| `filled` | `.mat-mdc-unelevated-button` | `--mat-button-filled-*` |
| `elevated` | `.mat-mdc-raised-button` | `--mat-button-protected-*` |
| `outlined` | `.mat-mdc-outlined-button` | `--mat-button-outlined-*` |
| `tonal` | `.mat-tonal-button` | `--mat-button-tonal-*` |
| `matIconButton` | `.mat-mdc-icon-button` | `--mat-icon-button-*` (size: `--mat-icon-button-state-layer-size`) |
| `matFab` / `matMiniFab` | `.mat-mdc-fab` / `.mat-mdc-mini-fab` (both `.mat-mdc-fab-base`) | `--mat-fab-*` / `--mat-fab-small-*` |

Resize through the height token (`--mat-button-<variant>-container-height`), not `height:`: the press morph below
reads it, and so does Material's own layout.

## Shape: the press morph on Material's buttons

Material's buttons rest at `--mat-sys-corner-full`, a large literal. Animated from there to a pressed corner, the radius
looks unchanged until the very end and then snaps, and a spring's overshoot past zero flashes square corners. The fix
([shape.md: Pressed and selected shapes by size](shape.md#pressed-and-selected-shapes-by-size)) is a resting radius of
half the real height. Material sizes every button from a height token, so one global rule can do it:

```css
.mat-mdc-button { --app-button-height: var(--mat-button-text-container-height, 40px); }
.mat-mdc-unelevated-button { --app-button-height: var(--mat-button-filled-container-height, 40px); }
.mat-mdc-raised-button { --app-button-height: var(--mat-button-protected-container-height, 40px); }
.mat-mdc-outlined-button { --app-button-height: var(--mat-button-outlined-container-height, 40px); }
.mat-tonal-button { --app-button-height: var(--mat-button-tonal-container-height, 40px); }
.mat-mdc-icon-button { --app-button-height: var(--mat-icon-button-state-layer-size, 40px); }

/* Not FABs (no pressed shape in the button tokens), nor buttons that set their own corners. */
.mat-mdc-button-base:not(.mat-mdc-fab-base, .own-shape) {
  --app-button-shape: calc(var(--app-button-height) / 2);

  border-radius: var(--app-button-shape);
  /* Replaces Material's transition on these hosts, so restate what it animated. */
  transition:
    border-radius var(--m3e-motion-spring-fast-spatial),
    background-color var(--m3e-motion-spring-fast-effects),
    color var(--m3e-motion-spring-fast-effects),
    border-color var(--m3e-motion-spring-default-effects),
    box-shadow var(--m3e-motion-spring-default-effects);

  /* Square icon buttons: 50% is round at any size, and animates smoothly to a pixel radius. */
  &.mat-mdc-icon-button {
    --app-button-shape: 50%;
  }

  /* The icon button's hover and press layer reads the shape token, not the button's corners. */
  & > .mat-mdc-button-persistent-ripple {
    border-radius: inherit;
  }

  /* The focus ring sits 5px out (3px ring, 2px gap): its corners follow the button's. */
  &:focus-visible > .mat-focus-indicator::before {
    border-radius: calc(var(--app-button-shape) + var(--mat-focus-indicator-border-width, 3px) + 2px);
  }

  /* 8px at 40px tall, 12px at 56px, at most 16px. */
  &:active:not(:disabled) {
    --app-button-shape: clamp(8px, var(--app-button-height) / 4 - 2px, 16px);
  }
}
```

The rule outranks Material's single-class corner rules (two classes) and loses to `!important` utilities, so a button
that sets its own corners on purpose keeps them. Exclude it explicitly anyway (a marker class, or `[class*='rounded']`
in a Tailwind app) and exclude any region with its own press behavior, such as a button group: a pressed shape stacked
on another press effect reads as a glitch.

A FAB's corners come from `--mat-fab-container-shape`; to give one a press morph, change that token on `:active` and
transition `border-radius`, so its focus ring (which Material computes from the same token) follows.

## Motion: retiming Material's own animations

Material 22 animates its overlays with CSS keyframes and classes, and its dialog with a transition whose length its
code sets. Each override below changes timing only. Material's code listens for the keyframe names
(`animationend`) and removes closing elements on its own timer, so keep the names and leave the exits alone.

```css
/* Dialogs: Material sets --mat-dialog-transition-duration (150ms open, 75ms close) and times the open from it. The
   CSS transition may outlast it: afterOpened fires a little early, which is harmless. Not while closing. */
.cdk-overlay-pane .mat-mdc-dialog-container:not(._mat-animation-noopable, .mdc-dialog--closing) .mat-mdc-dialog-surface {
  transition: transform var(--m3e-motion-spring-default-spatial);
}
.cdk-overlay-pane .mat-mdc-dialog-container:not(._mat-animation-noopable, .mdc-dialog--closing) .mat-mdc-dialog-inner-container {
  transition: opacity var(--m3e-motion-spring-default-effects);
}

/* Menus, select panels, autocomplete panels: keep the keyframe names. */
.mat-mdc-menu-panel:not(.mat-menu-panel-exit-animation, .mat-menu-panel-animations-disabled) {
  animation: _mat-menu-enter var(--m3e-motion-spring-fast-spatial);
}
.cdk-overlay-container .mat-select-panel-animations-enabled:not(.mat-select-panel-exit) {
  animation: _mat-select-enter var(--m3e-motion-spring-fast-spatial);
}
.cdk-overlay-container .mat-autocomplete-panel-animations-enabled {
  animation: _mat-autocomplete-enter var(--m3e-motion-spring-fast-spatial);
}

/* Snackbars and tooltips. */
.cdk-overlay-container .mat-snack-bar-container-animations-enabled.mat-snack-bar-container-enter {
  animation: _mat-snack-bar-enter var(--m3e-motion-spring-fast-spatial) forwards;
}
.cdk-overlay-container .mat-mdc-tooltip-show {
  animation: mat-mdc-tooltip-show var(--m3e-motion-spring-fast-effects) forwards;
}

/* Switches: Material's handle moves in 75ms, too quick to read as Expressive's switch. */
.mat-mdc-slide-toggle:not(._mat-animation-noopable) .mdc-switch__handle-track {
  transition: transform var(--m3e-motion-spring-fast-spatial);
}
.mat-mdc-slide-toggle:not(._mat-animation-noopable) .mdc-switch__handle {
  transition:
    width var(--m3e-motion-spring-fast-spatial),
    height var(--m3e-motion-spring-fast-spatial),
    margin var(--m3e-motion-spring-fast-spatial);
}
.mat-mdc-slide-toggle:not(._mat-animation-noopable) .mdc-switch__handle::before,
.mat-mdc-slide-toggle:not(._mat-animation-noopable) .mdc-switch__handle::after {
  transition:
    background-color var(--m3e-motion-spring-fast-effects),
    border-color var(--m3e-motion-spring-fast-effects);
}

/* Tabs: the indicator slides on a spring; the body keeps Material's duration (its code waits for transitionend) and
   only changes its curve. */
.mat-mdc-tab-header:not(._mat-animation-noopable) .mdc-tab-indicator:not(.mdc-tab-indicator--no-transition) .mdc-tab-indicator__content {
  transition: transform var(--m3e-motion-spring-fast-spatial);
}
.mat-mdc-tab-body-wrapper:not(._mat-animation-noopable) .mat-tab-body-content-can-animate {
  transition-timing-function: var(--m3e-motion-spring-default-spatial-easing);
}
```

A `.cdk-overlay-container` (or `.cdk-overlay-pane`) prefix is there for specificity: Material's component styles are
injected after the global stylesheet, so they win ties. Exclude any overlay with its own motion by its `panelClass`
(`.cdk-overlay-pane:not(.my-search-dialog)`).

Left as Material ships them, because they are fast effects already or their timing is code-driven: checkboxes, radio
buttons, chips' checkmarks, ripples, progress indicators, form-field labels.

## Motion in Angular itself

**`animate.enter` / `animate.leave`** (Angular 20.2+) add a CSS class when an element enters or before it leaves, and
remove it, or the element, once its animations end. Angular waits for the longest animation on the element itself
(events from descendants don't count) and drops empty class names, so `[animate.enter]="compact() ? '' : 'opening'"`
turns the animation off cleanly.

```html
@if (expanded()) {
  <aside class="panel" animate.enter="panel-opening" animate.leave="panel-closing">...</aside>
} @else {
  <div class="rail" animate.enter="rail-returning">...</div>
}
```

A leaving element stays in the layout until its animation ends, beside whatever replaced it: plan for both being
present (stacked, or the newcomer hidden until the leaver is gone, with an animation delay as long as the exit).

**Router View Transitions** (`withViewTransitions()`) animate every navigation. Use `onViewTransitionCreated` to skip
the ones that change nothing (query parameters only) and to name the kind of change on `<html>` for CSS to pick a
pattern; give `skipInitialTransition: true`. Then apply restraint: animating whole panes on every navigation reads as
slow and was rejected in review ([motion.md: Restraint in navigation](motion.md#restraint-in-navigation)).

## Menus: Expressive vertical menus, selects, and a menu with a search

Angular Material's menu is the baseline menu. The Expressive vertical menu
(`md.comp.menus.*`: 44px items, 4px item corners, 12px at the ends, selected item in tertiary-container with 12px
corners) is a token and selector change:

```css
.mat-mdc-menu-panel {
  --mat-menu-container-color: var(--mat-sys-surface-container-low);
  --mat-menu-item-label-text-color: var(--mat-sys-on-surface);
  --mat-menu-item-icon-color: var(--mat-sys-on-surface-variant);
  --mat-menu-item-icon-size: 20px;
  --mat-menu-item-leading-spacing: 16px;
  --mat-menu-item-trailing-spacing: 16px;
  border-radius: 16px !important;
}
.mat-mdc-menu-content:has(.mat-mdc-menu-item) { padding: 4px; }
.mat-mdc-menu-content .mat-mdc-menu-item { min-height: 44px; border-radius: 4px; }
/* The icon-size token sizes the icon's box, not its glyph. */
.mat-mdc-menu-item .mat-icon {
  font-size: var(--mat-menu-item-icon-size, 24px);
  line-height: var(--mat-menu-item-icon-size, 24px);
}

/* Select panels: the same menu, with Material's own option tokens for the selected row. */
.cdk-overlay-pane div.mat-mdc-select-panel {
  --mat-select-panel-background-color: var(--mat-sys-surface-container-low);
  --mat-option-selected-state-layer-color: var(--mat-sys-tertiary-container);
  --mat-option-selected-state-label-text-color: var(--mat-sys-on-tertiary-container);
  padding: 4px;
  border-radius: 16px;
}
```

A lazily rendered menu (`matMenuContent`) wraps its items in an extra element, so "first item" and "last item" for
the end corners have to look one or two levels down.

**A selected menu row** that isn't a select option: Material paints a menu item's hover and focus as a background color
from `--mat-menu-item-hover-state-layer-color` and `--mat-menu-item-focus-state-layer-color`. Over a selected fill, set
those tokens to the state color mixed over the fill, or hover erases the selection:

```css
.row--selected {
  --mat-menu-item-hover-state-layer-color: color-mix(in srgb,
    var(--mat-sys-on-tertiary-container) calc(var(--mat-sys-hover-state-layer-opacity) * 100%),
    var(--mat-sys-tertiary-container));
  background-color: var(--mat-sys-tertiary-container);
  border-radius: 12px;
}
```

**A menu with a search on top** (a long list of numbers or people): M3 has no such component, so compose it from M3
parts. A search bar at density -4 (40px, full corners, surface-container-high) 8px in from the menu's edges, then the
rows as real `mat-menu-item`s, so arrow keys, Enter and the state layers are Material's. The keyboard needs care:
the menu's key manager has type-ahead and Home/End, which would take keys typed into the search.

```ts
// On the search input's keydown: keep typing in the field; Escape and Tab still close the menu.
handleSearchKeydown = (event: KeyboardEvent, menu: MatMenu) => {
  if (event.key === 'Escape' || event.key === 'Tab') return;
  event.stopPropagation();
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    menu.focusFirstItem('keyboard'); // into the list
  } else if (event.key === 'Enter') {
    event.preventDefault();
    this.select(this.filtered()[0]); // the first match
    menu.closed.emit('keydown');
  }
};
```

Put a click `stopPropagation()` on the search's wrapper too, or a click in the field closes the menu. A trailing icon
in a row (a check) has to be wrapped: Material projects a `mat-icon` that is a direct child of the item into its
leading slot.

## Gotchas

- **Dialog defaults per window.** `MAT_DIALOG_DEFAULT_OPTIONS` replaces Material's defaults wholesale: restore
  `autoFocus` in it. To scope it to one window or view, provide `MatDialog` next to it in the same component's
  `providers`, or the root `MatDialog` reads the root defaults. In a see-through window (Electron, a card on a
  transparent window), set `hasBackdrop: false`: the scrim shows as a dark box around the card.
- **FAB color.** `matFab` defaults to the accent color, which per-palette theme rules restyle at high specificity;
  override FAB tokens with `!important` or set them on the button itself. FABs also carry a permanent level-3 shadow
  (`--mat-fab-container-elevation-shadow`).
- **Component styles come after global ones.** At equal specificity, Material's injected component CSS wins; add a
  container class or an overlay ancestor to the global selector.
- **A component's own CSS can't reach Material's internals** with emulated encapsulation; use `::ng-deep` under a
  class of your own (`.my-list ::ng-deep .cdk-virtual-scroll-content-wrapper`), never bare.
- **`transition` is one property.** Setting it on a Material host replaces Material's transitions there (box-shadow
  on filled buttons, border on outlined ones): restate them, on effects springs.
- **Virtual scroll rows.** A `cdk-virtual-scroll-viewport` (and TanStack Virtual) positions rows with `transform`; an
  enter animation on a row must use the `translate` property instead ([motion.md: Items arriving in a long
  list](motion.md#12-items-arriving-in-a-long-or-virtualized-list)).

## Checking after an upgrade

The names this file relies on are internal. After updating `@angular/material`, confirm they still exist:

```bash
cd node_modules/@angular/material/fesm2022
grep -l "_mat-menu-enter\|_mat-select-enter\|_mat-autocomplete-enter\|_mat-snack-bar-enter\|mat-mdc-tooltip-show" *.mjs
grep -o "TRANSITION_DURATION_PROPERTY = '[^']*'" dialog.mjs
grep -o "mat-mdc-button-persistent-ripple[^}]*border-radius[^;]*;" _icon-button-chunk*.mjs
grep -o "\['[a-z]*', \[[^]]*\]\]" button.mjs   # appearance -> host classes
```

## Sources

- Angular Material theming and tokens: https://material.angular.dev/guide/theming
- Angular animations with `animate.enter` / `animate.leave`: https://angular.dev/guide/animations
- Router View Transitions: https://angular.dev/api/router/withViewTransitions
- M3 component token tables: `scripts/fetch-m3-spec.mjs` (m3.material.io's content API)
