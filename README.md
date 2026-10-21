# game-loop

One plugin, two harnesses. Claude Code and Codex load the same skills, the same commands, and the same session hook.

This is the part of a desktop AI game studio worth keeping, not the Electron app.

| Studio piece | Skill and command |
| --- | --- |
| One playable change, then stop | `game-slice` |
| Art, models, and audio instead of placeholders | `game-assets` |
| Look at the running game before saying it works | `game-judge` |
| Undo a slice that got worse, only your own files | `game-rollback` |
| Which of those to run | `game-loop` |
| Live preview app, agent swarms, local models | left out |

Asset files still come from [Genex](https://genex.games/SKILL.md). This plugin tells the agent when to call it.

## Claude Code

```
/plugin marketplace add fandyaditya/game-loop-skill
/plugin install game-loop@game-loop
```

Then `/game-slice`, `/game-assets`, `/game-judge`, `/game-rollback`, or `/game-loop`.

Manifest: [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json). It points at `skills/`, `commands/`, and `hooks/hooks.json`.

## Codex

```
codex plugin add fandyaditya/game-loop-skill
```

Then `$game-slice`, `$game-assets`, `$game-judge`, `$game-rollback`, or `$game-loop`.

Manifest: [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json). Same `skills/` and the same `hooks/hooks.json` as Claude Code.

## Layout

```
.claude-plugin/plugin.json   Claude Code manifest
.codex-plugin/plugin.json    Codex manifest
hooks/hooks.json             shared session reminder
commands/                    slash commands, one per skill
skills/game-slice/
skills/game-assets/
skills/game-judge/
skills/game-rollback/
skills/game-loop/
```
