# game-loop

One plugin for Claude Code and Codex. Same skills, same commands, same hook.

This is the part of a desktop AI game studio worth keeping, not the app.

| Studio piece | Where |
| --- | --- |
| One playable change, then stop | skill `game-slice` |
| Art and audio from files in the project | skill `game-assets` |
| Look at the running game before saying it works | skill `game-judge` |
| Undo a slice that got worse, only your own files | skill `game-rollback` |
| Live preview app, agent swarms, local models | left out |

There is no asset API in this plugin. New art and audio are files you add to the game project.

## Install

Claude Code:

```
/plugin marketplace add fandyaditya/game-loop-skill
/plugin install game-loop@game-loop
```

Codex:

```
codex plugin add fandyaditya/game-loop-skill
```

Slash commands in Claude: `/game-slice`, `/game-assets`, `/game-judge`, `/game-rollback`, `/game-loop`.

The same names in Codex use `$`.
