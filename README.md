# M3 Expressive Foundations — a Claude Code skill

A [Claude Code](https://docs.claude.com/en/docs/claude-code) skill that teaches Claude the **Material 3 Expressive**
design foundations for the web, in any framework (Angular, React, Vue, Svelte, Lit or plain HTML/CSS), with a drop-in
CSS token file.

Use it to build, theme, restyle or **audit** a UI to Material 3 / M3 Expressive. Claude picks it up on its own when a
request is about Material design ("make it look like Material", "audit this dialog against M3", "set up dark mode
and contrast levels").

> Unofficial. Not affiliated with or endorsed by Google. See [NOTICE](NOTICE).

## What it covers

Foundations only — the rules every component is built from, not individual component specs:

- **Color** — roles and on-role pairs, dark mode, standard/medium/high contrast, seed and brand schemes
- **Typography** — the type scale and emphasized styles, typefaces, tall scripts
- **Shape** — the corner-radius scale, the 35-shape library, shape morphing
- **Motion** — spring motion and easing, reduced motion
- **Elevation** — the six levels, shadows and scrims
- **Interaction states** — state layers, focus rings, touch targets
- **Layout** — breakpoints (window size classes), panes, margins, the spacing scale
- **Expression** — how much expression a screen should carry, and where its hero moments go

## What's inside

| Path | What it is |
|---|---|
| `SKILL.md` | Entry point: principles, when to use it, how to build or audit |
| `references/*.md` | One reference per foundation, a quick reference of exact values, and an audit checklist with console snippets |
| `assets/m3-expressive-tokens.css` | Every token and web helper as CSS custom properties (light/dark, three contrast levels, two motion schemes) |
| `assets/material-shapes.*` | The shape library as CSS `shape()` values, SVG clip paths and raw JSON |
| `scripts/generate-scheme.mjs` | Generates a color scheme from a seed or brand color (needs `@material/material-color-utilities`) |

## Install

Clone it into your Claude Code skills folder.

**For all your projects (user-level):**

```bash
# macOS / Linux
git clone https://github.com/shimonsalamon/m3-expressive-foundations.git ~/.claude/skills/m3-expressive-foundations

# Windows (PowerShell)
git clone https://github.com/shimonsalamon/m3-expressive-foundations.git "$env:USERPROFILE\.claude\skills\m3-expressive-foundations"
```

**For one project only:** clone it into `.claude/skills/m3-expressive-foundations` inside the project instead.

Start a new Claude Code session and it's listed among the available skills. To update, `git pull` in that folder.

## Use

Just ask — Claude loads the skill when the task matches. For example:

- "Use the m3-expressive-foundations skill to audit this dialog."
- "Restyle the settings page to Material 3, with dark mode and medium/high contrast."
- "Generate a Material 3 color scheme from our brand color #1A73E8."

For an audit, the skill runs a 12-check **Quick audit** (contrast, focus ring, targets, reduced motion, color roles,
role pairs, primary action, breakpoints, type scale, corner radii, shadows, state layers) and reports each check as
Pass, Fail, N/A or Not verified, with a severity and a token-based fix.

## License

[Apache-2.0](LICENSE). Third-party material and attributions are listed in [NOTICE](NOTICE).
