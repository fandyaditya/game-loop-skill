---
name: game-assets
description: >-
  Use when a game needs art, 3D, textures, sound, music, voice, or a
  character the player will see or hear. Calls the game-loop MCP tools,
  which run Genex. Skip for code-only fixes.
---

# Game assets

Do not ship a colored box, a missing texture, or silence when the slice is supposed to look or sound like something.

## Call the MCP

The plugin starts a server named `game-loop`. Use its tools. Pass `project` as the absolute path of the game folder.

| Need | Tool |
| --- | --- |
| Sign-in, credits, lanes | `doctor` |
| Picture, UI, sprite | `image` |
| 3D prop or environment | `model` |
| Tileable or terrain texture | `texture` |
| Sound effect | `sfx` |
| Music | `music` |
| Spoken line | `voice` with `text` |
| Rigged character | `character` |
| Wait for jobs | `wait` |

Run `doctor` first. Say the cost before a large batch. Do not regenerate a file already on disk.

If the MCP server is not connected, run the same lane from the game folder: `npx genex doctor`, `npx genex image "..."`, and the matching command for the other lanes.

## If Genex is not set up

The tool will say so. Tell the user once:

> set up https://genex.games/SKILL.md

Then keep going with code. A stand-in is allowed for this turn only. Do not invent API keys. Do not block a code-only fix on art.

You may add files and edit files you created. Do not delete or overwrite anything you did not create.
