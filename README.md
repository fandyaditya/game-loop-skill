# game-loop

A Codex plugin, and the same skills for Claude Code.

This is the part of a desktop AI game studio that is worth keeping, and not the Electron app that makes an 8 GB Mac struggle.

| Studio piece | Here |
| --- | --- |
| One playable change, then stop | `game-slice` |
| Art, models, and audio instead of placeholders | `game-assets` |
| Look at the running game before saying it works | `game-judge` |
| Undo a slice that got worse, and only your own files | `game-rollback` |
| Live preview app, agent swarms, local models | left out |

Asset files still come from [Genex](https://genex.games/SKILL.md). This plugin tells the agent when to call it. It does not reimplement the generators.

## Codex

The plugin manifest is [`.codex-plugin/plugin.json`](.codex-plugin/plugin.json). It points at `skills/` and a session hook, same shape as a Codex plugin, not a lone skill file.

```
codex plugin add fandyaditya/game-loop-skill
```

Then `$game-slice`, `$game-assets`, `$game-judge`, or `$game-rollback`.

## Claude Code

```
/plugin marketplace add fandyaditya/game-loop-skill
/plugin install game-loop@game-loop
```

## Layout

```
.codex-plugin/plugin.json    Codex plugin manifest
.claude-plugin/              Claude marketplace + plugin manifest
hooks/hooks.json             session reminder, no extra agent
skills/game-slice/
skills/game-assets/
skills/game-judge/
skills/game-rollback/
skills/game-loop/            which of the four to run
```
