---
name: game-slice
description: >-
  Use when implementing the next playable change in a 2D or 3D game. One
  slice only, using the dimension skill already chosen, then assets and a
  judge. Use instead of rewriting the whole game.
---

# Game slice

## The slice

State one sentence: what the player can do when this change is done that they could not do before.

If the request is bigger than that, write a short ordered list and build only the first item that is playable on its own. Stop after that item.

## While editing

- Follow `game-2d` or `game-3d`, the one this project already is. Do not apply the other.
- Touch only files this slice needs.
- Reuse the input, camera, and scene that already exist. Do not add a second player controller.
- Keep the frame loop light. No unbounded work each frame.
- Prefer the engine already in the repo. Do not install a second engine or a local model.

## Then

- If the player will see or hear something new, follow `game-assets` before you finish the edit.
- Run `game-judge` before you claim the slice works. Include the checks from the dimension skill.
- If the judge fails because this slice made it worse, follow `game-rollback`.
- Tell the user the sentence, how to try it, and stop.
