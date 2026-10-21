# game-loop

One plugin for Claude Code and Codex. Same skills, same commands, same hook.

Pick a dimension once, then stay there.

| | 2D | 3D |
| --- | --- | --- |
| Skill | `game-2d` | `game-3d` |
| View | side-on or top-down, no perspective | chase or first-person camera |
| Art | sprites, tiles, SVG | meshes already in the repo |
| Input | left and right on the plane, jump if the game has one | A turns left under a chase camera |

Shared loop, either dimension:

| Step | Skill |
| --- | --- |
| One playable change, then stop | `game-slice` |
| Files in the project, no asset API | `game-assets` |
| Run the game before saying it works | `game-judge` |
| Undo a worse slice, only your own files | `game-rollback` |

## The $1 3D pass

`game-cheap` is the only paid path. It takes a GLB you already have and does the three jobs, in this order, on Tripo's API directly:

| Job | Call | Cost |
| --- | --- | --- |
| Split the mesh | default segment | $0.40 |
| Skeleton | rig check is free, then one auto-rig | $0.25 |
| One motion | one in-place preset clip | $0.10 |

That is $0.75. The script stops at $1 for the project. Meshy's rig is $0.10 a call, but its API starts at a $20 plan, so it does not fit this budget.

```
TRIPO_API_KEY=... node scripts/cheap.mjs run mesh.glb
```

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

Claude: `/game-2d` or `/game-3d`, then `/game-slice`. `/game-cheap` only for the $1 pass.

Codex uses `$` on the same names.
