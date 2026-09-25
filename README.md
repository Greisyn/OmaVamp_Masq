# Vampire Sheet — bar-icon Omarchy plugin

Bar-icon-driven VTM20 neonate character sheet editor, in the style of
`io.github.i12bp8.oshelf` / `local.cliamp-dock`. Cloned from OmaWolf_Apoc
(local.werewolf-sheet) with Vampire: The Masquerade 20th fields.

## Install
```bash
omarchy plugin add https://github.com/Greisyn/OmaVamp_Masq.git --enable
```

- **identity header**:  (Name/Player/Chronicle/Nature/Demeanor/Concept/Clan/Generation/Sire), Attributes, Talents/Skills/Knowledges, Virtues/pools, Disciplines/Backgrounds/notes.
- **Export plain text for LLM roleplay**: VTM20 format (`VAMPIRE: THE MASQUERADE 20th - CHARACTER SHEET`).
- **Bar icon only, no floating anchor**: left-click the bar icon toggles the
  sheet card, right-click opens settings. Both cards stay open — no
  hover-dwell, no auto-collapse, no click-off dismiss on the sheet. The sheet
  closes via its X (or Esc / bar toggle); pin blocks closing entirely until
  unpinned. Settings closes itself a few moments after the mouse leaves it
  (or instantly on an outside click) — or via its Close button / another
  right-click.
- **Card placement**: parks in a screen corner (TL/TR/BL/BR) + size in
  settings (minimum 600 × 550) — or drag the card by its header to float it
  anywhere on the workspace; the drop position is saved and corner buttons
  snap it back.
- **Abilities in columns**: Talents | Skills | Knowledges sit side by side
  under an ABILITIES section title, with compact −/+ steppers instead of
  full-width buttons. Attributes group the same way under Physical | Social
  | Mental. Section titles are large with an underline, sub titles a step
  smaller.
- **Field search**: the bar above the sheet filters entry spots by name —
  matching rows stay bright while the rest dim. Enter jumps to the next
  match with a highlight flash (Shift+Enter goes back), Esc clears the query.
- **Output path is configurable**: settings panel + sheet footer. Default:
  `~/Pictures/<Name>.txt` (one file per character)
- **Theme-aware**: all chrome uses `Color.*` / `Style.*` — omarchy themes repaint it live.
- **Logo**: `Vampire20Logo.png` from `~/Pictures` at the top of
  the card and settings panel (`logo.png`); V icon as the bar symbol
  (`anchor-icon.png`, from `~/Pictures/Vicon.png`). To swap art later, replace
  those two files and run `omarchy-shell shell rescanPlugins`.

## VTM20 field map (from `20th Neonate Interactive.pdf`)

- Identity: Name, Player, Chronicle, Nature, Demeanor, Concept, Clan, Generation, Sire
- Attributes: Strength/Dexterity/Stamina, Charisma/Manipulation/Appearance, Perception/Intelligence/Wits (1-5)
- Talents: Alertness, Athletics, Awareness, Brawl, Empathy, Expression, Intimidation, Leadership, Streetwise, Subterfuge
- Skills: Animal Ken, Crafts, Drive, Etiquette, Firearms, Larceny, Melee, Performance, Stealth, Survival
- Knowledges: Academics, Computer, Finance, Investigation, Law, Medicine, Occult, Politics, Science, Technology
- Virtues (0-5): Conscience/Conviction, Self-Control/Instinct, Courage
- Pools: Humanity/Path (0-10), Willpower (0-10), Blood Pool (0-20), Experience (0-10)
- Texts: Backgrounds, Disciplines, Rituals/Paths, Merits, Flaws, Other Traits, Combat, Gear, History, Appearance, Personality, Goals, Clan Weakness, OOC

## Files

- `manifest.json` — service + bar-widget
- `SheetService.qml` — character data, JSON persistence, export, per-screen windows, IPC
- `SheetWindow.qml` — sheet editor card (logo-only header, icon pin/close actions)
- `SheetGlyph.qml` / `SheetAction.qml` — theme-aware line-icon buttons (pin/close/check style)
- `SheetConfig.qml` — card corner/size/motion/output prefs → `~/.config/omarchy/local.vampire-sheet.json`
- `Sheet.js` — field lists + plain-text renderer
- `BarWidget.qml` — bar icon (left = toggle sheet, right = settings)
- `Panel.qml` — settings (card placement, size, output path, motion)
- `logo.png` — Vampire 20th logo from the PDF
- `anchor-icon.png` — V icon for the bar (`~/Pictures/Vicon.png`)

## Actions

- **Export .txt / Copy for LLM** — filled buttons in the card's CHARACTER FILE
  section; exports save as `<Name>.txt` inside the configured output folder so
  each character gets its own file.
  Every text row has a ✓ Set button that commits exactly what's visible, and
  Export/Copy auto-commit all fields first — typed text is never lost even if
  you never tabbed out of the field.
- **Import** — paste the path of an exported sheet and press Import to load it
  back. Also via `omarchy-shell local.vampire-sheet importSheet`
  (uses the settings' import path).
- **Clear…** — asks “Clear the entire sheet? …” via a confirmation dialog, then
  resets to a true blank sheet: empty fields, Attributes 1 (V20 minimum),
  all Abilities and pools 0.
- **Scrolling** — mouse wheel / touchpad, drag the always-on scrollbar,
  or PageUp / PageDown when the card is focused.

## Note: developing this plugin

Hot-reload (`shell rescanPlugins` / file watcher) reliably picks up
`SheetWindow.qml` / `Panel.qml` / `BarWidget.qml` changes, but does **not**
reliably re-create the long-running `SheetService` — after editing
`SheetService.qml` (or `Sheet.js` behavior), run:

```bash
omarchy restart shell
```

## State

- Character JSON: `~/.config/omarchy/local.vampire-sheet-character.json`
- Prefs JSON: `~/.config/omarchy/local.vampire-sheet.json`
- Export default: `~/Pictures/<Name>.txt` (one file per character)

## Commands

```bash
omarchy-shell local.vampire-sheet show
omarchy-shell local.vampire-sheet hide
omarchy-shell local.vampire-sheet toggle
omarchy-shell local.vampire-sheet exportSheet
omarchy-shell local.vampire-sheet status
omarchy-shell shell rescanPlugins
omarchy restart shell
```

## Uninstall
```bash
omarchy plugin remove local.vampire-sheet
```
