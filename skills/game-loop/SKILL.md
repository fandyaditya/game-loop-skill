---
name: game-loop
description: >-
  Entry for the game-loop plugin. Use when building or changing a game in
  Codex or Claude Code. Picks 2D or 3D once, then one slice, assets, a
  playtest judge, and rollback.
---

# Game loop

Look at the project first.

- Sprites, tiles, canvas, or Godot 2D nodes: this is 2D. Follow `game-2d`.
- Meshes, a perspective camera, or a 3D scene: this is 3D. Follow `game-3d`.
- Empty project: use the dimension the user just asked for. If they did not say, ask once. Do not guess a 3D camera for a flat game.

Do not mix the two in one slice. Do not switch dimension mid-project unless the user says to.

Then, in order:

1. `game-slice` for the one playable change.
2. `game-assets` if the player will see or hear something new.
3. `game-judge` on the running game.
4. `game-rollback` only if the judge says this slice got worse.

Stay on one agent.
