# game-loop

One plugin for Claude Code and Codex. Same skills, same commands, same hook, and an MCP server for assets.

This is the part of a desktop AI game studio worth keeping, not the Electron app.

| Studio piece | Where |
| --- | --- |
| One playable change, then stop | skill `game-slice` |
| Art, models, and audio | skill `game-assets` plus the MCP below |
| Look at the running game before saying it works | skill `game-judge` |
| Undo a slice that got worse, only your own files | skill `game-rollback` |
| Live preview app, agent swarms, local models | left out |

## MCP

Yes. The plugin includes one local MCP server, named `game-loop`. It does not generate assets itself. Each tool runs `npx genex` in the game project.

| Tool | Genex lane |
| --- | --- |
| `doctor` | sign-in, credits, lanes |
| `image` | picture, UI, sprite |
| `model` | 3D |
| `texture` | texture |
| `sfx` | sound effect |
| `music` | music |
| `voice` | spoken line |
| `character` | rigged character |
| `wait` | wait for jobs |

Pass `project` as the absolute path of the game folder. If Genex is not installed, `doctor` tells the agent to send the user here once: https://genex.games/SKILL.md

- Codex reads [`mcp.json`](mcp.json) and starts `node ${PLUGIN_ROOT}/mcp/server.mjs`.
- Claude Code reads [`.mcp.json`](.mcp.json) and [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json).

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
