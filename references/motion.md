# Motion

Motion tells users what changed, where things came from and what they can do next. M3 Expressive
(May 2025) made a physics system Material's primary motion language, taking over from fixed curves and
durations: each animation is a spring defined by a stiffness and a damping ratio. You pick it by scheme (expressive or standard), by
what it animates (spatial or effects) and by speed (fast, default or slow). The older easing and
duration tokens still exist, are now labelled legacy, and still drive screen-to-screen transitions. On
the web, `assets/m3-expressive-tokens.css` ships the spring numbers plus CSS helpers: Google's official
cubic-bezier conversions and our `linear()` traces of the real spring shape. `data-motion-scheme`
switches between the sets, and the spatial helpers are cut to 1ms under reduced motion.

## Contents

- [Key ideas](#key-ideas)
- [What M3 Expressive changed](#what-m3-expressive-changed)
- [The spring model](#the-spring-model)
- [Motion schemes: expressive and standard](#motion-schemes-expressive-and-standard)
- [Spatial and effects springs](#spatial-and-effects-springs)
- [Speed: fast, default, slow](#speed-fast-default-slow)
- [Spring token values](#spring-token-values)
- [Custom schemes and hero moments](#custom-schemes-and-hero-moments)
- [Springs as CSS: official curves vs linear() traces](#springs-as-css-official-curves-vs-linear-traces)
- [Legacy easing and duration](#legacy-easing-and-duration)
- [Transition patterns](#transition-patterns)
- [Reduced motion and restraint](#reduced-motion-and-restraint)
- [Applying it on the web](#applying-it-on-the-web)
- [Do and don't](#do-and-dont)
- [Auditing](#auditing)
- [Sources](#sources)

## Key ideas

- **A spring is a behaviour, not a timeline.** Stiffness is how hard it pulls toward the target,
  the damping ratio is how fast any wobble dies out, and velocity is whatever speed the element already
  has. There is no fixed duration, so an interrupted spring carries on from its current position and
  speed toward the new target. Material cites this as a main reason for springs: gestures,
  interruptions and retargeting stay seamless.
- **Tokens do not name a scheme.** Code asks for `md.sys.motion.spring.default.spatial`, and the
  product's active scheme supplies the numbers. Switch the scheme and every animation changes with it,
  with no renaming.
- **Three questions pick any animation:** which scheme applies (product-wide or to this hero
  element)? Is the property spatial (position, size, rotation, corner shape) or an effect (color,
  opacity)? How big is the element, or how far does it travel (fast, default or slow)?
- **Only spatial springs bounce, and visibly only in Expressive.** Effects springs are critically
  damped in both schemes. Opacity and color have hard limits, so overshooting them gives clipping or
  off-target colors, not a pleasant bounce.
- **Speed follows size.** Small parts use stiff, quick springs and full-screen changes use soft, slow
  ones, so the time a move takes grows with how far it goes (the same logic as the legacy rule of
  scaling duration with the area covered). Importance does not change the speed: an important element
  stands out through a bigger move, a shape morph or the expressive scheme, not a slower spring.
- **Screen transitions are still legacy.** Material has not yet moved its transition patterns to
  springs. Use the emphasized or standard easing-and-duration pairs for navigation between screens.
  A component entering or leaving within a screen (a menu, a sheet) is component motion and may use
  springs, like any other component animation.
- **The web runs approximations.** CSS cannot simulate a spring, so the helpers encode each spring as
  a curve plus a duration. That works for fire-and-forget animations. Anything a user can grab, fling
  or interrupt needs a real spring in JavaScript.

## What M3 Expressive changed

| Status | What | Detail |
|---|---|---|
| New (May 2025) | Motion physics system | Springs become Material's primary motion language. Easing and duration is being phased out. |
| New | 12 numeric spring tokens + 6 composites | `md.sys.motion.spring.{fast,default,slow}.{spatial,effects}.{damping,stiffness}`; each composite bundles one damping + stiffness pair. The token database dates them to 2024, before the public launch. |
| New | Two preset schemes, Expressive and Standard | Chosen at product level and not part of token names, so a scheme swap renames nothing. |
| New | Spatial vs effects split | Spatial springs may overshoot; effects springs never do. |
| New | Speed axis (fast / default / slow) | Replaces choosing a duration and an easing curve. |
| New | Motion is themeable | Like color, type and shape: define custom schemes, or swap the scheme for one element. |
| New | "Web: Convert springs to curves" table | Official cubic-bezier + duration per spring and scheme (web status: compatible). |
| New | Shape morph | Uses the expressive scheme by default; can be switched to standard. |
| Relabelled | Easing and duration tokens | Values unchanged, now legacy and "no longer maintained". Still used for transitions and by products not yet on Expressive. |
| Unchanged | Transition patterns | Same six patterns. Material notes they still run on the legacy system and will move to springs later (no date). |
| Unchanged | `md.sys.motion.path` | `linear`: elements travel in straight lines. |

Platform defaults disagree with the guidance. Material recommends Expressive for most products, but
Compose's `MaterialTheme` defaults to `MotionScheme.standard()` (only `MaterialExpressiveTheme` defaults
to expressive), MDC-Android's theme attributes default to Standard values without wiring them into
components yet, and Flutter lists the physics system as unavailable. Material Web is in maintenance mode and does not implement M3 Expressive, so on the web
you build motion yourself from the tokens. The shipped token file defaults to **expressive**, following
the design guidance.

## The spring model

Material springs use unit mass. Each frame:

```text
acceleration = -stiffness * (position - target) - 2 * dampingRatio * sqrt(stiffness) * velocity
```

| Parameter | Token part | Meaning | Effect of raising it |
|---|---|---|---|
| Stiffness `k` | `…stiffness` | Pull toward the target, in s⁻² for unit mass; natural frequency ωn = √k rad/s | Faster motion. |
| Damping ratio `ζ` | `…damping` | Unitless. 1 = critically damped (no overshoot); below 1 = overshoot, then oscillation | Less bounce. At 1 there is none. |
| Initial velocity | not a token | Speed the element already has: a fling, or an animation in progress | The spring continues that momentum. |

**Interruption and retargeting.** When the target changes mid-flight, a spring keeps its current
position *and velocity* and just pulls toward the new target, so a change of direction stays smooth. A
tween (fixed duration + easing) has to restart its curve. CSS transitions restart from the current value
but drop the velocity, and a reversed transition is shortened by the "reversing shortening factor". With
overshooting curves that shows as a kink, which is why you need a JS spring for anything
interruptible.

**No fixed duration.** A spring ends when it settles. The settle times in this file are our
measurements (within 0.1 % of the target), not token values. The official web table's durations are
Google's curve fits, and the legacy durations are real tokens, but no spring token holds a duration.

**Device classes.** Material says exact spring values vary by device class (watch, phone, tablet)
while keeping their order (fast is always quickest). Only one set is published, and it is the one in
the token file. Wear OS Compose hard-codes its own watch values in code, and no tablet or web-specific
set exists. Do not scale stiffness by viewport size. Choose the speed by element size instead.

## Motion schemes: expressive and standard

| Scheme | Feel | Choose it for | Spatial ζ / k (fast · default · slow) |
|---|---|---|---|
| **Expressive** (default in the token file) | Overshoots the target and settles with a bounce: clear on fast springs (9.48 %), subtle on default and slow (1.52 %) | Most products. Material's recommended default, especially for hero moments and key interactions | 0.6 / 800 · 0.8 / 380 · 0.8 / 200 |
| **Standard** | Glides into place; overshoot is 0.15 %, which nobody can see | Utilitarian products (Material's term). Our examples: dense productivity tools, admin consoles, very repetitive interactions | 0.9 / 1400 · 0.9 / 700 · 0.9 / 300 |

- Effects springs are **identical** in both schemes (ζ 1; k 3800 / 1600 / 800). Switching scheme
  changes only the three spatial springs.
- Use one scheme for almost all motion in a product. Swap it only on purpose (see
  [Custom schemes and hero moments](#custom-schemes-and-hero-moments)).
- Rule of thumb (ours): if the brand is playful or consumer-facing, keep Expressive. If motion must
  stay out of the way (tools people use for hours), use Standard, and consider Expressive for one or two
  hero elements.

## Spatial and effects springs

| Type | Animates | Overshoot | CSS properties (our mapping onto Material's definition) |
|---|---|---|---|
| **Spatial** | Anything that moves or reshapes: position, size, rotation, scale, corner rounding, shape | Yes in Expressive; negligible in Standard | `transform`, `translate`, `scale`, `rotate`, `width`/`height`/`inline-size`/`block-size`, `inset`, `border-radius`, `clip-path`, `grid-template-rows` (expand/collapse), `offset-distance` |
| **Effects** | Values with strict limits: color, opacity | Never (ζ = 1) | `opacity`, `color`, `background-color`, `border-color`, `outline-color`, `fill`, `stroke`, `filter`, `box-shadow` |

**Why effects never overshoot.** Material's reason is that these values have strict limits (MDC's
example: a background's alpha should not bounce above 100 %). What goes wrong otherwise is our
explanation. An overshooting curve pushes a value past its target and back. For position that reads as
physical momentum. For bounded values it breaks:

- Opacity is clamped to 0–1, so the overshoot turns into a dead stop at full (or zero) opacity while
  the curve is still moving, and the fade looks like it ends early and unevenly.
- Color extrapolates past the end color, into a more saturated or shifted hue that belongs to neither
  state, which reads as a flash.
- Effects signal state (hovered, selected, loading), not movement, so a bounce means nothing there.

**Pairing.** One visual change often needs both: a pressed button reshapes its corners with
`fast.spatial` and changes color with `fast.effects`; a text label grows with `default.spatial` and
recolors with `default.effects`. Both Material examples give the two halves the same speed. Follow
that as a recommendation, not a pass/fail rule: a fade one step slower than the move beside it is a
judgment call, not an error. Color and state-layer changes on buttons always use `fast.effects`,
whatever speed the shape uses. Custom components should read the theme's springs (scale to spatial,
color to effects) instead of hard-coding curves, so they follow scheme changes.

**Press and selection morphs.** A corner-radius change is spatial, so this skill runs press morphs and
toggle or selection morphs on small and medium controls with `--m3e-motion-spring-fast-spatial`.
Compose makes a calmer choice for one case: a plain (non-toggle) button's press morph runs on the
default effects spring, so the corners never bounce. That is acceptable if the whole product does it
the same way. Note that effects helpers keep their timing under reduced motion, so with that choice
drop `border-radius` from the transition inside `@media (prefers-reduced-motion: reduce)`.

## Speed: fast, default, slow

Most motion uses **default**. Choose by the size of what moves, or how far it travels:

| Speed | Pick it when | Material's examples: spatial / effects |
|---|---|---|
| **fast** | Small components, short travel | Switch, button / color change of a switch handle |
| **default** | Surfaces that cover part of the screen; anything in between | Bottom sheet, expanding navigation rail / opacity of content inside a rail |
| **slow** | Full-screen changes, long travel | Full-screen animation / full-screen content refresh |

Chips, checkboxes and icon toggles also fit **fast** (our extension of Material's small-component rule).

Pick the speed from size and travel even for the most important element on screen. A slow spring on a
small control only makes it feel sluggish. To make a moment stand out, give it more travel, a shape
morph or the expressive scheme (see [Custom schemes and hero moments](#custom-schemes-and-hero-moments)).

Behaviour from rest, computed by us (unit mass; ms to reach 95 % of the way, ms to settle within
0.1 %, peak overshoot). The settle times are also the durations of the `-linear` CSS helpers:

| Spring | Expressive: 95 % / settle / overshoot | Standard: 95 % / settle / overshoot |
|---|---|---|
| fast spatial | 90 / 360 / 9.48 % | 107 / 230 / 0.15 % |
| default spatial | 174 / 440 / 1.52 % | 152 / 320 / 0.15 % |
| slow spatial | 239 / 600 / 1.52 % | 232 / 490 / 0.15 % |
| fast effects | 77 / 150 / 0 % | same |
| default effects | 119 / 240 / 0 % | same |
| slow effects | 168 / 330 / 0 % | same |

Expressive fast spatial reaches 95 % sooner than Standard fast spatial despite lower stiffness (800 vs
1400): its low damping lets it rush past the target. At default and slow speed Expressive is a little
later to 95 % (174 vs 152 ms, 239 vs 232 ms), and in every spatial case it takes longer to settle
because of the bounce. The schemes differ in character far more than in speed.

## Spring token values

Numbers are DSDB Web rows. The active scheme decides which column is live. The `-damping` and
`-stiffness` properties are real tokens; use them for JS springs.

| Token | CSS custom property | Expressive | Standard | Use |
|---|---|---|---|---|
| md.sys.motion.spring.fast.spatial.damping | `--md-sys-motion-spring-fast-spatial-damping` | 0.6 | 0.9 | Small components moving or reshaping (switch thumb, button corners on press) |
| md.sys.motion.spring.fast.spatial.stiffness | `--md-sys-motion-spring-fast-spatial-stiffness` | 800 | 1400 | ″ |
| md.sys.motion.spring.fast.effects.damping | `--md-sys-motion-spring-fast-effects-damping` | 1 | 1 | Color/opacity of small components (state colors, switch handle color) |
| md.sys.motion.spring.fast.effects.stiffness | `--md-sys-motion-spring-fast-effects-stiffness` | 3800 | 3800 | ″ |
| md.sys.motion.spring.default.spatial.damping | `--md-sys-motion-spring-default-spatial-damping` | 0.8 | 0.9 | Partial-screen surfaces moving or resizing (sheet, expanding rail, card expand) |
| md.sys.motion.spring.default.spatial.stiffness | `--md-sys-motion-spring-default-spatial-stiffness` | 380 | 700 | ″ |
| md.sys.motion.spring.default.effects.damping | `--md-sys-motion-spring-default-effects-damping` | 1 | 1 | Fades and color changes of medium surfaces, scrims, content inside panels |
| md.sys.motion.spring.default.effects.stiffness | `--md-sys-motion-spring-default-effects-stiffness` | 1600 | 1600 | ″ |
| md.sys.motion.spring.slow.spatial.damping | `--md-sys-motion-spring-slow-spatial-damping` | 0.8 | 0.9 | Full-screen movement and resizing |
| md.sys.motion.spring.slow.spatial.stiffness | `--md-sys-motion-spring-slow-spatial-stiffness` | 200 | 300 | ″ |
| md.sys.motion.spring.slow.effects.damping | `--md-sys-motion-spring-slow-effects-damping` | 1 | 1 | Full-screen fades and content refreshes |
| md.sys.motion.spring.slow.effects.stiffness | `--md-sys-motion-spring-slow-effects-stiffness` | 800 | 800 | ″ |

The six composite tokens (`md.sys.motion.spring.<speed>.<type>`) are **not emitted**: a CSS value
cannot hold a spring. The `--m3e-motion-spring-<speed>-<type>` helpers below stand in for them. They
are web helpers, not Material tokens.

## Custom schemes and hero moments

Material describes three levels of motion customization:

1. **Use a preset scheme.** Expressive or Standard; enough for nearly every product.
2. **Define a custom scheme.** Supply your own damping and stiffness for all six springs, and every
   component and transition picks them up. Material invites this when neither preset fits (its
   examples include an extra-stiff and a very soft scheme on a FAB menu).
3. **Swap the scheme for one element or screen.** Keep the product scheme and override it locally,
   e.g. a Standard product whose onboarding hero uses Expressive.

Rules for a custom scheme (ours, built on Material's definitions and its blog example):

- Keep effects springs at ζ = 1, since the bounded-value argument above still holds. Change only the
  spatial damping (more or less bounce) and stiffness (faster or slower).
- Keep the speed order: stiffness fast > default > slow, so size-based choices stay meaningful
  (Material says the order holds across devices and in custom schemes).
- Material's blog example of a "playful" scheme: spatial ζ 0.6 with k 1400 / 700 / 300
  (fast / default / slow), effects unchanged (ζ 1; k 3800 / 1600 / 800). It is Standard's stiffness with
  much lower damping, so all three spatial springs overshoot 9.48 %.
- Re-check settle times. The CSS helpers need a duration, so generate traces with the
  `springToLinear()` function in [Custom scheme on the web](#9-custom-scheme-on-the-web).

**Hero moments** are short, surprising interactions that carry emotional weight or sit at the core of
the product (our examples: completing a purchase, a first-run reveal, a favorite toggle). Material's
tools for them include the expressive springs, shape morph and custom micro-animations. Their speed
still follows size and travel: a first-run reveal that fills the screen gets a slow spring because of
its size, while a favorite toggle stays on fast however much it matters. Keep hero moments to one or two
per product: more than that overwhelms instead of focusing attention. On the web a hero swap is one
attribute: `data-motion-scheme="expressive"` on that subtree.

## Springs as CSS: official curves vs linear() traces

The token file stores two helper families per spring, both web helpers rather than Material tokens.
Each family has a shorthand (`"<duration> <easing>"`, for `transition`/`animation`), a `-duration` and
an `-easing`. All durations are in `ms`.

- **Official family** (`--m3e-motion-spring-<speed>-<type>`, `…-duration`, `…-easing`): Material's
  "Web: Convert springs to curves" table, one cubic-bezier plus a duration per spring and scheme.
- **Trace family** (`--m3e-motion-spring-<speed>-<type>-linear`, `…-linear-duration`,
  `…-linear-easing`): derived by us, not by Material. Each is a `linear()` trace of the exact spring
  released from rest (maximum error 0.002). It runs until the spring stays within 0.1 % of the target,
  so its duration and overshoot are the ones in the [Speed](#speed-fast-default-slow) table, including
  the −0.90 % second swing of Expressive fast spatial.

| Spring | Shorthand helper (append `-linear` for the trace) | Official: Expressive | Official: Standard | Trace duration: Expressive / Standard |
|---|---|---|---|---|
| fast spatial | `--m3e-motion-spring-fast-spatial` | 350ms cubic-bezier(0.42, 1.67, 0.21, 0.9) | 350ms cubic-bezier(0.27, 1.06, 0.18, 1) | 360ms / 230ms |
| default spatial | `--m3e-motion-spring-default-spatial` | 500ms cubic-bezier(0.38, 1.21, 0.22, 1) | 500ms cubic-bezier(0.27, 1.06, 0.18, 1) | 440ms / 320ms |
| slow spatial | `--m3e-motion-spring-slow-spatial` | 650ms cubic-bezier(0.39, 1.29, 0.35, 0.98) | 750ms cubic-bezier(0.27, 1.06, 0.18, 1) | 600ms / 490ms |
| fast effects | `--m3e-motion-spring-fast-effects` | 150ms cubic-bezier(0.31, 0.94, 0.34, 1) | same | 150ms (both) |
| default effects | `--m3e-motion-spring-default-effects` | 200ms cubic-bezier(0.34, 0.8, 0.34, 1) | same | 240ms (both) |
| slow effects | `--m3e-motion-spring-slow-effects` | 300ms cubic-bezier(0.34, 0.88, 0.34, 1) | same | 330ms (both) |

How they compare (our measurement at the official durations):

- Mid-course timing matches closely: the halfway and 90 % points fall within a few ms of the real
  spring, except Standard spatial, where the curve reaches 90 % 13–25 ms late.
- The curves start with a steep slope, but a spring released from rest starts at zero velocity. The
  largest gap is in the first 10–40 ms.
- A single cubic-bezier can overshoot only once, so the official Expressive fast spatial curve cannot
  show the spring's second swing.
- Official durations against the physical settle: Expressive spatial 350 / 500 / 650ms vs
  360 / 440 / 600ms; Standard spatial 350 / 500 / 750ms vs 230 / 320 / 490ms (much longer); effects
  150 / 200 / 300ms vs 150 / 240 / 330ms.
- The official curves are separate fits, not one shape rescaled. Expressive default and slow spatial
  share ζ 0.8, yet their curves differ.

**Which to use.** Material's web guidance is to run real springs where you can, and to use the curves
only for animations that are never interrupted or driven by a gesture. Within that:

- **Official family (default):** it is Google's published mapping, and cubic-bezier works in every
  browser. Use it when you want parity with Material's reference numbers.
- **Trace family:** use it when the spring's true shape matters. Examples: the double swing of
  Expressive fast spatial; zero start velocity, so a press-and-grow starts gently; CSS timing that
  must match a JS spring elsewhere on the page; custom schemes, which have no official curve.
  `linear()` needs Chrome 113+, Firefox 112+ or Safari 17.2+, so gate it with `@supports` and fall back
  to the official family.
- **Choose one family per product.** Their durations differ, so mixing them leaves paired spatial and
  effects animations ending out of step.
- **Neither family is a spring.** Neither carries velocity into an interruption. For drags, flings,
  predictive-back-style previews and controls toggled faster than they settle, run a spring in JS
  ([a JS spring](#7-interruptible-and-gesture-driven-motion-a-js-spring)).

## Legacy easing and duration

Material now tells products to migrate to springs, and calls this system "no longer maintained". It
still has three jobs: screen-to-screen **transitions** (the patterns below are still specified with it),
products not yet on Expressive, and a fallback where springs are unavailable. The values predate M3
Expressive and did not change with it.

### Easing

| Token | CSS custom property | Value (web) | Use |
|---|---|---|---|
| md.sys.motion.easing.emphasized | `--md-sys-motion-easing-emphasized` | cubic-bezier(0.2, 0, 0, 1) | Begin and end on screen; temporary exit (ends at rest just off screen, e.g. a drawer). **On web this is the Standard curve**; see below |
| md.sys.motion.easing.emphasized.decelerate | `--md-sys-motion-easing-emphasized-decelerate` | cubic-bezier(0.05, 0.7, 0.1, 1) | Entering the screen: arrives at full speed, comes to rest |
| md.sys.motion.easing.emphasized.accelerate | `--md-sys-motion-easing-emphasized-accelerate` | cubic-bezier(0.3, 0, 0.8, 0.15) | Leaving the screen for good: starts at rest, leaves at full speed |
| md.sys.motion.easing.standard | `--md-sys-motion-easing-standard` | cubic-bezier(0.2, 0, 0, 1) | Small, utility-focused transitions that begin and end on screen |
| md.sys.motion.easing.standard.decelerate | `--md-sys-motion-easing-standard-decelerate` | cubic-bezier(0, 0, 0, 1) | Utility enter |
| md.sys.motion.easing.standard.accelerate | `--md-sys-motion-easing-standard-accelerate` | cubic-bezier(0.3, 0, 1, 1) | Utility exit |
| md.sys.motion.easing.legacy | `--md-sys-motion-easing-legacy` | cubic-bezier(0.4, 0, 0.2, 1) | M2 "fast out, slow in"; only for matching older code |
| md.sys.motion.easing.legacy.decelerate | `--md-sys-motion-easing-legacy-decelerate` | cubic-bezier(0, 0, 0.2, 1) | M2 decelerate; older code only |
| md.sys.motion.easing.legacy.accelerate | `--md-sys-motion-easing-legacy-accelerate` | cubic-bezier(0.4, 0, 1, 1) | M2 accelerate; older code only |
| md.sys.motion.easing.linear | `--md-sys-motion-easing-linear` | cubic-bezier(0, 0, 1, 1) | Non-stylized motion: progress bars, looping spinners |
| (helper) | `--m3e-motion-easing-emphasized-linear` | `linear(…)` trace of the Android two-segment emphasized path (max error 0.002) | The true emphasized feel on the web, where `linear()` is supported |
| md.sys.motion.path | `--md-sys-motion-path` | linear | Documentary: move elements along straight lines; add arcs (`offset-path`) only as a deliberate customization |

**Emphasized on the web.** The real emphasized curve is two cubic segments joined at (0.166666, 0.4):

```text
M 0,0 C 0.05, 0, 0.133333, 0.06, 0.166666, 0.4 C 0.208333, 0.82, 0.25, 1, 1, 1
```

A single `cubic-bezier()` cannot express it, so Material maps the web token to the Standard curve, which is off
by up to 0.166 in progress. Use `--m3e-motion-easing-emphasized-linear` behind
`@supports (transition-timing-function: linear(0, 1))` when the emphasized character matters (large,
hero transitions). Do not label a hand-picked single cubic-bezier as "emphasized".

Porting from Android XML: MDC-Android's generated token file has emphasized accelerate
(0.3, 0, 0.8, 0.2) and decelerate (0.1, 0.7, 0.1, 1). Material's token database, the specs page and
Compose use the values above: (0.3, 0, 0.8, 0.15) and (0.05, 0.7, 0.1, 1).

### Duration

| Token | CSS custom property | Value | Use |
|---|---|---|---|
| md.sys.motion.duration.short1 | `--md-sys-motion-duration-short1` | 50ms | Tiny utility changes (short family: small utility transitions) |
| md.sys.motion.duration.short2 | `--md-sys-motion-duration-short2` | 100ms | ″ |
| md.sys.motion.duration.short3 | `--md-sys-motion-duration-short3` | 150ms | ″ |
| md.sys.motion.duration.short4 | `--md-sys-motion-duration-short4` | 200ms | Selection controls (with Standard easing); permanent exits |
| md.sys.motion.duration.medium1 | `--md-sys-motion-duration-medium1` | 250ms | Medium area (medium family); Standard decelerate enter |
| md.sys.motion.duration.medium2 | `--md-sys-motion-duration-medium2` | 300ms | Standard easing, begin and end on screen |
| md.sys.motion.duration.medium3 | `--md-sys-motion-duration-medium3` | 350ms | Medium area (medium family) |
| md.sys.motion.duration.medium4 | `--md-sys-motion-duration-medium4` | 400ms | Emphasized decelerate enter; FAB expanding into a sheet |
| md.sys.motion.duration.long1 | `--md-sys-motion-duration-long1` | 450ms | Large, expressive transitions (long family), usually Emphasized |
| md.sys.motion.duration.long2 | `--md-sys-motion-duration-long2` | 500ms | Emphasized begin and end on screen; card expanding to full screen |
| md.sys.motion.duration.long3 | `--md-sys-motion-duration-long3` | 550ms | Large, expressive transitions (long family) |
| md.sys.motion.duration.long4 | `--md-sys-motion-duration-long4` | 600ms | Large, expressive transitions; the usual upper limit |
| md.sys.motion.duration.extra-long1 | `--md-sys-motion-duration-extra-long1` | 700ms | Rare; usually ambient motion with no user input |
| md.sys.motion.duration.extra-long2 | `--md-sys-motion-duration-extra-long2` | 800ms | ″ |
| md.sys.motion.duration.extra-long3 | `--md-sys-motion-duration-extra-long3` | 900ms | ″ |
| md.sys.motion.duration.extra-long4 | `--md-sys-motion-duration-extra-long4` | 1000ms | Carousel auto-advance (Emphasized) |

### Pairs and rules

| Easing | Duration | Movement |
|---|---|---|
| emphasized | 500ms (long2) | Begins and ends on screen |
| emphasized-decelerate | 400ms (medium4) | Enters the screen |
| emphasized-accelerate | 200ms (short4) | Exits the screen |
| standard | 300ms (medium2) | Begins and ends on screen (utility) |
| standard-decelerate | 250ms (medium1) | Enters (utility) |
| standard-accelerate | 200ms (short4) | Exits (utility) |

- Emphasized is the default for transitions, because it carries the M3 character. Standard suits
  small, frequent, utility moves.
- Pick the easing by how the element relates to the screen: it stays on screen (emphasized), arrives
  (decelerate), leaves for good (accelerate), or leaves but can come back, like a drawer (emphasized:
  it comes to rest just off screen).
- Scale duration with the area covered, so large and small moves feel equally quick.
- Exits are shorter than entrances: an exit needs little attention, an entrance needs focus.
- Durations above 600ms are rare, and mostly for ambient motion the user did not trigger.

## Transition patterns

Transitions link elements or whole views, and Material ranks them first among motion work. Its
pattern pages still specify all six with the legacy pairs above. This skill keeps that for navigation
between screens and views: container transform, forward and backward, lateral and top level. The
enter-and-exit pattern covers components appearing within a screen, which is component motion, so
it may run on springs chosen by the component's size: [a menu](#4-enter-and-exit-with-starting-style)
on fast springs, [a bottom sheet](#2-component-transitions-with-the-shorthands) on default spatial.
The legacy pairs stay a valid choice there too.

| Pattern | Use it for | Motion | Avoid |
|---|---|---|---|
| **Container transform** | Hero moments; an element opening into its detail (card → page, search box → search view, FAB → sheet); shallow expand-then-collapse flows | A persistent container (or hero image) morphs its bounds and corners between states, and its contents swap with a clean fade. Strongest relationship, most dramatic | Deep hierarchies and frequent utility navigation, where it becomes excessive. Use it where drama is earned |
| **Forward and backward** | Moving one level down or up a hierarchy (inbox → thread) | Horizontal slide: Android slides with a fade (short travel), iOS uses parallax. Follow the platform's default | Hero moments (use container transform) |
| **Lateral** | Peers at the same level: tabs, carousels, galleries | The group slides in unison, with no fade and no parallax; hints that swiping works | Hierarchical navigation. Fading while sliding weakens the peer cue and looks like forward/backward |
| **Top level** | Switching navigation bar, rail or drawer destinations | Outgoing screen fades out quickly, then the new one fades in; nothing persists, nothing groups | A lateral slide here implies a swipe that conflicts with carousel or list-item gestures |
| **Enter and exit** | Components appearing within the screen (dialog, menu, snackbar, FAB, tooltip, time picker) or from beyond it (app bars, banners, navigation, sheets) | Expand or collapse along x or y, growing away from the nearest edge: a top menu grows down, a bottom snackbar grows up. Off-screen components slide in from the edge they live on. Android avoids scale and z-axis motion, which imply an elevation change that M3's flatter elevation model does not use. iOS scales in and fades out within the screen, and slides without reshaping from beyond it | Hierarchical navigation, since sliding content the full screen height blurs the relationship between screens |
| **Skeleton loaders** | Content that is loading | Placeholders with a subtle pulse moving top-left to bottom-right; real content fades in quickly on top | Layout shifts when content arrives |

What a good transition does:

- **Respects accessibility settings** (see [Reduced motion](#reduced-motion-and-restraint)).
- **Stays consistent.** The same navigation uses the same transition across the product, and across a
  family of apps.
- **Keeps the layout stable.** No pop-in or shifting.
- **Avoids jump cuts by default.** They are acceptable only where speed matters most, e.g. a menu in a
  productivity tool.
- **Keeps a coherent spatial model.** Entry points stay put (notifications from the top, a navigation
  drawer from the left, sheets from the bottom), and a carousel never flips orientation between states.
  Mirroring the drawer to the start edge in RTL is our inference.
- **Moves in one direction.** Group elements along one primary axis. Only hero elements persist. Many
  independently moving parts compete for attention.
- **Uses clean fades.** Fade the outgoing content out fully before fading the new content in. If a
  cross-fade is unavoidable, keep it short and put it in the fastest part of the movement. Never slowly
  fade a surface such as a bottom sheet over content, and keep dialog fades short.
- **Keeps the style simple.** Transitions are frequent, large and task-oriented, so bouncy springs
  do not belong in everyday navigation. Container transform is the one pattern Material treats as
  dramatic, and it reserves that for contexts that earn it.

## Reduced motion and restraint

**What Material asks.** Most platforms let people reduce animation, often because motion makes them
unwell. When that setting is on, replace intense sliding and scaling with subtle fades, and turn off
decorative effects such as parallax and shape morphing. Our reading: the point is less motion, not no
feedback, since a short fade still tells the user something changed.

**What the token file does** under `@media (prefers-reduced-motion: reduce)`:

- Every spatial helper (`--m3e-motion-spring-{fast,default,slow}-spatial`, plus its `-duration`,
  `-easing`, `-linear`, `-linear-duration` and `-linear-easing` variants) becomes `1ms linear`, or `1ms`
  / `linear` for the split helpers. Moves, resizes and corner morphs jump to their end state. The 1ms
  (not 0) keeps `transitionend` firing, because a zero-length transition never starts.
- Effects helpers are untouched, so fades survive.
- **Not touched:** the legacy `--md-sys-motion-duration-*` and `--md-sys-motion-easing-*` tokens,
  `--m3e-motion-easing-emphasized-linear`, the damping/stiffness numbers (JS springs), View Transitions,
  parallax and other decorative effects. Handle those yourself with the media query or
  `matchMedia('(prefers-reduced-motion: reduce)')`.

**Accessibility baselines.** WCAG 2.3.3 (AAA) says motion triggered by interaction should be possible
to switch off unless it is essential. WCAG 2.2.2 (A) says auto-playing motion longer than 5 s, such as a
carousel auto-advance, needs a pause control.

**Restraint.** Motion highlights key moments and distracts when overused. Do not layer several
expressive tactics on one screen, and keep hero moments to one or two per product. Motion should never
be the only signal of a state or hierarchy change: pair it with color, shape or text.

## Applying it on the web

Load `assets/m3-expressive-tokens.css` before your styles. Everything below uses only the properties
it defines.

### 1. Choose and swap schemes

```html
<!-- Product scheme: omit for expressive (the file's default), or set standard -->
<html lang="en" data-motion-scheme="standard">
  <body>
    <main>…utility UI, calm motion…</main>

    <!-- Hero moment: this subtree alone uses the expressive springs -->
    <section class="welcome-hero" data-motion-scheme="expressive">…</section>
  </body>
</html>
```

```js
// Switch at runtime (e.g. a "reduce playful animation" preference in settings)
document.documentElement.dataset.motionScheme = 'standard';
```

Every helper is redeclared with literal values inside each `[data-motion-scheme]` block, so a subtree
swap reaches all of them. **Cascade caveat:** if you compose your own custom property from a helper on
`:root` (e.g. `--card-motion: transform var(--m3e-motion-spring-default-spatial)`), it resolves on
`:root` and ignores subtree schemes. Reference the helpers directly in the element's `transition`, or
declare the composition on the element itself.

### 2. Component transitions with the shorthands

```css
/* Button: corners tighten on press (spatial) while the state color fades (effects), both fast. */
.m3-button {
  /* Illustrative (component value): an Expressive medium button, which also clears the 48px
     target (--m3e-min-target-size). Exact button specs: https://m3.material.io/components */
  --button-height: 56px;
  block-size: var(--button-height);
  /* Full rounding as half the height in px: animating from corner-full's huge value would keep the
     corners round for most of the animation, then snap. */
  border-radius: calc(var(--button-height) / 2);
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  transition:
    border-radius var(--m3e-motion-spring-fast-spatial),
    background-color var(--m3e-motion-spring-fast-effects),
    color var(--m3e-motion-spring-fast-effects);
}
/* Hover only where a pointer can hover, and never on a disabled button (browsers match :hover there). */
@media (hover: hover) {
  .m3-button:where(:not(:disabled, [aria-disabled="true"])):hover {
    background-color: color-mix(in srgb,
      var(--md-sys-color-on-primary) calc(var(--md-sys-state-hover-state-layer-opacity) * 100%),
      var(--md-sys-color-primary));
  }
}
.m3-button:where(:not(:disabled, [aria-disabled="true"])):active {
  border-radius: var(--md-sys-shape-corner-medium);  /* illustrative press corner for this size */
}
.m3-button:disabled,
.m3-button[aria-disabled="true"] {
  background-color: color-mix(in srgb, var(--md-sys-color-on-surface)
    calc(var(--m3e-state-disabled-container-opacity) * 100%), transparent);
  color: color-mix(in srgb, var(--md-sys-color-on-surface)
    calc(var(--md-sys-state-disabled-state-layer-opacity) * 100%), transparent);
}

/* Bottom sheet (partial screen): default speed for the slide, default effects for the scrim. */
.sheet {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  translate: 0 100%;
  visibility: hidden;                     /* closed: out of the tab order and the a11y tree */
  background-color: var(--md-sys-color-surface-container-low);
  transition:
    translate var(--m3e-motion-spring-default-spatial),
    visibility var(--m3e-motion-spring-default-spatial-duration); /* hides only after the slide */
}
.sheet.is-open { translate: 0 0; visibility: visible; }
/* Surface below the screen edge, so the expressive overshoot never shows a gap. The overshoot is a
   share of the travel (at most 9.48%, on fast spatial) and the sheet travels its own height, so 10%
   of that height always covers it. If the sheet scrolls, scroll an inner element: overflow on the
   sheet itself would clip this block. */
.sheet::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  inset-block-start: 100%;
  block-size: 10%;
  background-color: inherit;
}

.scrim {
  background-color: var(--m3e-scrim);
  opacity: 0;
  pointer-events: none;                   /* a transparent scrim must not catch clicks */
  transition: opacity var(--m3e-motion-spring-default-effects);
}
.scrim.is-open { opacity: 1; pointer-events: auto; }

/* Full-screen panel: slow speed. */
.fullscreen-panel {
  transition:
    translate var(--m3e-motion-spring-slow-spatial),
    opacity var(--m3e-motion-spring-slow-effects);
}
```

For longhands, use the split helpers:

```css
.thumb {
  transition-property: translate;
  transition-duration: var(--m3e-motion-spring-fast-spatial-duration);
  transition-timing-function: var(--m3e-motion-spring-fast-spatial-easing);
}
```

### 3. Upgrade to the linear() traces where supported

If `linear()` is unsupported, a `var()` holding it makes the whole `transition` declaration invalid when
values are computed, and nothing animates. Always keep the official family as the base and switch
inside `@supports`:

```css
.chip {
  transition:
    translate var(--m3e-motion-spring-fast-spatial),
    background-color var(--m3e-motion-spring-fast-effects);
}
@supports (transition-timing-function: linear(0, 1)) {
  .chip {
    transition:
      translate var(--m3e-motion-spring-fast-spatial-linear),
      background-color var(--m3e-motion-spring-fast-effects-linear);
  }
}
```

### 4. Enter and exit with @starting-style

A menu hanging from a top bar grows downward (away from its edge) with a clip reveal, not a scale,
and fades in. Opening a menu is a component entering the screen, not navigation, so springs are fine
here, and a menu is a small surface, so they are the fast ones. Under reduced motion the reveal
becomes 1ms and only the fade remains, which is exactly Material's advice, with no extra code.

```css
.menu[popover] {
  /* Negative side/bottom insets leave room for the elevation shadow. */
  clip-path: inset(0 -24px -24px -24px);
  opacity: 1;
  box-shadow: var(--m3e-elevation-shadow-level2);
  transition:
    clip-path var(--m3e-motion-spring-fast-spatial),
    opacity var(--m3e-motion-spring-fast-effects),
    /* Stay rendered until the fade ends (the element is invisible after that, even if the clip
       is still moving). Tied to effects so reduced motion (spatial = 1ms) keeps the exit fade. */
    display var(--m3e-motion-spring-fast-effects) allow-discrete,
    overlay var(--m3e-motion-spring-fast-effects) allow-discrete;
}
.menu[popover]:not(:popover-open) {
  clip-path: inset(0 -24px 100% -24px);
  opacity: 0;
}
@starting-style {
  .menu[popover]:popover-open {
    clip-path: inset(0 -24px 100% -24px);
    opacity: 0;
  }
}
```

Browsers without `@starting-style` or discrete transitions simply show and hide the menu.

### 5. Screen transitions with the legacy tokens

The legacy pairs in plain CSS, shown on a navigation drawer because it exercises both rules for
direction: decelerate on the way in, and emphasized (not accelerate) on the way out because the drawer
can come back. Route and page changes take the same pairs; for full-page morphs see
[section 10](#10-page-transitions-with-view-transitions-progressive-enhancement).

```css
/* Navigation drawer (can come back, so its exit uses emphasized, not accelerate). */
.drawer {
  --drawer-hidden: -100%;                 /* off the start edge */
  translate: var(--drawer-hidden) 0;
  visibility: hidden;                     /* closed: not focusable or clickable */
  transition:
    translate var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized),
    visibility var(--md-sys-motion-duration-short4);
}
.drawer:dir(rtl) { --drawer-hidden: 100%; }
.drawer.is-open {
  translate: 0 0;
  visibility: visible;
  transition:
    translate var(--md-sys-motion-duration-medium4) var(--md-sys-motion-easing-emphasized-decelerate),
    visibility var(--md-sys-motion-duration-medium4);
}

/* The reduced-motion block in the token file does not reach legacy tokens: swap slide for fade here. */
@media (prefers-reduced-motion: reduce) {
  .drawer,
  .drawer.is-open {
    translate: 0 0;
    transition:
      opacity var(--m3e-motion-spring-default-effects),
      visibility var(--m3e-motion-spring-default-effects);
  }
  .drawer:not(.is-open) { opacity: 0; }
}
```

### 6. WAAPI

The split helpers feed `element.animate()` directly and follow the scheme and reduced-motion state of
the element you read them from:

```js
// family: '' for the official curves, '-linear' for the traces (pick one per product)
const hasLinear = CSS.supports('transition-timing-function', 'linear(0, 1)');
function motionFor(el, speed, type, family = '') {
  if (!hasLinear) family = '';     // animate() throws on an easing it cannot parse
  const cs = getComputedStyle(el);
  const name = `--m3e-motion-spring-${speed}-${type}${family}`;
  return {
    duration: parseFloat(cs.getPropertyValue(`${name}-duration`)), // helpers are always in ms
    easing: cs.getPropertyValue(`${name}-easing`).trim(),
  };
}

const card = document.querySelector('.card');
let running = null;
function slideCardTo(x) {
  if (running) { running.commitStyles(); running.cancel(); } // restart from where it is now
  const anim = card.animate([{ translate: `${x}px 0` }],
    { ...motionFor(card, 'default', 'spatial'), fill: 'forwards' });
  running = anim;
  anim.onfinish = () => { anim.commitStyles(); anim.cancel(); if (running === anim) running = null; };
}
```

WAAPI, like CSS, loses velocity on interruption. For anything the user can grab or re-trigger
mid-flight, use a real spring.

### 7. Interruptible and gesture-driven motion: a JS spring

Read the damping ratio and stiffness tokens from the element, so its scheme (including a subtree
swap) applies; read them again if the scheme can change at runtime. Integrate with small sub-steps, and
on retarget keep position and velocity. This stays within about 0.5 % of the travel distance of the
exact spring. Give the animated property no CSS transition: the spring writes it every frame, and a
transition would trail behind each write.

```js
function springTokens(el, speed, type) {
  const cs = getComputedStyle(el);
  const read = (part) => parseFloat(cs.getPropertyValue(`--md-sys-motion-spring-${speed}-${type}-${part}`));
  return { damping: read('damping'), stiffness: read('stiffness') };
}

// One animated number (px, deg, 0-1 progress). precision is in the same unit.
function createSpring({ damping, stiffness }, value, render, precision = 0.01) {
  const c = 2 * damping * Math.sqrt(stiffness);        // damping coefficient, unit mass
  let x = value, v = 0, target = value, frame = 0, last = 0;
  const tick = (time) => {
    let dt = Math.min((time - last) / 1000, 0.064);     // seconds; cap long frames
    last = time;
    for (; dt > 0; dt -= 0.00025) {                     // 0.25 ms sub-steps
      const h = Math.min(dt, 0.00025);
      v += (-stiffness * (x - target) - c * v) * h;
      x += v * h;
    }
    if (Math.abs(x - target) < precision && Math.abs(v) < precision * 10) {
      x = target; v = 0; frame = 0;                     // settled
    } else {
      frame = requestAnimationFrame(tick);
    }
    render(x);
  };
  return {
    // Retarget: position and velocity carry over, so direction changes stay smooth.
    to(next, velocity = v) {
      target = next; v = velocity;
      if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
    },
    // Snap without animation: finger tracking, reduced motion.
    jump(next) {
      cancelAnimationFrame(frame); frame = 0;
      x = target = next; v = 0; render(x);
    },
  };
}

// Example: a draggable bottom sheet (not the CSS-transitioned .sheet above).
const sheet = document.querySelector('.drag-sheet');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sheetY = createSpring(springTokens(sheet, 'default', 'spatial'), 0,
  (y) => { sheet.style.translate = `0 ${y}px`; });

function onDrag(offsetPx) { sheetY.jump(offsetPx); }            // follow the finger exactly
function onRelease(offsetPx, velocityPxPerSecond) {             // fling keeps its momentum
  const close = offsetPx > sheet.offsetHeight / 2 || velocityPxPerSecond > 1000; // example thresholds
  const target = close ? sheet.offsetHeight : 0;
  if (reduceMotion.matches) sheetY.jump(target);
  else sheetY.to(target, velocityPxPerSecond);
}
```

Gestures such as predictive-back-style previews should track input in real time (`jump`) and hand the
release velocity to the spring (`to`).

### 8. Spring libraries

Libraries name their parameters differently. Convert from the tokens (unit mass):

- **Stiffness:** pass `k` unchanged (`stiffness`, or `tension` in some libraries).
- **Damping ratio** parameters (`dampingRatio`, `dampingFraction`): pass `ζ` unchanged.
- **Damping coefficient** parameters (`damping`, `friction`): pass `c = 2·ζ·√(k·m)`, with `m = 1`.
  Motion's `damping` behaves as a coefficient: at 0 the spring never stops.
- **Period or response** parameters: undamped period = 2π / √k seconds.
- Prefer the stiffness/damping/mass form over "bounce + duration" parameters: each library converts
  those with its own formula, so M3 values only carry over if you follow that formula exactly.
- **Velocity:** usually in the animated unit per second (px/s), but check the library's time unit.
  For a 0–1 progress value, divide the gesture velocity by the distance.

| Spring | k | ζ | c (coefficient) | ωn rad/s |
|---|---|---|---|---|
| Expressive fast spatial | 800 | 0.6 | 33.94 | 28.28 |
| Expressive default spatial | 380 | 0.8 | 31.19 | 19.49 |
| Expressive slow spatial | 200 | 0.8 | 22.63 | 14.14 |
| Standard fast spatial | 1400 | 0.9 | 67.35 | 37.42 |
| Standard default spatial | 700 | 0.9 | 47.62 | 26.46 |
| Standard slow spatial | 300 | 0.9 | 31.18 | 17.32 |
| fast effects (both) | 3800 | 1 | 123.29 | 61.64 |
| default effects (both) | 1600 | 1 | 80.00 | 40.00 |
| slow effects (both) | 800 | 1 | 56.57 | 28.28 |

```js
// Library-neutral options object for a coefficient-based API (e.g. Motion's spring options)
const { damping: zeta, stiffness: k } = springTokens(document.querySelector('.card'), 'default', 'spatial');
const springOptions = { stiffness: k, damping: 2 * zeta * Math.sqrt(k), mass: 1 };
```

Check each library's documentation for which convention it uses before mapping.

### 9. Custom scheme on the web

A custom scheme is another `data-motion-scheme` value that redefines the spatial springs. No official
curve exists for custom numbers, so point both helper families at a generated `linear()` trace. Wrap the
block in `@supports` (older browsers keep the parent scheme) and in `no-preference` (so the token file's
reduced-motion overrides still win). Values below are the blog's "playful" spatial springs, traced
with `springToLinear()` further down:

```css
@supports (transition-timing-function: linear(0, 1)) {
  @media (prefers-reduced-motion: no-preference) {
    [data-motion-scheme="playful"] {
      --md-sys-motion-spring-fast-spatial-damping: 0.6;
      --md-sys-motion-spring-fast-spatial-stiffness: 1400;
      --m3e-motion-spring-fast-spatial-linear-duration: 280ms;
      --m3e-motion-spring-fast-spatial-linear-easing: linear(0, 0.006 1.07%, 0.023 2.14%, 0.0599 3.57%, 0.11 5%, 0.1863 6.79%, 0.3274 9.64%, 0.5845 14.64%, 0.7015 17.14%, 0.8044 19.64%, 0.8797 21.79%, 0.9424 23.93%, 1.0002 26.43%, 1.0423 28.93%, 1.0707 31.43%, 1.0887 34.29%, 1.0947 37.86%, 1.0843 42.5%, 1.0172 57.5%, 0.9975 65.36%, 0.991 75.36%, 1);
      --m3e-motion-spring-fast-spatial-linear: var(--m3e-motion-spring-fast-spatial-linear-duration) var(--m3e-motion-spring-fast-spatial-linear-easing);
      --m3e-motion-spring-fast-spatial-duration: var(--m3e-motion-spring-fast-spatial-linear-duration);
      --m3e-motion-spring-fast-spatial-easing: var(--m3e-motion-spring-fast-spatial-linear-easing);
      --m3e-motion-spring-fast-spatial: var(--m3e-motion-spring-fast-spatial-linear);

      --md-sys-motion-spring-default-spatial-damping: 0.6;
      --md-sys-motion-spring-default-spatial-stiffness: 700;
      --m3e-motion-spring-default-spatial-linear-duration: 390ms;
      --m3e-motion-spring-default-spatial-linear-easing: linear(0, 0.0083 1.28%, 0.0314 2.56%, 0.0751 4.1%, 0.143 5.9%, 0.2483 8.21%, 0.5847 14.87%, 0.7139 17.69%, 0.8065 20%, 0.8856 22.31%, 0.9506 24.62%, 1.0019 26.92%, 1.0439 29.49%, 1.074 32.31%, 1.0908 35.38%, 1.0944 38.97%, 1.0817 43.85%, 1.0178 58.21%, 0.9978 66.15%, 0.991 76.15%, 1);
      --m3e-motion-spring-default-spatial-linear: var(--m3e-motion-spring-default-spatial-linear-duration) var(--m3e-motion-spring-default-spatial-linear-easing);
      --m3e-motion-spring-default-spatial-duration: var(--m3e-motion-spring-default-spatial-linear-duration);
      --m3e-motion-spring-default-spatial-easing: var(--m3e-motion-spring-default-spatial-linear-easing);
      --m3e-motion-spring-default-spatial: var(--m3e-motion-spring-default-spatial-linear);

      --md-sys-motion-spring-slow-spatial-damping: 0.6;
      --md-sys-motion-spring-slow-spatial-stiffness: 300;
      --m3e-motion-spring-slow-spatial-linear-duration: 590ms;
      --m3e-motion-spring-slow-spatial-linear-easing: linear(0, 0.007 1.19%, 0.0303 2.54%, 0.0726 4.07%, 0.1351 5.76%, 0.233 7.97%, 0.5961 15.25%, 0.7182 17.97%, 0.818 20.51%, 0.8964 22.88%, 0.9604 25.25%, 1.0132 27.8%, 1.0532 30.51%, 1.0795 33.39%, 1.093 36.61%, 1.0925 40.68%, 1.0717 46.61%, 1.0189 58.47%, 0.9981 66.61%, 0.991 76.61%, 1);
      --m3e-motion-spring-slow-spatial-linear: var(--m3e-motion-spring-slow-spatial-linear-duration) var(--m3e-motion-spring-slow-spatial-linear-easing);
      --m3e-motion-spring-slow-spatial-duration: var(--m3e-motion-spring-slow-spatial-linear-duration);
      --m3e-motion-spring-slow-spatial-easing: var(--m3e-motion-spring-slow-spatial-linear-easing);
      --m3e-motion-spring-slow-spatial: var(--m3e-motion-spring-slow-spatial-linear);
    }
  }
}
```

Under reduced motion the playful block does not apply, so `damping`/`stiffness` fall back to the
parent scheme. JS springs must check `matchMedia` themselves in any case.

Generate traces for any damping ratio and stiffness (run it at build time, or at runtime for WAAPI).
With the M3 token values it reproduces the shipped durations exactly, and like the shipped traces it
stays within about 0.002 of the exact spring:

```js
// Position of a unit-mass spring released from rest at 0 toward 1 (t in seconds).
function springAt(damping, stiffness, t) {
  const w = Math.sqrt(stiffness), z = damping;
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
  }
  if (z === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const s = w * Math.sqrt(z * z - 1), r1 = -z * w + s, r2 = -z * w - s;
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

// { duration (ms), easing: 'linear(…)' }; ends once within 0.1 % of the target.
function springToLinear(damping, stiffness, tolerance = 0.002) {
  const y = [];                                          // one sample per ms, up to 5 s
  for (let ms = 0; ms <= 5000; ms++) y.push(springAt(damping, stiffness, ms / 1000));
  let end = 0;
  y.forEach((v, ms) => { if (Math.abs(v - 1) > 0.001) end = ms; });
  const total = Math.min(Math.ceil((end + 1) / 10) * 10, 5000); // round up to 10 ms; cap at 5 s
  const pts = y.slice(0, total + 1).map((v, ms) => [ms / total, v]);
  pts[total][1] = 1;
  const kept = [pts[0]];
  let a = 0;
  for (let j = 2; j <= total; j++) {                     // keep only points a straight line cannot replace
    const [ta, ya] = pts[a], [tj, yj] = pts[j];
    const fits = pts.slice(a + 1, j).every(([t, v]) =>
      Math.abs(ya + (yj - ya) * (t - ta) / (tj - ta) - v) <= tolerance);
    if (!fits) kept.push(pts[a = j - 1]);
  }
  kept.push(pts[total]);
  const stops = kept.map(([t, v], i) => (i === 0 || i === kept.length - 1)
    ? String(+v.toFixed(4)) : `${+v.toFixed(4)} ${+(t * 100).toFixed(2)}%`);
  return { duration: total, easing: `linear(${stops.join(', ')})` };
}

// springToLinear(0.6, 700) -> { duration: 390, easing: 'linear(0, 0.0083 1.28%, …, 1)' }
```

### 10. Page transitions with View Transitions (progressive enhancement)

Same-document `document.startViewTransition()` has been Baseline (newly available) since October 2025.
Treat it as an enhancement: without it, the DOM just updates. It suits navigation (container transform,
top-level fades) but not gestures. Starting a new view transition skips the running one, and nothing
carries velocity.

```js
// Container transform: a card opens into its detail view.
function openDetail(card, renderDetail) {
  if (!document.startViewTransition) { renderDetail(); return; }
  card.style.viewTransitionName = 'hero';            // names must be unique while captured
  document.startViewTransition(() => {
    card.style.viewTransitionName = '';
    renderDetail();                                  // the detail container gets .detail (named below)
  });
}
```

```css
.detail { view-transition-name: hero; }

/* The container morphs its bounds with the legacy emphasized pair (card to full screen: 500ms). */
::view-transition-group(hero) {
  animation-duration: var(--md-sys-motion-duration-long2);
  animation-timing-function: var(--md-sys-motion-easing-emphasized);
}
@supports (animation-timing-function: linear(0, 1)) {
  ::view-transition-group(hero) {
    animation-timing-function: var(--m3e-motion-easing-emphasized-linear);
  }
}

/* Clean fade (our timing): old content is gone before new content appears, during the fast early part. */
::view-transition-old(hero) {
  animation-duration: var(--md-sys-motion-duration-short2);
  animation-timing-function: var(--md-sys-motion-easing-standard-accelerate);
}
::view-transition-new(hero) {
  animation-delay: var(--md-sys-motion-duration-short2);
  animation-duration: var(--md-sys-motion-duration-short4);
  animation-timing-function: var(--md-sys-motion-easing-standard-decelerate);
  animation-fill-mode: both;
}

/* Reduced motion: no morph; the container jumps and the contents only cross-fade.
   Spatial helpers are 1ms under reduced motion, so the group reuses one instead of a literal. */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(hero) { animation-duration: var(--m3e-motion-spring-default-spatial-duration); }
  ::view-transition-old(hero),
  ::view-transition-new(hero) {
    animation-delay: 0s;
    animation-duration: var(--m3e-motion-spring-default-effects-duration);
  }
}
```

Named pseudo-elements such as `(hero)` outrank `(*)`, so write overrides against the same name. The
browser's default root transition is a simultaneous cross-fade, while the top-level pattern fades the
old screen out and only then fades the new one in. For top-level navigation, give
`::view-transition-old(root)` and `::view-transition-new(root)` the same staggered timing as the
`(hero)` pair above.

## Do and don't

- **Do** animate position, size, rotation, corner radius and clip with spatial helpers, and color and
  opacity with effects helpers. **Don't** put an overshooting (spatial) curve on opacity or color: the
  value clips or flashes an off-target color.
- **Do** choose one scheme for the product and swap it only for a named reason (a hero moment, a dense
  utility area). **Don't** hand-tune bounce per component, because inconsistent motion reads as bugs.
- **Do** choose the speed by size and travel (fast for small parts, slow for full screen). **Don't**
  put a full-screen change on a fast spring or a toggle on a slow one: one feels abrupt, the other
  sluggish. Slowing a spring to make something feel important has the same effect.
- **Do** run a JS spring (tokens → damping and stiffness) for drags, flings and rapid re-toggles.
  **Don't** rely on CSS transitions there: they drop velocity and kink on reversal.
- **Do** keep screen-to-screen navigation on the legacy emphasized/standard pairs. **Don't** bounce
  common page transitions, which are frequent and large enough that style gets in the way.
- **Do** use `--m3e-motion-easing-emphasized-linear` (under `@supports`) for a true emphasized curve.
  **Don't** assume `--md-sys-motion-easing-emphasized` is emphasized on the web: it holds the Standard
  curve.
- **Do** keep the official cubic-bezier helpers as the base and switch to `-linear` inside `@supports`.
  **Don't** ship a bare `linear()` helper in a `transition`: where it is unsupported, the whole
  declaration drops and nothing animates.
- **Do** animate `border-radius` between real px values (half the height for "full"). **Don't**
  animate from `9999px`: the corners stay round for most of the animation, then snap.
- **Do** keep a short fade under reduced motion. **Don't** remove all feedback, because users still
  need to see that something changed.
- **Do** use the helpers directly in each element's `transition`. **Don't** bake them into your own
  `:root` custom properties if you swap schemes on subtrees: they resolve once at the root.
- **Do** give edge-attached surfaces extra background past the edge, with an `::after` block or extra
  padding in the surface color. **Don't** let an expressive overshoot expose a gap under a sheet or
  drawer, and don't paint that extension with `box-shadow`: shadows are reserved for the six elevation
  levels, so an audit can't tell a fake one from a real one.
- **Do** cap hero moments at one or two per product. **Don't** stack shape morph, bounce and
  parallax on one screen.

## Auditing

The consolidated list lives in `references/audit-checklist.md`. Motion-specific checks:

1. **Tokenized:** does every `transition`, `animation`, `animate()` and JS spring use a motion helper,
   legacy token or the damping/stiffness tokens, with no ad-hoc `0.3s ease` or unexplained
   `cubic-bezier()`?
2. **Spatial vs effects:** are color, opacity, filter and shadow on `*-effects*` helpers, and are
   transform, size, inset, radius and clip on `*-spatial*` helpers? One exception passes: plain
   (non-toggle) button press morphs on default effects, if the whole product uses that choice.
3. **Speed by size:** are small controls on fast, partial-screen surfaces on default and full-screen
   changes on slow, with no spring slowed just because its element is important?
4. **One scheme:** is a single `data-motion-scheme` set product-wide (or omitted for expressive), with
   subtree swaps only on deliberate hero or utility regions?
5. **Interruptible motion:** do drags, flings and rapidly re-triggered animations use a
   velocity-preserving spring rather than CSS or WAAPI curves?
6. **Navigation transitions:** do page and route transitions use the legacy pairs (e.g. 500ms
   emphasized, 400ms emphasized-decelerate in, 200ms emphasized-accelerate out), with no bounce, exits
   shorter than entrances, and the pattern that fits the relationship (lateral for peers, fade-through
   for top level, container transform for hero expands)?
7. **Clean fades:** does outgoing content finish fading before incoming content appears, with no
   slow fades of sheets or dialogs over content?
8. **Reduced motion:** with `prefers-reduced-motion: reduce` emulated, do slides and scales become
   fades, parallax and shape morph stop, JS springs jump, and View Transitions stop morphing, while
   state changes stay visible?
9. **Fallbacks:** is every `-linear` helper, and `--m3e-motion-easing-emphasized-linear`, used only
   inside `@supports (… linear(0, 1))` with a cubic-bezier base outside?
10. **Restraint:** is there at most one or two hero moments, and is motion never the only cue for a
    state change?

## Sources

- Motion overview / how it works: https://m3.material.io/styles/motion/overview/how-it-works
- Motion specs (web spring-to-curve table, token widget): https://m3.material.io/styles/motion/overview/specs
- Easing and duration: https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration
- Easing and duration tokens: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
- Transition patterns: https://m3.material.io/styles/motion/transitions/transition-patterns
- Applying transitions: https://m3.material.io/styles/motion/transitions/applying-transitions
- Blog, motion physics with Compose (May 2025): https://m3.material.io/blog/m3-expressive-motion-theming
- Blog, building with M3 Expressive (hero moments): https://m3.material.io/blog/building-with-m3-expressive
- Blog, choosing the right transitions (2022 research): https://m3.material.io/blog/motion-research-container-transform
- Gestures: https://m3.material.io/foundations/interaction/gestures
- Usability (restraint): https://m3.material.io/foundations/usability
- Structure (motion as one of several hierarchy cues): https://m3.material.io/foundations/designing/structure
- Shape morph: https://m3.material.io/styles/shape/shape-morph
- Material on the web (maintenance mode): https://m3.material.io/develop/web
- MDC-Android motion docs: https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md
- CSS `linear()` easing: https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear
- CSS Transitions Level 1 (interruption, reversing): https://drafts.csswg.org/css-transitions-1/
- `@starting-style`: https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- `Animation.commitStyles()`: https://developer.mozilla.org/en-US/docs/Web/API/Animation/commitStyles
- `Document.startViewTransition()`: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
- WCAG 2.3.3 Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Motion (JS library) spring options: https://motion.dev/docs/spring
