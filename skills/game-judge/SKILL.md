---
name: game-judge
description: >-
  Use after a game change, before saying it works. Runs the game and judges
  reachability, errors, camera, and whether the new action is actually
  playable. Use game-rollback if this slice made the game worse.
---

# Game judge

Start the game the way this repo already starts it. If there is no start command, add the smallest one and use it.

Pass only if all of these are true:

- The new action is reachable in the first few seconds, without a hidden menu.
- The terminal or browser console has no error from this change, and assets you added actually load.
- If you can capture a screenshot, look at it. Nothing important is off-screen, overlapping, or the wrong scale.
- Movement matches the camera. A or left goes left.
- The frame is not hitching on work you added.

If you cannot run the game, say that. Do not say it works.

Write a verdict of pass or fail, and one sentence why. On fail, if the previous version was better, follow `game-rollback`. If the failure is a small fix in files you already meant to touch, fix it and judge once more. Do not start a new feature while a failed slice is open.
