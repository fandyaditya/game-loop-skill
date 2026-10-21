---
name: game-slice
description: >-
  Use when implementing the next playable change in a game. One slice only:
  what the player can newly do, the smallest code edit, then hand off to
  game-assets and game-judge. Use instead of rewriting the whole game.
---

# Game slice

## The slice

State one sentence: what the player can do when this change is done that they could not do before.

If the request is bigger than that, write a short ordered list and build only the first item that is playable on its own. Stop after that item.

## While editing

- Touch only files this slice needs.
- Reuse the input, camera, and scene that already exist. Do not add a second player controller.
- Under a chase camera, A turns left and D turns right.
- Keep the frame loop light. No unbounded work each frame.
- Prefer the engine already in the repo. Do not install Unity, Unreal, Blender, or a local model.

## Then

- If the player will see or hear something new, follow `game-assets` before you finish the edit.
- Run `game-judge` before you claim the slice works.
- If the judge fails because this slice made it worse, follow `game-rollback`.
- Tell the user the sentence, how to try it, and stop.
