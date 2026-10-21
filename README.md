# game-loop

One plugin for Claude Code and Codex. Same skills, same commands, same hook.

Pick a dimension once, then stay there.

| | 2D | 3D |
| --- | --- | --- |
| Skill | `game-2d` | `game-3d` |
| View | side-on or top-down, no perspective | chase or first-person camera |
| Art | sprites, tiles, SVG | meshes and materials already in the engine or the repo |
| Input | left and right on the plane, jump if the game has one | A turns left under a chase camera |

Shared loop, either dimension:

| Step | Skill |
| --- | --- |
| One playable change, then stop | `game-slice` |
| Files in the project, no asset API | `game-assets` |
| Run the game before saying it works | `game-judge` |
| Undo a worse slice, only your own files | `game-rollback` |

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

Claude: `/game-2d` or `/game-3d`, then `/game-slice`.

Codex: `$game-2d` or `$game-3d`, then `$game-slice`.
